import * as z from 'zod'
import * as Schemas from './base.js'
//import * as Enums from '../enums/enums.js'
import * as LA716i from './la716i.js'

export const DeviceSchema = LA716i.DeviceSchema.extend({
	info: Schemas.InfoSchema.extend({
		name: z.literal('LA1.16i'),
	}),
	/*
	 * The LA1.16i keeps the base power schema. The LA7.16i overrides `power.status`
	 * with a single boolean `smps`, and that override would otherwise be inherited
	 * along with the rest of its schema — but the LA1.16i was confirmed working
	 * against a live device with the per-supply array, so it is restored here.
	 */
	power: Schemas.PowerSchema,
})

export type DeviceSchema = z.infer<typeof DeviceSchema>
