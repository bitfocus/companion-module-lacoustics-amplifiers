import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InstanceStatus } from '@companion-module/base'
import axios, { type AxiosInstance } from 'axios'
import ModuleInstance from '../main.js'
import type { ModuleConfig, ModuleSecrets } from '../config.js'
import { DeviceSchemasByName } from '../schemas/index.js'
import { captureLogs, releaseLogs, type LogLine } from './helpers/logs.js'
import { buildPayload } from './helpers/payloads.js'

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

/**
 * Serve device responses from a payload: the root url gets all of it, a domain url gets that domain
 */
function mockDevice(payload: Record<string, unknown>): void {
	vi.spyOn(axios, 'create').mockReturnValue({
		get: vi.fn(async (url: string) => Promise.resolve({ data: url === '' ? payload : payload[url] })),
	} as unknown as AxiosInstance)
}

const config = { host: '192.0.2.1' } as ModuleConfig
const secrets: ModuleSecrets = { password: '' }

describe('configUpdated when the device payload is rejected', () => {
	let context: Record<string | symbol, unknown>
	let instance: ModuleInstance

	beforeEach(() => {
		const payload = buildPayload(DeviceSchemasByName['LA4X']) as Record<string, any>
		payload.info.serial = 42
		mockDevice(payload)
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
		expect(updateStatus).toHaveBeenLastCalledWith(InstanceStatus.UnknownWarning, 'Invalid data returned by device')
	})
})

describe('verbose logging', () => {
	const payload = buildPayload(DeviceSchemasByName['LA4X']) as Record<string, any>
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
