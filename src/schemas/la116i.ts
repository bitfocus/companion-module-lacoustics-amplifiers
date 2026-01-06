import * as z from 'zod'
import * as Schemas from './base.js'
//import * as Enums from '../enums/enums.js'
import * as LA716i from './la716i.js'

export const DeviceSchema = LA716i.DeviceSchema.extend({
	info: Schemas.InfoSchema.extend({
		name: z.literal('LA1.16i'),
	}),
})

export type DeviceSchema = z.infer<typeof DeviceSchema>
