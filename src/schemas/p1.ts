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

export const OutputSettingsAnaSchema = z.object({
	mux: Enums.OutputSettingsAnaMuxEnum,
	name: Schemas.Str,
	mute: Schemas.Bool,
	polarity: Enums.OutputSettingsPolarityEnum,
	gain: Schemas.Num.min(-60).max(15),
})

export const OutputSettingsAesSchema = OutputSettingsAnaSchema.extend({
	mux: Enums.OutputSettingsAesMuxEnum,
})

export const OutputSettingsAvbSchema = OutputSettingsAnaSchema.extend({
	mux: Enums.OutputSettingsAvbMuxEnum,
})

export const OutputSettingsMonSchema = OutputSettingsAnaSchema.extend({
	mux: Enums.OutputSettingsMonMuxEnum,
})

export const OutputSchema = z.object({
	settings: z.object({
		ana: z.array(OutputSettingsAnaSchema),
		aes: z.array(OutputSettingsAesSchema),
		avb: z.array(OutputSettingsAvbSchema),
		mon: z.array(OutputSettingsMonSchema),
	}),
})

export const MplSchema = z.object({
	enable: Schemas.Bool,
	playback: z.object({
		folder_mode: Schemas.Bool,
		repeat: Schemas.Bool,
	}),
	control: z.object({
		next: z.nullable(z.any()),
		previous: z.nullable(z.any()),
		play: Schemas.Bool,
		mute: Schemas.Bool,
		gain: Schemas.Num.min(-60).max(15),
	}),
	time: z.object({
		current: Schemas.Int.min(0),
		total: Schemas.Int.min(0),
	}),
	file: z.object({
		index: Schemas.Int.min(0),
		count: Schemas.Int.min(0),
		name: Schemas.Str,
		path: Schemas.Str,
		MPL_DISK_NAME: Schemas.Str,
	}),
})

export const SiggenSchema = z.object({
	enable: Schemas.Bool,
	gain: Schemas.Num,
	mute: Schemas.Bool,
	type: Enums.SiggenTypeEnum,
	time_abort: Schemas.Int.min(0).max(1000),
	sine: z.object({
		gain: Schemas.Num,
		frequency: Schemas.Int.min(0),
		fade: Schemas.Int.min(0),
	}),
	burst: z.object({
		gain: Schemas.Num,
		frequency: Schemas.Int.min(0),
		fade: Schemas.Int.min(0),
		hold: Schemas.Int.min(0),
		wait: Schemas.Int.min(0),
	}),
	sweep: z.object({
		type: Enums.SiggenSweepTypeEnum,
		gain: Schemas.Num,
		fmin: Schemas.Int.min(0),
		fmax: Schemas.Int.min(0),
		time: Enums.SiggenSweepTimeEnum,
	}),
	noise: z.object({
		gain: Schemas.Num,
		type: Enums.SiggenNoiseTypeEnum,
	}),
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
	fan: Schemas.FanSchema,
	output: OutputSchema,
	mpl: MplSchema,
	siggen: SiggenSchema,
	//AVB Schema incomplete
	avb: Schemas.AvbSchema.extend({
		output: z.object({
			//audio_stream: z.array()
			clock_stream: z.object({
				format: z.object({ raw: Schemas.Str }),
				latency: Schemas.Int.min(0).max(2000000),
				primary: z.object({
					state: Enums.AvbOutputClockStreamStateEnum,
				}),
				secondary: z.object({
					state: Enums.AvbOutputClockStreamStateEnum,
				}),
			}),
		}),
	}),
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
export type OutputSettingsAnaSchema = z.infer<typeof OutputSettingsAnaSchema>
export type OutputSettingsAesSchema = z.infer<typeof OutputSettingsAesSchema>
export type OutputSettingsAvbSchema = z.infer<typeof OutputSettingsAvbSchema>
export type OutputSettingsMonSchema = z.infer<typeof OutputSettingsMonSchema>
export type OutputSchema = z.infer<typeof OutputSchema>
export type MplSchema = z.infer<typeof MplSchema>
export type SiggenSchema = z.infer<typeof SiggenSchema>
export type DeviceSchema = z.infer<typeof DeviceSchema>
