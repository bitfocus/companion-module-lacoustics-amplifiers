import { describe, expectTypeOf, it } from 'vitest'
import type { ModuleConfig } from '../config.js'

describe('ModuleConfig', () => {
	/*
	 * `interval` was once declared as the literal `4` rather than `number`, which
	 * typechecks on its own but makes every value the config field can actually
	 * hold (200-60000, default 1000) unassignable. Nothing at runtime notices, so
	 * this has to be pinned at the type level.
	 */
	it('types interval as a number, not one literal value', () => {
		expectTypeOf<ModuleConfig['interval']>().toEqualTypeOf<number>()
	})

	it('accepts the default and the ends of the range the config field offers', () => {
		expectTypeOf<200>().toMatchTypeOf<ModuleConfig['interval']>()
		expectTypeOf<1000>().toMatchTypeOf<ModuleConfig['interval']>()
		expectTypeOf<60000>().toMatchTypeOf<ModuleConfig['interval']>()
	})

	it('types the remaining fields as their value kinds', () => {
		expectTypeOf<ModuleConfig['host']>().toEqualTypeOf<string>()
		expectTypeOf<ModuleConfig['username']>().toEqualTypeOf<string>()
		expectTypeOf<ModuleConfig['auth']>().toEqualTypeOf<boolean>()
		expectTypeOf<ModuleConfig['verbose']>().toEqualTypeOf<boolean>()
	})
})
