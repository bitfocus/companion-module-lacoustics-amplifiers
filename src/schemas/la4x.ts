import * as z from 'zod'
import * as Schemas from './base.js'
import * as Enums from '../enums/enums.js'
import * as LA4 from './la4.js'

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

export const MonitorOutputErrorSchema = z.object({
	channel_error: Schemas.Bool,
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
	output: z.array(MonitorOutputSchema),
})

export const ClockSchema = z.object({
	source: z.object({
		locked: Schemas.Bool,
		status: Enums.ClockSourceStatusEnum,
		type: Enums.LA2xiClockSourceTypeEnum,
	}),
})

export const AvbSchema = z.object({
	input: z.object({
		mapping: z.array(Schemas.AvbInputMappingSchema),

		audio_stream: z.array(
			Schemas.Index.extend({
				format: z.object({
					raw: Schemas.Str,
					type: Enums.AvbInputAudioStreamFormatTypeEnum,
					rate: Enums.AvbInputAudioStreamFormatRateEnum,
					channels: Schemas.Int.min(0),
				}),
				status: Enums.AvbInputAudioStreamStatusEnum,
				primary: z.object({
					status: z.object({
						report: Enums.AvbInputAudioStreamStatusReportEnum,
						error: Enums.AvbInputAudioStreamStatusErrorEnum,
						connection_fault: Schemas.Int,
						reservation_fault: Schemas.Int,
					}),
					locked: Schemas.Bool,
					state: Enums.AvbInputAudioStreamStateEnum,
				}),
			}),
		),
	}),
})

export const DeviceSchema = z.object({
	info: Schemas.InfoSchema.extend({
		name: z.literal('LA4X'),
	}),
	network: LA4.NetworkSchema,
	avdecc: Schemas.AvdeccSchema,
	hmi: Schemas.HmiSchema.omit({ option: true }),
	ptp: Schemas.PtpSchema.omit({ secondary: true }),
	bridge: Schemas.BridgeSchema,
	lldp: Schemas.LldpSchema,
	input: InputSchema,
	routing: Schemas.RoutingSchema,
	aes: Schemas.AesSchema,
	power: Schemas.PowerSchema.omit({ status: true }),
	configuration: Schemas.ConfigurationSchema,
	level: Schemas.LevelSchema,
	layout: Schemas.LayoutSchema,
	en54: Schemas.En54Schema,
	monitor: MonitorSchema,
	clock: Schemas.ClockSchema,
	control: Schemas.ControlSchema,
	avb: Schemas.AvbSchema,
})

export type InputSchema = z.infer<typeof InputSchema>
export type MonitorOutputErrorSchema = z.infer<typeof MonitorOutputErrorSchema>
export type MonitorOutputSchema = z.infer<typeof MonitorOutputSchema>
export type MonitorSchema = z.infer<typeof MonitorSchema>
export type DeviceSchema = z.infer<typeof DeviceSchema>
