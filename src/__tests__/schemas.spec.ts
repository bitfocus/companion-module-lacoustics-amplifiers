import { describe, expect, it } from 'vitest'
import * as z from 'zod'
import { zx } from '@traversable/zod'
import {
	deepPartialDeviceSchema,
	DeviceSchemasByName,
	partialDeviceSchema,
	type InfoNameEnum,
} from '../schemas/index.js'
import { buildPayload, partialPayloadCorpus, serialiseResult } from './helpers/payloads.js'

const modelNames = Object.keys(DeviceSchemasByName) as InfoNameEnum[]

describe('payload fixtures', () => {
	// If this fails the corpus no longer covers the schemas and every equivalence
	// test below is comparing parsers on input they all reject.
	it.each(modelNames)('%s builds a payload that satisfies its own schema', (name) => {
		const result = DeviceSchemasByName[name].safeParse(buildPayload(DeviceSchemasByName[name]))
		expect(result.success, result.success ? '' : JSON.stringify(result.error.issues.slice(0, 5), null, 1)).toBe(true)
	})
})

describe('derived device schemas are memoised', () => {
	it.each(modelNames)('%s returns the identical partial schema instance each call', (name) => {
		expect(partialDeviceSchema(name)).toBe(partialDeviceSchema(name))
	})

	it.each(modelNames)('%s returns the identical deep partial schema instance each call', (name) => {
		expect(deepPartialDeviceSchema(name)).toBe(deepPartialDeviceSchema(name))
	})

	it('does not hand one model the schema of another', () => {
		const seen = new Set(modelNames.map((name) => partialDeviceSchema(name)))
		expect(seen.size).toBe(modelNames.length)
	})
})

describe('derived device schemas are genuinely compiled', () => {
	/*
	 * z.compile() falls back to the runtime parser silently for a schema it cannot
	 * model, so a change to the schemas could lose the optimisation with nothing
	 * failing. strict:true turns that silent fallback into a throw, which is the
	 * only way to pin it.
	 */
	it.each(modelNames)('%s partial compiles without refusal', (name) => {
		expect(() => z.compile(DeviceSchemasByName[name].partial(), { strict: true })).not.toThrow()
	})

	it.each(modelNames)('%s deep partial compiles without refusal', (name) => {
		expect(() => z.compile(zx.deepPartial(DeviceSchemasByName[name]), { strict: true })).not.toThrow()
	})
})

describe('compiling and memoising does not change parse results', () => {
	it.each(modelNames)('%s partial matches a freshly derived uncompiled schema', (name) => {
		const compiled = partialDeviceSchema(name)
		const reference = DeviceSchemasByName[name].partial()
		for (const payload of partialPayloadCorpus(DeviceSchemasByName[name])) {
			expect(serialiseResult(compiled.safeParse(payload))).toBe(serialiseResult(reference.safeParse(payload)))
		}
	})

	it.each(modelNames)('%s deep partial matches a freshly derived uncompiled schema', (name) => {
		const compiled = deepPartialDeviceSchema(name)
		const reference = zx.deepPartial(DeviceSchemasByName[name])
		for (const payload of partialPayloadCorpus(DeviceSchemasByName[name])) {
			expect(serialiseResult(compiled.safeParse(payload))).toBe(serialiseResult(reference.safeParse(payload)))
		}
	})

	it.each(modelNames)('%s still rejects wrongly typed values', (name) => {
		const compiled = partialDeviceSchema(name)
		const reference = DeviceSchemasByName[name].partial()
		for (const payload of [{ info: { serial: 42 } }, { info: 'not an object' }, { power: null }]) {
			expect(compiled.safeParse(payload).success).toBe(false)
			expect(serialiseResult(compiled.safeParse(payload))).toBe(serialiseResult(reference.safeParse(payload)))
		}
	})

	it.each(modelNames)('%s still strips unknown keys', (name) => {
		const parsed = partialDeviceSchema(name).safeParse({ notADeviceKey: 'nope' })
		expect(parsed.success).toBe(true)
		expect(parsed.success && parsed.data).toEqual({})
	})
})

describe("zod's native deepPartial matches @traversable/zod's", () => {
	/*
	 * Not used by the module — this pins the finding that the two agree, so the
	 * dependency can be dropped later without re-doing the comparison. If this
	 * starts failing, they have diverged and the migration is no longer free.
	 */
	it.each(modelNames)('%s agrees across the payload corpus', (name) => {
		const traversable = zx.deepPartial(DeviceSchemasByName[name])
		const native = z.deepPartial(DeviceSchemasByName[name])
		for (const payload of partialPayloadCorpus(DeviceSchemasByName[name])) {
			expect(serialiseResult(native.safeParse(payload))).toBe(serialiseResult(traversable.safeParse(payload)))
		}
	})

	it('agrees on the cases where deep partial differs from a shallow partial', () => {
		const schema = DeviceSchemasByName['LA4X']
		const traversable = zx.deepPartial(schema)
		const native = z.deepPartial(schema)
		const probes = [
			{ routing: { output: [{ index: 1 }] } }, // array elements made partial
			{ routing: { output: [{}] } }, // array element with nothing in it
			{ network: {} }, // empty nested object
			{ power: { reboot: null } }, // nullable preserved
		]
		for (const payload of probes) {
			const nativeResult = native.safeParse(payload)
			expect(nativeResult.success).toBe(true)
			expect(serialiseResult(nativeResult)).toBe(serialiseResult(traversable.safeParse(payload)))
		}
	})
})
