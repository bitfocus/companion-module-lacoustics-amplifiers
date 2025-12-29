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

export type NetworkSchema = z.infer<typeof NetworkSchema>

export const InputSchema = z.object({
	fallback: z.object({
		test: Schemas.Nullable(z.any()),
	}),
	aes: z.object({
		clear: Schemas.Nullable(z.any()),
		enable: Schemas.Bool,
		active: Schemas.Bool,
	}),
	xlr: z.object({
		ab: Schemas.XlrInputSelectSchema,
		//cd: Schemas.XlrInputSelectSchema,
	}),
})

export const DeviceSchema = z.object({
	info: Schemas.InfoSchema.extend({
		name: z.literal('LA4'),
	}),
	network: NetworkSchema,
	hmi: Schemas.HmiSchema.omit({ option: true }),
	lldp: Schemas.LldpSchema,
	input: InputSchema,
	//-------------------------
	/* 	ptp: Schemas.PtpSchema,
	bridge: Schemas.BridgeSchema,

	routing: Schemas.RoutingSchema,
	power: Schemas.PowerSchema,
	gpio: Schemas.GpioSchema,
	control: Schemas.ControlSchema,
	clock: Schemas.ClockSchema,
	monitor: Schemas.MonitorSchema,
	en54: Schemas.En54Schema,
	level: Schemas.LevelSchema,
	layout: Schemas.LayoutSchema,
	avb: Schemas.AvbSchema,
	aes67: Schemas.Aes67Schema, */
})

export type DeviceSchema = z.infer<typeof DeviceSchema>
