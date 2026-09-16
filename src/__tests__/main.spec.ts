import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InstanceStatus } from '@companion-module/base'
import axios, { AxiosError, type AxiosInstance } from 'axios'
import ModuleInstance from '../main.js'
import type * as Reconnect from '../reconnect.js'
import type { ModuleConfig, ModuleSecrets } from '../config.js'
import { DeviceSchemasByName } from '../schemas/index.js'
import { captureLogs, releaseLogs, type LogLine } from './helpers/logs.js'
import { buildPayload } from './helpers/payloads.js'

// Shrink the backoff so a retry lands well inside the test timeout
vi.mock('../reconnect.js', async (importOriginal) => {
	const actual = await importOriginal<typeof Reconnect>()
	return { ...actual, RECONNECT_BACKOFF: { initialDelayMs: 20, maxDelayMs: 40 } }
})

/**
 * Stand-in for the host context: every method is a spy, created on first access
 */
function fakeContext(): Record<string | symbol, unknown> {
	const target: Record<string | symbol, unknown> = { _isInstanceContext: true, id: 'test', label: 'test' }
	return new Proxy(target, {
		get: (t, prop) => {
			if (prop === 'then') return undefined
			if (!(prop in t)) t[prop] = vi.fn()
			return t[prop]
		},
	})
}

/** Serve device responses from this get implementation */
function mockClient(get: (url: string) => Promise<{ data: unknown }>): void {
	vi.spyOn(axios, 'create').mockReturnValue({ get: vi.fn(get) } as unknown as AxiosInstance)
}

/** Serve a payload: the root url gets all of it, a domain url gets that domain */
function mockDevice(payload: Record<string, unknown>): void {
	mockClient(async (url: string) => Promise.resolve({ data: url === '' ? payload : payload[url] }))
}

const validPayload = () => buildPayload(DeviceSchemasByName['LA4X']) as Record<string, any>

const rejectedPayload = () => {
	const payload = validPayload()
	payload.info.serial = 42
	return payload
}

/** The device is there but not answering, as an amp that is powered off looks */
const timeout = () => new AxiosError('Request timed out', 'ETIMEDOUT', undefined, {})

/** The device answered, refusing the credentials */
const unauthorized = () =>
	new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', undefined, {}, {
		status: 401,
		data: '',
	} as unknown as AxiosError['response'])

const config = { host: '192.0.2.1' } as ModuleConfig
const secrets: ModuleSecrets = { password: '' }

const settle = async (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms))

describe('configUpdated when the device payload is rejected', () => {
	let context: Record<string | symbol, unknown>
	let instance: ModuleInstance

	beforeEach(() => {
		mockDevice(rejectedPayload())
		context = fakeContext()
		instance = new ModuleInstance(context)
	})

	afterEach(async () => {
		await instance.destroy()
		vi.restoreAllMocks()
	})

	// There is no device to build definitions from, which used to throw reading `outputDspChannelCount` of undefined
	it('resolves without exporting any definitions', async () => {
		await expect(instance.configUpdated(config, secrets)).resolves.toBeUndefined()
		expect(context.setActionDefinitions).not.toHaveBeenCalled()
		expect(context.setFeedbackDefinitions).not.toHaveBeenCalled()
		expect(context.setVariableDefinitions).not.toHaveBeenCalled()
	})

	it('does not leave the connection reporting Ok', async () => {
		const updateStatus = vi.spyOn(instance.statusManager, 'updateStatus')
		await instance.configUpdated(config, secrets)
		expect(updateStatus).toHaveBeenLastCalledWith(
			InstanceStatus.UnknownWarning,
			expect.stringContaining('Invalid data from device, retrying in'),
		)
	})
})

describe('retrying a failed connection', () => {
	let context: Record<string | symbol, unknown>
	let instance: ModuleInstance
	let lines: LogLine[]

	beforeEach(() => {
		lines = captureLogs()
		context = fakeContext()
	})

	afterEach(async () => {
		await instance.destroy()
		vi.restoreAllMocks()
		releaseLogs()
	})

	const warnings = () => lines.filter((line) => line.level === 'warn').map((line) => line.message)

	/*
	 * An amp powered on with the rack is unreachable when Companion starts and
	 * answers a little later. Before the retry, that connection stayed dead until
	 * someone re-saved its config.
	 */
	it('keeps trying an unreachable device, and exports definitions once it answers', async () => {
		const payload = validPayload()
		let attempts = 0
		mockClient(async (url: string) => {
			attempts++
			if (attempts === 1) throw timeout()
			return Promise.resolve({ data: url === '' ? payload : payload[url] })
		})
		instance = new ModuleInstance(context)

		await instance.configUpdated(config, secrets)
		expect(context.setActionDefinitions).not.toHaveBeenCalled()

		await vi.waitFor(() => expect(context.setActionDefinitions).toHaveBeenCalled())
	})

	it('says it is retrying, rather than just reporting a failure', async () => {
		mockClient(async () => Promise.reject(timeout()))
		instance = new ModuleInstance(context)
		const updateStatus = vi.spyOn(instance.statusManager, 'updateStatus')

		await instance.configUpdated(config, secrets)

		expect(updateStatus).toHaveBeenLastCalledWith(
			InstanceStatus.ConnectionFailure,
			expect.stringContaining('retrying in'),
		)
	})

	// Retrying cannot fix a password, and configUpdated runs again anyway when one is entered
	it('gives up when the credentials are rejected', async () => {
		const get = vi.fn(async () => Promise.reject(unauthorized()))
		mockClient(get)
		instance = new ModuleInstance(context)

		await instance.configUpdated(config, secrets)
		await settle()

		expect(get).toHaveBeenCalledTimes(1)
	})

	/*
	 * An amp can serve the API while still booting, so a rejected payload is worth
	 * retrying — but the full issue list once per retry, forever, is not
	 */
	it('logs the detail of a rejected payload once, then a summary', async () => {
		mockDevice(rejectedPayload())
		instance = new ModuleInstance(context)

		await instance.configUpdated(config, secrets)
		await vi.waitFor(() => expect(warnings().length).toBeGreaterThan(1))

		expect(warnings()[0]).toContain('info.serial: Invalid input: expected string, received number (value: 42)')
		expect(warnings()[1]).toContain('detail logged on the first attempt')
		expect(warnings()[1]).not.toContain('(value:')
	})
})

describe('verbose logging', () => {
	const payload = validPayload()
	const verboseConfig = { ...config, verbose: true } as ModuleConfig
	let instance: ModuleInstance
	let lines: LogLine[]

	beforeEach(() => {
		lines = captureLogs()
		mockDevice(payload)
		instance = new ModuleInstance(fakeContext())
	})

	afterEach(async () => {
		await instance.destroy()
		vi.restoreAllMocks()
		releaseLogs()
	})

	/** How many debug lines are exactly this response */
	const timesLogged = (data: unknown) =>
		lines.filter((line) => line.level === 'debug' && line.message === JSON.stringify(data)).length

	it('logs the initial device query once', async () => {
		await instance.configUpdated(verboseConfig, secrets)
		expect(timesLogged(payload)).toBe(1)
	})

	it('logs a one off domain query once', async () => {
		await instance.configUpdated(verboseConfig, secrets)
		await instance.queryDevice('power')
		expect(timesLogged(payload.power)).toBe(1)
	})
})
