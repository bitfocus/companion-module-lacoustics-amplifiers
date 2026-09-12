import { beforeEach, describe, expect, it } from 'vitest'
import { LacousticsDevice } from '../device.js'
import { DeviceSchemasByName } from '../schemas/index.js'
import { buildPayload } from './helpers/payloads.js'

const fullPayload = () => buildPayload(DeviceSchemasByName['LA4X']) as Record<string, any>

describe('LacousticsDevice.fromUnknown', () => {
	it('accepts a valid payload and reports the model', () => {
		expect(LacousticsDevice.fromUnknown(fullPayload()).name).toBe('LA4X')
	})

	it('accepts the payload as a JSON string', () => {
		expect(LacousticsDevice.fromUnknown(JSON.stringify(fullPayload())).name).toBe('LA4X')
	})

	it('rejects an unrecognised model', () => {
		const payload = fullPayload()
		payload.info.name = 'NotARealAmp'
		expect(() => LacousticsDevice.fromUnknown(payload)).toThrow(/Unsupported device type/)
	})

	it('rejects a payload that does not match its own model schema', () => {
		const payload = fullPayload()
		payload.info.serial = 42
		expect(() => LacousticsDevice.fromUnknown(payload)).toThrow()
	})
})

describe('partial device updates', () => {
	let device: LacousticsDevice<'LA4X'>

	beforeEach(() => {
		device = LacousticsDevice.fromUnknown(fullPayload()) as LacousticsDevice<'LA4X'>
	})

	it('merges a top-level key and leaves the others alone', () => {
		const before = device.info.serial
		device.devicePartial = { power: { ...fullPayload().power, standby: true } }
		expect(device.powerStandby).toBe(true)
		expect(device.info.serial).toBe(before)
	})

	/*
	 * `.partial()` only makes the TOP-level keys optional, so this setter needs a
	 * complete domain object — which is what it gets, one endpoint's whole
	 * response at a time. Anything shallower belongs in deviceDeepPartial.
	 */
	it('requires the whole domain object, not an arbitrary fragment of one', () => {
		expect(() => (device.devicePartial = { power: { standby: true } })).toThrow()
	})

	it('rejects a partial update with a wrongly typed value', () => {
		expect(() => (device.devicePartial = { info: { serial: 42 } })).toThrow()
	})

	it('ignores keys that are not part of the schema', () => {
		expect(() => (device.devicePartial = { notADeviceKey: 'nope' })).not.toThrow()
	})
})

describe('deep partial device updates', () => {
	let device: LacousticsDevice<'LA4X'>

	beforeEach(() => {
		device = LacousticsDevice.fromUnknown(fullPayload()) as LacousticsDevice<'LA4X'>
	})

	it('merges one leaf without dropping its siblings', () => {
		const before = device.info.serial
		device.deviceDeepPartial({ info: { unit_name: 'Stage Left' } })
		expect(device.info.unit_name).toBe('Stage Left')
		expect(device.info.serial).toBe(before)
	})

	it('returns the subscription keys it touched, so the right feedbacks get checked', () => {
		expect(device.deviceDeepPartial({ power: { standby: true } })).toEqual(['power'])
	})

	it('returns every touched key when several domains change at once', () => {
		const keys = device.deviceDeepPartial({ power: { standby: true }, info: { unit_name: 'Stage Right' } })
		expect(new Set(keys)).toEqual(new Set(['power', 'info']))
	})

	it('returns no keys for an empty update', () => {
		expect(device.deviceDeepPartial({})).toEqual([])
	})

	it('does not report keys that are not feedback subscription keys', () => {
		expect(device.deviceDeepPartial({ notADeviceKey: 'nope' })).toEqual([])
	})

	it('rejects a deep partial update with a wrongly typed value', () => {
		expect(() => device.deviceDeepPartial({ power: { standby: 'yes' } })).toThrow()
	})
})
