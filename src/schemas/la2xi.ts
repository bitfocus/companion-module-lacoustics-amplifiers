import * as z from 'zod'
import * as Schemas from './base.js'
import * as Enums from '../enums/enums.js'

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

export const GpioSchema = z.object({
	pin: z.array(Schemas.GpioPinSchema),
	input: z.array(Schemas.GpioInputSchema),
	output: z.array(GpioOutputSchema),
})

export const ClockSchema = z.object({
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
	input: InputSchema,
	routing: Schemas.RoutingSchema,
	aes: Schemas.AesSchema,
	power: Schemas.PowerSchema.extend({
		status: z.object({
			inp24v: Schemas.Bool,
			smps: Schemas.Bool,
		}),
	}),
	gpio: GpioSchema,
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
	clock: ClockSchema,
	control: Schemas.ControlSchema,
	avb: Schemas.AvbSchema,
	aes67: Schemas.Aes67Schema,
})

export type InputSchema = z.infer<typeof InputSchema>
export type GpioOutputSchema = z.infer<typeof GpioOutputSchema>
export type GpioSchema = z.infer<typeof GpioSchema>
export type ClockSchema = z.infer<typeof ClockSchema>
export type DeviceSchema = z.infer<typeof DeviceSchema>
