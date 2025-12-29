import * as z from 'zod'
import * as Schemas from './base.js'
import * as LA4 from './la4.js'

export const DeviceSchema = LA4.DeviceSchema.extend({
	info: Schemas.InfoSchema.extend({
		name: z.literal('LA8'),
	}),
})
export type DeviceSchema = z.infer<typeof DeviceSchema>
