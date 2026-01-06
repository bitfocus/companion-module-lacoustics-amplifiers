import * as z from 'zod'
import * as Schemas from './base.js'
//import * as Enums from '../enums/enums.js'

export const NetworkSchema = z.object({
	ip: z.object({
		active: z.object({
			primary: Schemas.IpConfigSchema,
		}),
		select: Schemas.Nullable(z.object({ input: z.object({ primary: Schemas.IpConfigSchema }) })),
	}),
})

export const DeviceSchema = z.object({
	info: Schemas.InfoSchema.extend({
		name: z.literal('LS10'),
	}),
	network: NetworkSchema,
	hmi: Schemas.HmiSchema.omit({ lock: true, unit: true, option: true, intensity: true }),
	//bridge: Schemas.BridgeSchema,
	lldp: Schemas.LldpSchema,
	power: Schemas.PowerSchema.extend({
		reset: z.nullable(z.any()),
		backup: Schemas.Bool,
		status: z.object({
			mains: Schemas.Bool,
			inp24v: Schemas.Bool,
			out24v: Schemas.Bool,
			internal: Schemas.Bool,
		}),
	}),
	//gpio: Schemas.GpioSchema,
	monitor: z.object({
		button_state: Schemas.Bool,
	}),
})

export type NetworkSchema = z.infer<typeof NetworkSchema>
export type DeviceSchema = z.infer<typeof DeviceSchema>
