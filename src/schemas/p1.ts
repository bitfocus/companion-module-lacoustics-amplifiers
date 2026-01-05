import * as z from 'zod'
import * as Schemas from './base.js'
import * as Enums from '../enums/enums.js'

export const InputFallbackAesGroup = Schemas.Index.extend({
	clear: z.nullable(Schemas.Bool),
	test: z.nullable(Schemas.Bool),
	enable: Schemas.Bool,
	source: Enums.InputFallbackAesGroupSourceEnum,
	invalid: Schemas.Bool,
	active: Schemas.Bool,
})

export const InputFallbackAvbGroup = InputFallbackAesGroup.extend({
	source: Enums.InputFallbackAvbGroupSourceEnum,
})

export const InputSettingsGroup = z.object({
	name: Schemas.Str,
	mute: Schemas.Bool,
	polarity: Enums.InputSettingsPolarityEnum,
	gain: Schemas.Num.min(-60).max(15),
})

export const InputSettingsMicInput = InputSettingsGroup.extend({
	preamp_gain: Enums.InputSettingsMicPreampGainEnum,
	hpf_enable: Schemas.Bool,
	'48v_enable': Schemas.Bool,
})

export const InputSettingsMpl = InputSettingsGroup.omit({
	name: true,
	polarity: true,
})

export const InputSchema = z.object({
	fallback: z.object({
		aes: z.object({
			group: z.array(InputFallbackAesGroup),
		}),
		avb: z.object({
			group: z.array(InputFallbackAvbGroup),
		}),
	}),
	settings: z.object({
		ana: z.array(InputSettingsGroup),
		aes: z.array(InputSettingsGroup),
		avb: z.array(InputSettingsGroup),
		mic: z.array(InputSettingsMicInput),
		mpl: InputSettingsMpl,
	}),
})

export const AesOutputGroup = Schemas.Index.extend({
	frequency: Enums.AesOutputFrequencyEnum,
	user_orig: z.tuple([Schemas.Str, Schemas.Str]),
	user_dest: z.tuple([Schemas.Str, Schemas.Str]),
})

export const AesSchema = Schemas.AesSchema.extend({
	output: z.array(AesOutputGroup),
})

export const GpioInputSchema = Schemas.Index.extend({
	state: Enums.GpioInputStateEnum,
	function_low: Enums.P1GpioInputFunctionLowEnum,
	function_high: Enums.P1GpioInputFunctionHighEnum,
	config_slot_a: Schemas.Int.min(1).max(30),
	config_slot_b: Schemas.Int.min(1).max(30),
	error: Schemas.Int,
})

export const GpioOutputSchema = Schemas.Index.extend({
	state: Enums.GpioOutputStateEnum,
	function: Enums.P1GpioOutputFunctionEnum,
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
		sink_2: Schemas.Bool,
	}),

	clock_stream_lock_select: z.object({
		sink_1: Schemas.Bool,
	}),
})

export const GpioSchema = z.object({
	input: z.array(GpioInputSchema),
	output: z.array(GpioOutputSchema),
})

export const LevelSchema = z.object({
	ana: z.object({
		input: z.array(Schemas.LevelPeakSchema),
		output: z.array(Schemas.LevelPeakSchema),
	}),
	aes: z.object({
		input: z.array(Schemas.LevelPeakSchema),
		output: z.array(Schemas.LevelPeakSchema),
	}),
	avb: z.object({
		input: z.array(Schemas.LevelPeakSchema),
		output: z.array(Schemas.LevelPeakSchema),
	}),
	mic: z.object({
		input: z.array(Schemas.LevelPeakSchema),
	}),
	mpl: z.object({
		input: z.array(Schemas.LevelPeakSchema),
	}),
	gen: z.object({
		input: z.array(Schemas.LevelPeakSchema),
	}),
	mon: z.object({
		output: z.array(Schemas.LevelPeakSchema),
	}),
})

export const FanIdSchema = Schemas.Index.extend({
	error: Schemas.Bool,
	ratio: Schemas.Num,
})

export const FanSchema = z.object({
	fan: z.array(FanIdSchema),
})

export const DeviceSchema = z.object({
	info: Schemas.InfoSchema.extend({
		name: z.literal('P1'),
	}),
	network: Schemas.NetworkSchema.omit({ audio: true }),
	avdecc: Schemas.AvdeccSchema,
	hmi: Schemas.HmiSchema,
	ptp: Schemas.PtpSchema,
	bridge: Schemas.BridgeSchema,
	lldp: Schemas.LldpSchema,
	input: InputSchema,
	aes: AesSchema,
	power: Schemas.PowerSchema.omit({ standby: true, status: true }),
	gpio: GpioSchema,
	configuration: Schemas.ConfigurationSchema.extend({
		active: z.object({
			index: Schemas.Int.min(0).max(30),
			name: Schemas.Str,
			info: Schemas.Str,
			modified: Schemas.Bool,
		}),
	}),
	level: LevelSchema,
	clock: Schemas.ClockSchema,
	fan: FanSchema,
	/* 	
    input: Schemas.InputSchema,
    routing: Schemas.RoutingSchema,
    
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

export type InputFallbackAesGroup = z.infer<typeof InputFallbackAesGroup>
export type InputFallbackAvbGroup = z.infer<typeof InputFallbackAvbGroup>
export type InputSettingsGroup = z.infer<typeof InputSettingsGroup>
export type InputSettingsMicInput = z.infer<typeof InputSettingsMicInput>
export type InputSettingsMpl = z.infer<typeof InputSettingsMpl>
export type InputSchema = z.infer<typeof InputSchema>
export type AesOutputGroup = z.infer<typeof AesOutputGroup>
export type AesSchema = z.infer<typeof AesSchema>
export type GpioInputSchema = z.infer<typeof GpioInputSchema>
export type GpioOutputSchema = z.infer<typeof GpioOutputSchema>
export type GpioSchema = z.infer<typeof GpioSchema>
export type LevelSchema = z.infer<typeof LevelSchema>
export type FanIdSchema = z.infer<typeof FanIdSchema>
export type FanSchema = z.infer<typeof FanSchema>
export type DeviceSchema = z.infer<typeof DeviceSchema>
