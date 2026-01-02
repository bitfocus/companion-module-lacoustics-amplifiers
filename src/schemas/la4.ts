import * as z from 'zod'
import * as Schemas from './base.js'
import * as Enums from '../enums/enums.js'

export const NetworkSchema = z.object({
	ip: z.object({
		active: z.object({
			primary: Schemas.IpConfigSchema,
		}),
		select: Schemas.Nullable(z.object({ input: z.object({ primary: Schemas.IpConfigSchema }) })),
	}),
})

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

export const MonitorOutputErrorSchema = z.object({
	cross_conduct: Schemas.Bool,
	dc_warning: Schemas.Bool,
	channel_error: Schemas.Bool,
	dc_error: Schemas.Bool,
})

export const MonitorOutputSchema = Schemas.Index.extend({
	clip: Schemas.Bool,
	limit: Schemas.Bool,
	state: Enums.MonitorOutputStateEnum,
	temperature_state: Enums.MonitorOutputTemperatureStateEnum,
	errors: MonitorOutputErrorSchema,
})

export const MonitorSchema = z.object({
	error: Enums.MonitorErrorEnum,
	fuse_protect: Enums.MonitorFuseProtectEnum,
	output: z.array(MonitorOutputSchema),
})

export const DeviceSchema = z.object({
	info: Schemas.InfoSchema.extend({
		name: z.literal('LA4'),
	}),
	network: NetworkSchema,
	hmi: Schemas.HmiSchema.omit({ option: true }),
	lldp: Schemas.LldpSchema,
	input: InputSchema,
	routing: Schemas.RoutingSchema,
	aes: Schemas.AesSchema,
	power: Schemas.PowerSchema,
	configuration: Schemas.ConfigurationSchema,
	level: Schemas.LevelSchema,
	layout: Schemas.LayoutSchema,
	en54: Schemas.En54Schema,
	monitor: MonitorSchema,
	control: Schemas.ControlSchema,
})

export type NetworkSchema = z.infer<typeof NetworkSchema>
export type InputSchema = z.infer<typeof InputSchema>
export type MonitorOutputErrorSchema = z.infer<typeof MonitorOutputErrorSchema>
export type MonitorOutputSchema = z.infer<typeof MonitorOutputSchema>
export type MonitorSchema = z.infer<typeof MonitorSchema>
export type DeviceSchema = z.infer<typeof DeviceSchema>
