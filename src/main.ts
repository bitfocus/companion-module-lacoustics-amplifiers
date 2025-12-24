import { InstanceBase, runEntrypoint, InstanceStatus, SomeCompanionConfigField } from '@companion-module/base'
import { GetConfigFields, type ModuleConfig, type ModuleSecrets } from './config.js'
import { UpdateVariableDefinitions } from './variables.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import axios, { AxiosInstance, type AxiosResponse } from 'axios'
import PQueue from 'p-queue'

export class ModuleInstance extends InstanceBase<ModuleConfig, ModuleSecrets> {
	#config!: ModuleConfig // Setup in init()
	#secrets!: ModuleSecrets // Setup in init()
	#client!: AxiosInstance
	#queue = new PQueue({ concurrency: 10, autoStart: true, interval: 50, intervalCap: 1 })
	#controller = new AbortController()

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: ModuleConfig, _isFirstInit: boolean, secrets: ModuleSecrets): Promise<void> {
		this.#config = config
		this.#secrets = secrets
		this.updateStatus(InstanceStatus.Ok)

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
	}
	// When module gets deleted
	async destroy(): Promise<void> {
		this.log('debug', `destroy ${this.id}:${this.label}`)
		this.#controller.abort()
		this.#queue.clear()
	}

	async configUpdated(config: ModuleConfig, secrets: ModuleSecrets): Promise<void> {
		this.#queue.clear()
		this.#controller.abort()
		this.#controller = new AbortController()
		this.#config = config
		this.#secrets = secrets
		if (config.host) {
			this.updateStatus(InstanceStatus.Connecting)
			this.initClient(this.#config, this.#secrets)
		} else {
			this.updateStatus(InstanceStatus.BadConfig, 'No Host Configured')
			return
		}
		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
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
	}

	public async clientGet(url: string): Promise<AxiosResponse<any, any>> {
		return await this.#queue.add(async () => {
			const response = await this.#client.get(url)
			return response
		})
	}

	public async clientPost(url: string, data: unknown): Promise<AxiosResponse<any, any>> {
		return await this.#queue.add(async () => {
			const response = await this.#client.post(url, data)
			return response
		})
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
