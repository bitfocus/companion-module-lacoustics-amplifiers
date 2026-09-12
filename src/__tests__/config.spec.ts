import { describe, expect, it } from 'vitest'
import { GetConfigFields } from '../config.js'

const fields = GetConfigFields()
const byId = new Map(fields.map((field) => [field.id, field]))

describe('GetConfigFields', () => {
	it('offers every field ModuleConfig declares, plus the secret', () => {
		// password is declared on ModuleSecrets rather than ModuleConfig, but is
		// still presented as a config field
		expect([...byId.keys()].sort()).toEqual(['auth', 'host', 'interval', 'password', 'username', 'verbose'])
	})

	it('offers the poll interval as a number field with a usable range', () => {
		const interval = byId.get('interval')
		expect(interval?.type).toBe('number')
		// The range the type has to be able to hold — see config.spec-d.ts
		expect(interval).toMatchObject({ min: 200, max: 60000, default: 1000 })
	})

	it('defaults the poll interval inside its own range', () => {
		const interval = byId.get('interval')
		if (interval?.type !== 'number') throw new Error('interval is not a number field')
		expect(interval.default).toBeGreaterThanOrEqual(interval.min)
		expect(interval.default).toBeLessThanOrEqual(interval.max)
	})
})
