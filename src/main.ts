import { InstanceBase, runEntrypoint, InstanceStatus, SomeCompanionConfigField } from '@companion-module/base'
import { GetConfigFields, type ModuleConfig, type ModuleSecrets } from './config.js'
import { UpdateVariableDefinitions } from './variables.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import { LacousticDevice } from './device.js'
import { StatusManager } from './status.js'
import axios, { AxiosInstance, type AxiosResponse } from 'axios'
import PQueue from 'p-queue'
import { ZodError } from 'zod'

export class ModuleInstance extends InstanceBase<ModuleConfig, ModuleSecrets> {
	#config!: ModuleConfig // Setup in init()
	#secrets!: ModuleSecrets // Setup in init()
	#client!: AxiosInstance
	#queue = new PQueue({ concurrency: 10, autoStart: true, interval: 50, intervalCap: 1 })
	#statusManager = new StatusManager(this, { status: InstanceStatus.Connecting, message: 'Connecting' }, 1000)
	#controller = new AbortController()
	device!: LacousticDevice
	#pollTimer: NodeJS.Timeout | undefined = undefined

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
		this.#statusManager.destroy()
		if (this.#pollTimer) clearTimeout(this.#pollTimer)
	}

	async configUpdated(config: ModuleConfig, secrets: ModuleSecrets): Promise<void> {
		if (this.#pollTimer) clearTimeout(this.#pollTimer)
		this.#queue.clear()
		this.#controller.abort()
		this.#controller = new AbortController()
		this.#config = config
		this.#secrets = secrets
		if (config.host) {
			this.#statusManager.updateStatus(InstanceStatus.Connecting)
			this.initClient(this.#config, this.#secrets)
			await this.initDevice()
			this.updateActions() // export actions
			this.updateFeedbacks() // export feedbacks
			this.updateVariableDefinitions() // export variable definitions
		} else {
			this.#statusManager.updateStatus(InstanceStatus.BadConfig, 'No Host Configured')
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
			signal: this.#controller.signal,
			headers: {
				'User-Agent': `companion-module/${this.label}`,
				'Content-Type': 'application/json',
			},
		})
		this.debug(`Axios client initialised`)
	}

	public async clientGet(url: string): Promise<AxiosResponse<any, any>> {
		return await this.#queue.add(
			async () => {
				if (!this.#client) throw new Error('Axios Client not initialised')
				const response = await this.#client.get(url)
				this.debug(response.data)
				this.#statusManager.updateStatus(InstanceStatus.Ok)
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
			async () => {
				if (!this.#client) throw new Error('Axios Client not initialised')
				const response = await this.#client.post(url, data)
				this.debug(response.data)
				this.#statusManager.updateStatus(InstanceStatus.Ok)
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
			this.device = new LacousticDevice(response.data)
			this.checkFeedbacks()
			this.#pollTimer = setTimeout(() => {
				this.pollDevice().catch(() => {})
			}, this.#config.interval ?? 1000)
		} catch (err) {
			this.log('error', 'Could not initialise device')
			this.handleError(err)
		}
	}

	private async pollDevice(): Promise<void> {
		try {
			const response = await this.clientGet('')
			this.debug(response.data)
			this.device.device = response.data
			this.checkFeedbacks()
		} catch (err) {
			this.log('warn', 'Polling error')
			this.handleError(err)
		}
		this.#pollTimer = setTimeout(() => {
			this.pollDevice().catch(() => {})
		}, this.#config.interval ?? 1000)
	}

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	public handleError(err: any): void {
		if (axios.isAxiosError(err)) {
			// Access specific AxiosError properties
			this.debug(err)
			if (err.response) {
				// 1. The server responded with a status code outside 2xx (e.g., 404, 500)
				this.#statusManager.updateStatus(InstanceStatus.UnknownWarning)
				this.log('error', `Status: ${err.response.status}`)
				this.log('error', `Data: ${err.response.data}`)
			} else if (err.request) {
				// 2. The request was made but no response was received (e.g., network timeout)
				this.#statusManager.updateStatus(InstanceStatus.ConnectionFailure)
				this.log('error', `Network Error / No Response: ${err.request}`)
			} else {
				// 3. Something happened while setting up the request
				this.#statusManager.updateStatus(InstanceStatus.UnknownError)
				this.log('error', `Setup Error: ${err.message}`)
			}
		} else if (err instanceof ZodError) {
			this.debug(err)
			this.log('warn', `Invalid data returned: \n${JSON.stringify(err.issues)}`)
		} else {
			// Non-Axios error (e.g., syntax error in your code)
			this.#statusManager.updateStatus(InstanceStatus.UnknownError)
			this.log('error', `Unknown Error: ${err}`)
		}
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
}

runEntrypoint(ModuleInstance, UpgradeScripts)
