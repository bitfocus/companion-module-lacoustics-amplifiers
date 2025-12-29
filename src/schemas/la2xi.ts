import * as z from 'zod'
import * as Schemas from './base.js'
import * as Enums from '../enums/enums.js'

export const LA2xiInputSchema = z.object({
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

export type LA2xiInputSchema = z.infer<typeof LA2xiInputSchema>

export const LA2xiAesSchema = z.object({
	input: z.array(
		Schemas.Index.extend({
			status: z.object({
				clear: Schemas.Nullable(z.any()),
				report: Enums.AesInputStatusReportEnum,
				error: Enums.AesInputStatusErrorEnum,
				warning: Enums.AesInputStatusWarningEnum,
			}),
			format: z.object({
				rate: Enums.AesInputFormatRateEnum,
				audio: Schemas.Bool,
			}),
			lock: Schemas.Bool,
			frequency: Schemas.Int.min(0),
			gain: Schemas.Int.min(-120).max(120),
		}),
	),
})

export type LA2xiAesSchema = z.infer<typeof LA2xiAesSchema>

export const GpioOutputSchema = Schemas.Index.extend({
	state: Enums.GpioOutputStateEnum,
	function: Enums.GpioOutputFunctionEnum,
	state_select: Enums.GpioOutputStateSelectEnum,
	alive_period: Schemas.Int.min(1).max(60),

	fault_select: z.object({
		amp: Schemas.Bool,
		channel_temperature: Schemas.Bool,
		channel_error: Schemas.Bool,
		eth_link: Schemas.Bool,
		aes_lock: Schemas.Bool,
		stream_lock: Schemas.Bool,
	}),

	eth_link_select: z.object({
		port_1: Schemas.Bool,
		port_2: Schemas.Bool,
	}),

	aes_lock_select: z.object({
		aes_1: Schemas.Bool,
		aes_2: Schemas.Bool,
	}),

	audio_stream_lock_select: z.object({
		sink_1: Schemas.Bool,
	}),
})

export const LA2xiGpioSchema = z.object({
	pin: z.array(Schemas.GpioPinSchema),
	input: z.array(Schemas.GpioInputSchema),
	output: z.array(GpioOutputSchema),
})

export const LA2xiClockSchema = z.object({
	source: z.object({
		locked: Schemas.Bool,
		status: Enums.ClockSourceStatusEnum,
		type: Enums.LA2xiClockSourceTypeEnum,
	}),
})

export const DeviceSchema = z.object({
	info: Schemas.InfoSchema.extend({
		name: z.literal('LA2XI'),
	}),
	network: Schemas.NetworkSchema,
	avdecc: Schemas.AvdeccSchema,
	hmi: Schemas.HmiSchema.omit({ lock: true, unit: true, option: true }),
	ptp: Schemas.PtpSchema,
	bridge: Schemas.BridgeSchema,
	lldp: Schemas.LldpSchema,
	input: LA2xiInputSchema,
	routing: Schemas.RoutingSchema,
	aes: LA2xiAesSchema,
	power: Schemas.PowerSchema.extend({
		status: z.object({
			inp24v: Schemas.Bool,
			smps: Schemas.Bool,
		}),
	}),
	gpio: LA2xiGpioSchema,
	configuration: Schemas.ConfigurationSchema,
	level: Schemas.LevelSchema,
	layout: Schemas.LayoutSchema,
	en54: Schemas.En54Schema,
	monitor: Schemas.MonitorSchema.omit({ fuse_protect: true }).extend({
		output: z.array(
			Schemas.MonitorOutputSchema.omit({
				errors: true,
			}),
		),
	}),
	clock: LA2xiClockSchema,
	control: Schemas.ControlSchema,
	avb: Schemas.AvbSchema,
	aes67: Schemas.Aes67Schema,
})

export type DeviceSchema = z.infer<typeof DeviceSchema>
