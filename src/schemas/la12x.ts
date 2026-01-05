import * as z from 'zod'
import * as Schemas from './base.js'
import * as Enums from '../enums/enums.js'

export const InfoSchema = Schemas.InfoSchema.extend({
	name: z.literal('LA12X'),
})

export const NetworkSchema = Schemas.NetworkSchema.omit({ audio: true })

export const InputSchema = z.object({
	fallback: z.object({
		test: Schemas.Nullable(z.any()),
		aes: Schemas.InputFallbackSchema,
		network: Schemas.InputFallbackSchema,
	}),
	source: z.object({
		select: Enums.InputSourceSelectEnum,
		active: Enums.InputSourceSelectEnum,
	}),
	xlr: z.object({
		ab: Schemas.XlrInputSelectSchema,
		cd: Schemas.XlrInputSelectSchema,
	}),
})

export const AvdeccSchema = Schemas.AvdeccSchema

export const MonitorOutputErrorSchema = z.object({
	cross_conduct: Schemas.Bool,
	dc_warning: Schemas.Bool,
	dc_error: Schemas.Bool,
	init: Schemas.Bool,
	rail_overvoltage: Schemas.Bool,
	rail_undervoltage: Schemas.Bool,
	'15v_overvoltage': Schemas.Bool,
	'15v_undervoltage': Schemas.Bool,
	high_temperature: Schemas.Bool,
	over_temperature: Schemas.Bool,
	short_circuit: Schemas.Bool,
	hf: Schemas.Bool,
	under_impedance: Schemas.Bool,
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

export const ClockSchema = z.object({
	source: z.object({
		locked: Schemas.Bool,
		status: Enums.ClockSourceStatusEnum,
		type: Enums.LA2xiClockSourceTypeEnum,
	}),
})

export const DeviceSchema = z.object({
	info: InfoSchema,
	network: NetworkSchema,
	avdecc: AvdeccSchema,
	hmi: Schemas.HmiSchema.omit({ option: true }),
	ptp: Schemas.PtpSchema,
	bridge: Schemas.BridgeSchema,
	lldp: Schemas.LldpSchema,
	input: InputSchema,
	routing: Schemas.RoutingSchema,
	aes: Schemas.AesSchema,
	power: Schemas.PowerSchema.extend({
		status: z.object({
			smps: Schemas.Bool,
		}),
	}),
	configuration: Schemas.ConfigurationSchema,
	level: Schemas.LevelSchema,
	layout: Schemas.LayoutSchema,
	en54: Schemas.En54Schema,
	monitor: MonitorSchema,
	clock: ClockSchema,
	control: Schemas.ControlSchema,
	avb: Schemas.AvbSchema,
})

export type InfoSchema = z.infer<typeof InfoSchema>
export type NetworkSchema = z.infer<typeof NetworkSchema>
export type AvdeccSchema = z.infer<typeof AvdeccSchema>
export type InputSchema = z.infer<typeof InputSchema>
export type MonitorOutputErrorSchema = z.infer<typeof MonitorOutputErrorSchema>
export type MonitorOutputSchema = z.infer<typeof MonitorOutputSchema>
export type MonitorSchema = z.infer<typeof MonitorSchema>
export type ClockSchema = z.infer<typeof ClockSchema>
export type DeviceSchema = z.infer<typeof DeviceSchema>
