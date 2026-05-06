import { InstanceBase, InstanceStatus, SomeCompanionConfigField } from '@companion-module/base'
import { GetConfigFields, type ModuleConfig, type ModuleSecrets } from './config.js'
import { UpdateVariableDefinitions, UpdateVariableValues } from './variables.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { handleError } from './errors.js'
import { UpdateFeedbacks } from './feedbacks.js'
import { LacousticsDevice } from './device.js'
import { StatusManager } from './status.js'
import * as Enums from './enums/enums.js'
import { FeedbackSubscriptionKey, feedbackSubscriptionKeys, type InstanceBaseExt, type ModuleTypes } from './types.js'
import axios, { AxiosInstance, type AxiosResponse } from 'axios'
import PQueue from 'p-queue'
import { throttle, type ThrottledFunction } from 'es-toolkit'
import { DeviceSchemasByName } from './schemas/index.js'

export { UpgradeScripts }

export default class ModuleInstance extends InstanceBase<ModuleTypes> implements InstanceBaseExt {
	#config!: ModuleConfig // Setup in init()
	#secrets!: ModuleSecrets // Setup in init()
	#client!: AxiosInstance
	#queue = new PQueue({ concurrency: 10, autoStart: true, interval: 50, intervalCap: 1, strict: true })
	statusManager = new StatusManager(this, { status: InstanceStatus.Connecting, message: 'Connecting' }, 1000)
	#controller = new AbortController()
	device!: LacousticsDevice<Enums.InfoNameEnum>
	#pollTimer: NodeJS.Timeout | undefined = undefined
	feedbackSubscriptions = LacousticsDevice.initFeedbackSubscriptionTracker()
	throttledCheckFeedbacksById!: ThrottledFunction<() => void>
	#feedbacksToUpdate: Set<string> = new Set()
	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: ModuleConfig, _isFirstInit: boolean, secrets: ModuleSecrets): Promise<void> {
		this.#config = config
		this.#secrets = secrets
		this.configUpdated(config, secrets).catch(() => {})
	}
	// When module gets deleted
	async destroy(): Promise<void> {
		this.log('debug', `destroy ${this.id}:${this.label}`)
		this.#controller.abort()
		this.#queue.clear()
		this.statusManager.destroy()
		if (this.#pollTimer) clearTimeout(this.#pollTimer)
	}

	async configUpdated(config: ModuleConfig, secrets: ModuleSecrets): Promise<void> {
		if (this.#pollTimer) clearTimeout(this.#pollTimer)
		this.#queue.clear()
		this.#controller.abort()
		this.#controller = new AbortController()
		this.#feedbacksToUpdate.clear()

		// Set this.throttledCheckedFeedbacksById() here so that it references the new AbortController
		this.throttledCheckFeedbacksById = throttle(
			() => {
				if (this.#feedbacksToUpdate.size === 0) return
				this.checkFeedbacksById(...Array.from(this.#feedbacksToUpdate))
				this.#feedbacksToUpdate.clear()
			},
			50,
			{ edges: ['leading', 'trailing'], signal: this.#controller.signal },
		)

		this.#config = config
		this.#secrets = secrets
		if (config.host) {
			this.statusManager.updateStatus(InstanceStatus.Connecting)
			this.initClient(this.#config, this.#secrets)
			await this.initDevice()
			this.updateActions() // export actions
			this.updateFeedbacks() // export feedbacks
			this.updateVariableDefinitions() // export variable definitions
			this.feedbackSubscriptions.info.add('var')
			this.updateVariableValues()
			this.checkAllFeedbacks()
		} else {
			this.statusManager.updateStatus(InstanceStatus.BadConfig, 'No Host Configured')
			return
		}
	}

	initClient(config: ModuleConfig, secrets: ModuleSecrets): void {
		this.#client = axios.create({
			baseURL: `http://${config.host}/api/`,
			auth: config.auth
				? {
						username: config.username,
						password: secrets.password,
					}
				: undefined,
			timeout: 5000,
			headers: {
				'User-Agent': `companion-module/${this.label}`,
				'Content-Type': 'application/json',
			},
		})
		this.debug(`Axios client initialised`)
	}

	public async clientGet(url: string): Promise<AxiosResponse<any, any>> {
		return await this.#queue.add(
			async ({ signal }) => {
				if (!this.#client) throw new Error('Axios Client not initialised')
				const response = await this.#client.get(url, { signal: signal })
				this.debug(response.data)
				this.statusManager.updateStatus(InstanceStatus.Ok)
				return response
			},
			{
				signal: this.#controller.signal,
				priority: 0,
			},
		)
	}

	public async clientPost(url: string, data: unknown): Promise<AxiosResponse<any, any>> {
		return await this.#queue.add(
			async ({ signal }) => {
				if (!this.#client) throw new Error('Axios Client not initialised')
				const response = await this.#client.post(url, data, { signal: signal })
				this.debug(response.data)
				this.statusManager.updateStatus(InstanceStatus.Ok)
				return response
			},
			{
				signal: this.#controller.signal,
				priority: 1,
			},
		)
	}

	private async initDevice(): Promise<void> {
		try {
			const response = await this.clientGet('')
			this.debug(response.data)
			this.device = LacousticsDevice.fromUnknown(response.data)
			this.#pollTimer = setTimeout(() => {
				this.pollDevice().catch(() => {})
			}, this.#config.interval ?? 1000)
		} catch (err) {
			this.log('error', 'Could not initialise device')
			handleError(err, this)
		}
	}

	private async pollDevice(): Promise<void> {
		const { signal } = this.#controller
		const keysToCheck: FeedbackSubscriptionKey[] = []
		for (const key of feedbackSubscriptionKeys) {
			if (signal.aborted) return
			if (this.feedbackSubscriptions[key].size == 0) continue
			try {
				const response = await this.clientGet(key)
				this.debug(response.data)
				const data = { [key]: response.data }
				this.device.devicePartial = data
				keysToCheck.push(key)
			} catch (err) {
				this.log('warn', 'Polling error')
				handleError(err, this)
			}
		}
		if (signal.aborted) return
		this.checkFeedbackKeys(keysToCheck)
		this.updateVariableValues()
		this.#pollTimer = setTimeout(() => {
			this.pollDevice().catch(() => {})
		}, this.#config.interval ?? 1000)
	}

	/**
	 * Use this function for optimistic device and feedback updates from actions
	 * @param {unknown} data Some deep partial data to be updated
	 */
	public handlePartialDeviceUpdate(data: unknown): void {
		const keys = this.device.deviceDeepPartial(data)
		this.checkFeedbackKeys(keys)
	}

	public handleArrayItemUpdate<TItem extends { index: number }>(
		getArray: (device: DeviceSchemasByName[Enums.InfoNameEnum]) => TItem[] | undefined,
		channelIndex: number,
		update: Partial<TItem>,
		subscriptionKey: FeedbackSubscriptionKey,
	): void {
		const keys = this.device.updateArrayItem(getArray, channelIndex, update, subscriptionKey)
		this.checkFeedbackKeys(keys)
	}

	public checkFeedbackKeys(keys: FeedbackSubscriptionKey[]): void {
		if (keys.length == 0) return
		for (const key of keys) {
			this.feedbackSubscriptions[key].forEach((id) => {
				if (id !== 'var' && !id.startsWith('action_')) {
					this.#feedbacksToUpdate.add(id)
				}
			})
		}
		this.throttledCheckFeedbacksById()
	}

	public debug(data: object | string | number): void {
		if (this.#config.verbose) {
			if (typeof data == 'object') {
				this.log('debug', JSON.stringify(data))
			} else {
				this.log('debug', data.toString())
			}
		}
	}

	// Return config fields for web config
	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	updateActions(): void {
		UpdateActions(this)
	}

	updateFeedbacks(): void {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
	}

	updateVariableValues(): void {
		UpdateVariableValues(this)
	}
}
