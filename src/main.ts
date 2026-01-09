import { InstanceBase, runEntrypoint, InstanceStatus, SomeCompanionConfigField } from '@companion-module/base'
import { GetConfigFields, type ModuleConfig, type ModuleSecrets } from './config.js'
import { UpdateVariableDefinitions, UpdateVariableValues } from './variables.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import { LacousticDevice } from './device.js'
import { StatusManager } from './status.js'
import * as Enums from './enums/enums.js'
import { feedbackSubscriptionKeys } from './types.js'
import axios, { AxiosInstance, type AxiosResponse, AxiosError } from 'axios'
import PQueue from 'p-queue'
import { ZodError } from 'zod'
import { throttle } from 'es-toolkit'

export class ModuleInstance extends InstanceBase<ModuleConfig, ModuleSecrets> {
	#config!: ModuleConfig // Setup in init()
	#secrets!: ModuleSecrets // Setup in init()
	#client!: AxiosInstance
	#queue = new PQueue({ concurrency: 10, autoStart: true, interval: 50, intervalCap: 1, strict: true })
	#statusManager = new StatusManager(this, { status: InstanceStatus.Connecting, message: 'Connecting' }, 1000)
	#controller = new AbortController()
	device!: LacousticDevice<Enums.InfoNameEnum>
	#pollTimer: NodeJS.Timeout | undefined = undefined
	feedbackSubscriptions = LacousticDevice.initFeedbackSubscriptionTracker()
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
			this.feedbackSubscriptions.info.add('var')
			this.updateVariableValues()
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
			this.device = LacousticDevice.fromUnknown(response.data)
			this.#pollTimer = setTimeout(() => {
				this.pollDevice().catch(() => {})
			}, this.#config.interval ?? 1000)
		} catch (err) {
			this.log('error', 'Could not initialise device')
			this.handleError(err)
		}
	}

	private async pollDevice(): Promise<void> {
		for (const key of feedbackSubscriptionKeys) {
			if (this.feedbackSubscriptions[key].size == 0) continue
			try {
				const response = await this.clientGet(key)
				this.debug(response.data)
				const data = { [key]: response.data }
				this.device.devicePartial = data
				this.feedbackSubscriptions[key].forEach((id) => {
					if (id !== 'var') {
						this.#feedbacksToUpdate.add(id)
					}
				})
				this.throttledCheckFeedbacksById()
			} catch (err) {
				this.log('warn', 'Polling error')
				this.handleError(err)
			}
		}
		this.updateVariableValues()
		this.#pollTimer = setTimeout(() => {
			this.pollDevice().catch(() => {})
		}, this.#config.interval ?? 1000)
	}

	public handleError(err: unknown): void {
		if (axios.isAxiosError(err)) {
			this.#handleAxiosError(err)
		} else if (err instanceof ZodError) {
			this.#handleZodError(err)
		} else {
			this.#handleUnknownError(err)
		}
	}

	#handleAxiosError(err: AxiosError): void {
		this.debug(err)

		if (err.response) {
			// Server responded with error status (4xx, 5xx)
			this.#handleHttpError(err)
		} else if (err.request) {
			// Request sent but no response received (network/timeout issues)
			this.#handleNetworkError(err)
		} else {
			// Error during request setup
			this.#statusManager.updateStatus(InstanceStatus.UnknownError)
			this.log('error', `Request setup error: ${err.message}`)
		}
	}

	#handleHttpError(err: AxiosError): void {
		const status = err.response?.status

		// Set status based on HTTP response code
		if (status && status >= 500) {
			this.#statusManager.updateStatus(InstanceStatus.UnknownError)
			this.log('error', `Server error ${status}: ${err.message}`)
		} else if (status === 401 || status === 403) {
			this.#statusManager.updateStatus(InstanceStatus.AuthenticationFailure)
			this.log('error', `Authentication error ${status}: Check credentials`)
		} else if (status === 404) {
			this.#statusManager.updateStatus(InstanceStatus.UnknownWarning)
			this.log('error', `Not found ${status}: Endpoint may have changed`)
		} else if (status === 429) {
			this.#statusManager.updateStatus(InstanceStatus.UnknownWarning)
			this.log('error', `Rate limited ${status}: Too many requests`)
		} else {
			this.#statusManager.updateStatus(InstanceStatus.UnknownWarning)
			this.log('error', `HTTP ${status}: ${err.message}`)
		}

		// Log response data if useful
		if (err.response?.data && typeof err.response.data === 'string') {
			this.log('error', `Response: ${err.response.data}`)
		}
	}

	#handleNetworkError(err: AxiosError): void {
		const code = err.code

		switch (code) {
			case 'ECONNREFUSED':
				this.#statusManager.updateStatus(InstanceStatus.ConnectionFailure)
				this.log('error', 'Connection refused: Device may be offline or unreachable')
				break

			case 'ETIMEDOUT':
			case 'ECONNABORTED':
				this.#statusManager.updateStatus(InstanceStatus.ConnectionFailure)
				this.log('error', `Request timed out: Device not responding (${code})`)
				break

			case 'ENOTFOUND':
			case 'EAI_AGAIN':
				this.#statusManager.updateStatus(InstanceStatus.ConnectionFailure)
				this.log('error', `DNS resolution failed: Cannot find device hostname (${code})`)
				break

			case 'ENETUNREACH':
			case 'EHOSTUNREACH':
				this.#statusManager.updateStatus(InstanceStatus.ConnectionFailure)
				this.log('error', `Network unreachable: Check network connectivity (${code})`)
				break

			case 'ECONNRESET':
				this.#statusManager.updateStatus(InstanceStatus.ConnectionFailure)
				this.log('error', 'Connection reset: Device closed connection unexpectedly')
				break

			case 'EPIPE':
				this.#statusManager.updateStatus(InstanceStatus.ConnectionFailure)
				this.log('error', 'Broken pipe: Connection lost during transmission')
				break

			case 'ECANCELED':
				// Request was cancelled (e.g., by AbortController)
				this.log('warn', 'Request cancelled')
				// Don't change status for cancellations
				break

			case 'ERR_NETWORK':
				// Generic network error (often seen in browsers)
				this.#statusManager.updateStatus(InstanceStatus.ConnectionFailure)
				this.log('error', 'Network error: Check device connection')
				break

			case 'ERR_BAD_REQUEST':
				// Request was malformed
				this.#statusManager.updateStatus(InstanceStatus.UnknownError)
				this.log('error', `Bad request: ${err.message}`)
				break

			case 'ERR_BAD_RESPONSE':
				// Response was malformed
				this.#statusManager.updateStatus(InstanceStatus.UnknownWarning)
				this.log('error', `Invalid response from device: ${err.message}`)
				break

			default:
				// Unknown network error
				this.#statusManager.updateStatus(InstanceStatus.ConnectionFailure)
				this.log('error', `Network error${code ? ` (${code})` : ''}: ${err.message}`)
				break
		}

		// Additional context
		if (err.config?.url) {
			this.log('debug', `Failed URL: ${err.config.url}`)
		}
	}

	#handleZodError(err: ZodError): void {
		this.debug(err)

		// Format Zod errors more readably
		const formattedErrors = err.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('\n  ')

		this.log('warn', `Invalid data returned:\n  ${formattedErrors}`)
	}

	#handleUnknownError(err: unknown): void {
		this.#statusManager.updateStatus(InstanceStatus.UnknownError)

		// Safely stringify unknown errors
		const errorMessage = err instanceof Error ? err.message : String(err)

		this.log('error', `Unknown error: ${errorMessage}`)

		// Log stack trace if available
		if (err instanceof Error && err.stack) {
			this.debug(err.stack)
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

	throttledCheckFeedbacksById = throttle(
		() => {
			if (this.#feedbacksToUpdate.size === 0) return
			this.checkFeedbacksById(...Array.from(this.#feedbacksToUpdate))
			this.#feedbacksToUpdate.clear()
		},
		50,
		{ edges: ['leading', 'trailing'], signal: this.#controller.signal },
	)

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

runEntrypoint(ModuleInstance, UpgradeScripts)
