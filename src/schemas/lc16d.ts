import * as z from 'zod'
import * as Schemas from './base.js'
import * as Enums from '../enums/enums.js'

export const LevelSchema = z.object({
	aes: z.object({
		input: z.array(Schemas.LevelPeakSchema),
		output: z.array(Schemas.LevelPeakSchema),
	}),
	madi: z.object({
		input: z.array(Schemas.LevelPeakSchema),
		output: z.array(Schemas.LevelPeakSchema),
	}),
})

export const MonitorSchema = z.object({
	error: Enums.LC16DMonitorErrorEnum,
})

export const ClockSchema = z.object({
	source: z.object({
		locked: Schemas.Bool,
		status: Enums.ClockSourceStatusEnum,
		type: Enums.LC16DClockSourceTypeEnum,
		audio_stream: Schemas.Int,
		selected_ptp_clock: Schemas.Int,
	}),
	sample_rate: z.object({
		select: Enums.ClockSampleRateEnum,
		active: Enums.ClockSampleRateEnum,
	}),
	status: z.object({
		madi: z.object({
			status: Enums.ClockStatusMadiStatusEnum,
			frequency: Schemas.Int.min(0),
		}),
		aes: z.object({
			status: Enums.ClockStatusAesStatusEnum,
			frequency: Schemas.Int.min(0),
		}),
		wc: z.object({
			status: Enums.ClockStatusWcStatusEnum,
			frequency: Schemas.Int.min(0),
		}),
	}),
})

export const MadiSchema = z.object({
	input: z.object({
		frequency: Schemas.Int.min(0),
		status: z.object({
			clear: z.nullable(z.any()),
			report: Enums.MadiInputStatusReportEnum,
			error: Enums.MadiInputStatusErrorEnum,
			warning: Enums.MadiInputStatusWarningEnum,
		}),
		format: z.object({
			rate: Enums.MadiInputFormatEnum,
			channels: Schemas.Int.min(0),
		}),
	}),
	output: z.object({
		format: z.object({
			rate: Enums.MadiOutputFormatEnum,
		}),
	}),
})

export const DeviceSchema = z.object({
	info: Schemas.InfoSchema.extend({
		name: z.literal('LC16D'),
	}),
	network: Schemas.NetworkSchema,
	avdecc: Schemas.AvdeccSchema,
	hmi: Schemas.HmiSchema.omit({ lock: true, unit: true, option: true }),
	ptp: Schemas.PtpSchema,
	//bridge: Schemas.BridgeSchema,
	lldp: Schemas.LldpSchema,
	aes: Schemas.AesSchema,
	power: Schemas.PowerSchema.omit({ standby: true }).extend({
		reset: z.nullable(z.any()),
		status: z.object({
			poe: z.array(
				z.object({
					port: Schemas.Int.min(1).max(2),
					state: Schemas.Bool,
					mains: Schemas.Bool,
				}),
			),
		}),
	}),
	//gpio: Schemas.GpioSchema,
	configuration: Schemas.ConfigurationSchema.extend({
		active: z.object({
			index: Schemas.Int.min(0).max(10),
			name: Schemas.Str,
			info: Schemas.Str,
			modified: Schemas.Bool,
		}),
	}),
	level: LevelSchema,
	monitor: MonitorSchema,
	clock: Schemas.ClockSchema,
	fan: Schemas.FanSchema,
	madi: MadiSchema,
	avb: Schemas.AvbSchema,
	aes67: Schemas.Aes67Schema,
})

export type LevelSchema = z.infer<typeof LevelSchema>
export type MonitorSchema = z.infer<typeof MonitorSchema>
export type ClockSchema = z.infer<typeof ClockSchema>
export type MadiSchema = z.infer<typeof MadiSchema>
export type DeviceSchema = z.infer<typeof DeviceSchema>
