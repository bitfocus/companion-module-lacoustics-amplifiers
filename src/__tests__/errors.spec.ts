import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { handleError } from '../errors.js'
import { LacousticsDevice } from '../device.js'
import type ModuleInstance from '../main.js'
import { DeviceSchemasByName } from '../schemas/index.js'
import { captureLogs, releaseLogs, type LogLine } from './helpers/logs.js'
import { buildPayload } from './helpers/payloads.js'

const fakeInstance = () => ({ statusManager: { updateStatus: vi.fn() }, debug: vi.fn() }) as unknown as ModuleInstance

// LA7.16 still expects per-supply smps entries, so it rejects the boolean an LA7.16i sends
const la716Payload = () => buildPayload(DeviceSchemasByName['LA7.16']) as Record<string, any>

/** Parse the payload the way initDevice does, and hand back what it throws */
function rejectionOf(payload: unknown): unknown {
	try {
		LacousticsDevice.fromUnknown(payload)
	} catch (err) {
		return err
	}
	throw new Error('Payload was accepted')
}

describe('handleError for a rejected device payload', () => {
	let lines: LogLine[]

	beforeEach(() => {
		lines = captureLogs()
	})

	afterEach(() => {
		releaseLogs()
	})

	const warning = () => lines.find((line) => line.level === 'warn')?.message

	it('puts the rejected value in the warning, which reaches the main log', () => {
		const payload = la716Payload()
		payload.power.status.smps = false
		handleError(rejectionOf(payload), fakeInstance())
		expect(warning()).toContain('power.status.smps: Invalid input: expected array, received boolean (value: false)')
	})

	it('truncates a long rejected value', () => {
		const payload = la716Payload()
		payload.power = 'x'.repeat(1000)
		handleError(rejectionOf(payload), fakeInstance())
		expect(warning()).toContain(`power: Invalid input: expected object, received string (value: "${'x'.repeat(199)}…)`)
		expect(warning()).not.toContain('x'.repeat(200))
	})

	it('adds nothing for a missing key, where there is no value to show', () => {
		const payload = la716Payload()
		delete payload.power.status.smps
		handleError(rejectionOf(payload), fakeInstance())
		expect(warning()).toContain('power.status.smps: Invalid input: expected array, received undefined')
		expect(warning()).not.toContain('(value:')
	})
})
