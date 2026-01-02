import * as z from 'zod'
import * as Enums from '../enums/enums.js'

const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Faf]{2})|([0-9A-Fa-f]{4}\.){2}([0-9A-Fa-f]{4})$/

export const Nullable = <T extends z.ZodTypeAny>(schema: T): z.ZodNullable<T> => schema.nullable()

export const Bool = z.boolean()
export const Int = z.number().int()
export const Num = z.number()
export const Str = z.string()

export const Index = z.object({
	index: Int.positive(),
})

// Schemas

export const InfoSchema = z.object({
	name: Enums.InfoNameEnum,
	firmware_version: Str,
	firmware_tag: Str,
	firmware_date: Str,
	serial: Str,
	mac: Str.regex(macRegex, 'Invalid MAC address format'),
	unit_name: Str,
	unit_name_auto: Bool,
	datetime: Str, // ISO string
})

export const IpConfigSchema = z.object({
	address: z.ipv4(),
	netmask: z.ipv4(),
	gateway: z.ipv4(),
})

export const NetworkSchema = z.object({
	redundancy: z.object({
		select: Bool,
		active: Bool,
	}),
	ip: z.object({
		active: z.object({
			primary: IpConfigSchema,
			secondary: IpConfigSchema,
		}),
		select: Nullable(IpConfigSchema),
	}),
	audio: z.object({
		active: Enums.NetworkAudioActiveEnum,
	}),
})

export const AvdeccSchema = z.object({
	lock: Bool,
	entity_id: Str,
})

export const HmiSchema = z.object({
	identify: Bool,
	intensity: Enums.HmiIntensityEnum,
	lock: Bool,
	unit: z.object({
		delay: Enums.HmiUnitDelayEnum,
		temperature: Enums.HmiUnitTemperatureEnum,
	}),
	option: z.object({
		confirm: z.object({
			combined_edit: Bool,
			mute: Bool,
			unmute: Bool,
		}),
	}),
})

export const PtpClockSchema = z.object({
	gm_id: Str,
	priority1: Int.min(0),
	priority2: Int.min(0),
	as_path_length: Int,
})

export const PtpSchema = z.object({
	ptpv2_domain: Int.min(0),
	primary: PtpClockSchema,
	secondary: PtpClockSchema,
})

export const BridgePortSchema = Index.extend({
	enable: Bool,
	status: z.object({
		report: Enums.BridgePortStatusReportEnum,
		error: Enums.BridgePortStatusErrorEnum,
		warning: Enums.BridgePortStatusWarningEnum,
		clear_error: Nullable(z.any()),
	}),
	link: z.object({
		state: Enums.BridgePortLinkStateEnum,
		duplex: Enums.BridgePortLinkDuplexEnum,
		speed: Enums.BridgePortLinkSpeedEnum,
	}),
	rstp: z.object({
		state: Enums.BridgePortRstpStateEnum,
		role: Enums.BridgePortRstpRoleEnum,
		tc_detected: Bool,
	}),
	gptp: z.object({
		capable: Bool,
		pdelay: Int.min(0),
		pdelay_threshold: Int.min(0),
	}),
	sr_class_a_capable: Bool,
	sr_class_b_capable: Bool,
	bandwidth: z.object({
		max: Int.min(0),
		used: Int.min(0),
	}),
})

export const BridgeSchema = z.object({
	rstp: z.object({ enable: Bool }),
	streams: z.object({ max: Int.min(0), used: Int.min(0) }),
	vlans: z.object({ max: Int.min(0), used: Int.min(0) }),
	port: z.array(BridgePortSchema),
})

export const LldpSchema = z.object({
	port: z.array(
		z.object({
			chassis_id: Str,
			ip: z.ipv4,
			system_desc: Str,
			port_desc: Str,
		}),
	),
})

export const ChannelStateSchema = Index.extend({
	enable: Bool,
	active: Bool,
})

export const InputFallbackSchema = z.object({
	clear: Nullable(z.any()),
	enable: Bool,
	active: Bool,
})
export const XlrInputSelectSchema = z.object({
	active: Enums.InputXlrSelectEnum,
	select: Enums.InputXlrSelectEnum,
})

export const InputSchema = z.object({
	fallback: z.object({
		network: z.object({
			channel: z.array(ChannelStateSchema),
			sink: z.array(
				Index.extend({
					test: Nullable(z.any()),
					clear: Nullable(z.any()),
				}),
			),
		}),
	}),
	source: z.array(
		z.object({
			channel: Int,
			select: Enums.NetworkAuxEnum,
			active: Enums.NetworkAuxEnum,
		}),
	),
	aux: z.object({
		ana: z.object({ gain: Num }),
		mode: z.object({
			select: Enums.AnaAesEnum,
			active: Enums.AnaAesEnum,
		}),
		channel: z.array(
			z.object({
				input: Int,
				value: Enums.ABEnum,
			}),
		),
	}),
})

export const RoutingSchema = z.object({
	output: z.array(
		Index.extend({
			input: z.array(
				Index.extend({
					enable: Bool,
					invert: Bool,
				}),
			),
		}),
	),
})

export const AesSchema = z.object({
	input: z.array(
		Index.extend({
			status: z.object({
				clear: Nullable(z.any()),
				report: Enums.AesInputStatusReportEnum,
				error: Enums.AesInputStatusErrorEnum,
				warning: Enums.AesInputStatusWarningEnum,
			}),
			format: z.object({
				rate: Enums.AesInputFormatRateEnum,
				audio: Bool,
			}),
			lock: Bool,
			frequency: Int.min(0),
			gain: Int.min(-120).max(120),
		}),
	),
})

export const PowerSchema = z.object({
	reboot: Nullable(z.any()),
	standby: Bool,
	status: z.object({
		inp24v: Bool,
		smps: z.array(
			Index.extend({
				state: Bool,
			}),
		),
	}),
})

export const GpioPinSchema = Index.extend({
	direction: Enums.GpioPinDirectionEnum,
	state: Bool,
})

export const GpioInputSchema = Index.extend({
	state: Enums.GpioInputStateEnum,
	function_low: Enums.GpioInputFunctionLowEnum,
	function_high: Enums.GpioInputFunctionHighEnum,
	config_slot_a: Int.min(1).max(10),
	config_slot_b: Int.min(1).max(10),
	error: Int,
})

export const GpioOutputSchema = Index.extend({
	state: Enums.GpioOutputStateEnum,
	function: Enums.GpioOutputFunctionEnum,
	state_select: Enums.GpioOutputStateSelectEnum,
	alive_period: Int.min(1).max(60),

	fault_select: z.object({
		amp: Bool,
		channel_temperature: Bool,
		channel_error: Bool,
		eth_link: Bool,
		aes_lock: Bool,
		stream_lock: Bool,
	}),

	eth_link_select: z.object({
		port_1: Bool,
		port_2: Bool,
	}),

	aes_lock_select: z.object({
		aes_1: Bool,
	}),

	audio_stream_lock_select: z.object({
		sink_1: Bool,
		sink_2: Bool,
		sink_3: Bool,
		sink_4: Bool,
		sink_5: Bool,
		sink_6: Bool,
		sink_7: Bool,
		sink_8: Bool,
		sink_9: Bool,
		sink_10: Bool,
		sink_11: Bool,
		sink_12: Bool,
		sink_13: Bool,
		sink_14: Bool,
		sink_15: Bool,
		sink_16: Bool,
	}),

	clock_stream_lock_select: z.object({
		sink_1: Bool,
	}),
})

export const GpioSchema = z.object({
	pin: z.array(GpioPinSchema),
	input: z.array(GpioInputSchema),
	output: z.array(GpioOutputSchema),
})

export const ControlDspOutputSchema = Index.extend({
	delay: Int.min(0).max(96000),
	gain: Num.min(-60).max(15),
	volume: Int.min(0).max(750),
	mute: Bool,
	invert: Bool,
})

export const ControlSchema = z.object({
	dsp: z.object({
		output: z.array(ControlDspOutputSchema),
	}),
})

export const ClockSchema = z.object({
	source: z.object({
		locked: Bool,
		status: Enums.ClockSourceStatusEnum,
		type: Enums.ClockSourceTypeEnum,
		audio_stream: Int,
		selected_ptp_clock: Int,
	}),
})

export const MonitorOutputErrorSchema = z.object({
	init: Bool,
	dc_event: Bool,
	channel_error: Bool,
	high_temp: Bool,
	over_temp: Bool,
	short_circuit: Bool,
	hf: Bool,
	power: Bool,
	'15v_no': Bool,
	pwm: Bool,
})

export const MonitorOutputSchema = Index.extend({
	clip: Bool,
	limit: Bool,
	state: Enums.MonitorOutputStateEnum,
	temperature_state: Enums.MonitorOutputTemperatureStateEnum,
	errors: MonitorOutputErrorSchema,
})

export const MonitorSchema = z.object({
	error: Enums.MonitorErrorEnum,
	fuse_protect: Enums.MonitorFuseProtectEnum,
	output: z.array(MonitorOutputSchema),
})

export const ErrorsSchema = z.object({
	amp: Bool,
	speakers: Bool,
	pilot_tone: Bool,
	aes_lock: Bool,
	aes_audio: Bool,
	out_temperature: Bool,
	out_error: Bool,
	stream_lock: Bool,
})

export const En54SigGenBandSchema = z.object({
	frequency: Int.min(10).max(2200),
	gain: Num.min(-120).max(-26),
	time: Int.min(100).max(5000),
	ramp: Int.min(10).max(1000),
	taps: Int.min(64).max(32768),
})

export const En54Schema = z.object({
	enable: Bool,

	aes: z.array(
		Index.extend({
			monitor: Bool,
		}),
	),

	stream: z.array(
		Index.extend({
			monitor: Bool,
		}),
	),

	output: z.array(
		Index.extend({
			limits: z.object({
				z_hf_min: Num,
				z_hf_max: Num,
				z_lf_min: Num,
				z_lf_max: Num,
			}),
			hf: Bool,
			lf: Bool,
			open_circuit_hf: Bool,
			open_circuit_lf: Bool,
			short_circuit_hf: Bool,
			short_circuit_lf: Bool,
		}),
	),

	input: z.array(
		Index.extend({
			monitor: Bool,
			pilot_tone_error: Bool,
		}),
	),

	pilot_tone: z.object({
		frequency: Int.min(10).max(2200),
		threshold: Int.min(-1200).max(0),
		resolution: Int.min(10).max(1000),
	}),

	options: Enums.En54OptionsEnum,
	period: Int.min(1).max(58),

	siggen: z.object({
		hf: En54SigGenBandSchema,
		lf: En54SigGenBandSchema,
	}),

	state: Enums.En54StateEnum,
	errors: ErrorsSchema,
})

export const LevelPeakSchema = Index.extend({
	peak: Num,
})

export const LevelSchema = z.object({
	dsp: z.object({
		input: z.array(LevelPeakSchema),
		output: z.array(LevelPeakSchema),
	}),
})
export const ConfigurationLibraryEntrySchema = Index.extend({
	name: Str,
	used: Bool,
})

export const ConfigurationSchema = z.object({
	library: z.array(ConfigurationLibraryEntrySchema),
	load: z.number().nullable(),
	clear: z.number().nullable(),
	clear_all: z.any().nullable(),
	// eslint-disable-next-line @typescript-eslint/unbound-method
	store: z.object({
		index: Int.min(1).max(10),
		name: Str.min(0).max(16),
	}).nullable,
	active: z.object({
		index: Int.min(0).max(10),
	}),
})

export const LayoutEntrySchema = Index.extend({
	name: Str,
})

export const LayoutSchema = z.object({
	library: z.object({
		user: z.array(LayoutEntrySchema),
		factory: z.array(LayoutEntrySchema),
	}),

	active: z.object({
		name: Str,
		index: Int,
		source: Enums.LayoutActiveSourceEnum,
	}),

	load_user_layout: z.any().nullable(),
	load_factory_layout: z.any().nullable(),
	save: z.any().nullable(),
})

export const AvbInputMappingSchema = z.object({
	input: Int,
	stream: Int,
	channel: Int,
})

export const AvbSchema = z.object({
	input: z.object({
		mapping: z.array(AvbInputMappingSchema),

		clock_stream: z.object({
			format: z.object({ raw: Str }),
			status: Enums.AvbInputClockStreamStatusEnum,
			primary: z.object({
				status: z.object({
					report: Enums.AvbInputClockStreamStatusReportEnum,
					error: Enums.AvbInputClockStreamStatusErrorEnum,
					connection_fault: Int,
					reservation_fault: Int,
				}),
				state: Enums.AvbInputClockStreamStateEnum,
			}),
			secondary: z.object({
				status: z.object({
					report: Enums.AvbInputClockStreamStatusReportEnum,
					error: Enums.AvbInputClockStreamStatusErrorEnum,
					connection_fault: Int,
					reservation_fault: Int,
				}),
				state: Enums.AvbInputClockStreamStateEnum,
			}),
		}),

		audio_stream: z.array(
			Index.extend({
				format: z.object({
					raw: Str,
					type: Enums.AvbInputAudioStreamFormatTypeEnum,
					rate: Enums.AvbInputAudioStreamFormatRateEnum,
					channels: Int.min(0),
				}),
				status: Enums.AvbInputAudioStreamStatusEnum,
				primary: z.object({
					status: z.object({
						report: Enums.AvbInputAudioStreamStatusReportEnum,
						error: Enums.AvbInputAudioStreamStatusErrorEnum,
						connection_fault: Int,
						reservation_fault: Int,
					}),
					locked: Bool,
					state: Enums.AvbInputAudioStreamStateEnum,
				}),
				secondary: z.object({
					status: z.object({
						report: Enums.AvbInputAudioStreamStatusReportEnum,
						error: Enums.AvbInputAudioStreamStatusErrorEnum,
						connection_fault: Int,
						reservation_fault: Int,
					}),
					locked: Bool,
					state: Enums.AvbInputAudioStreamStateEnum,
				}),
			}),
		),
	}),

	output: z.object({
		clock_stream: z.object({
			format: z.object({ raw: Str }),
			latency: Int.min(0).max(2000000),
			primary: z.object({
				state: Enums.AvbOutputClockStreamStateEnum,
			}),
			secondary: z.object({
				state: Enums.AvbOutputClockStreamStateEnum,
			}),
		}),
	}),
})

export const Aes67Schema = z.object({
	input: z.object({
		mapping: z.array(
			z.object({
				input: Int.min(1).max(16),
				stream: Int.min(0).max(16),
				channel: Int.min(1).max(8),
			}),
		),

		audio_stream: z.array(
			Index.extend({
				cmd: Enums.Aes67AudioStreamCmdEnum,
				status: Enums.Aes67AudioStreamStatusEnum,
				primary: z.object({
					ip_dest: z.ipv4,
					port_dest: Int.min(0).max(65535),
					status: z.object({
						report: Enums.Aes67AudioStreamStatusReportEnum,
						error: Enums.Aes67AudioStreamStatusErrorEnum,
					}),
				}),
				secondary: z.object({
					ip_dest: z.ipv4,
					port_dest: Int,
					status: z.object({
						report: Enums.Aes67AudioStreamStatusReportEnum,
						error: Enums.Aes67AudioStreamStatusErrorEnum,
					}),
				}),
				format: z.object({
					nb_channels: Int.min(1).max(8),
					audio_format: Enums.Aes67AudioStreamFormatAudioFormatEnum,
				}),
				packet_time: Enums.Aes67AudioStreamPacketTimeEnum,
				media_offset: Int,
				latency: Int,
			}),
		),
	}),
})

// TYPES

export type Index = z.infer<typeof Index>
export type InfoSchema = z.infer<typeof InfoSchema>
export type IpConfigSchema = z.infer<typeof IpConfigSchema>
export type NetworkSchema = z.infer<typeof NetworkSchema>
export type AvdeccSchema = z.infer<typeof AvdeccSchema>
export type HmiSchema = z.infer<typeof HmiSchema>
export type PtpClockSchema = z.infer<typeof PtpClockSchema>
export type PtpSchema = z.infer<typeof PtpSchema>
export type BridgePortSchema = z.infer<typeof BridgePortSchema>
export type BridgeSchema = z.infer<typeof BridgeSchema>
export type LldpSchema = z.infer<typeof LldpSchema>
export type ChannelStateSchema = z.infer<typeof ChannelStateSchema>
export type InputFallbackSchema = z.infer<typeof InputFallbackSchema>
export type XlrInputSelectSchema = z.infer<typeof XlrInputSelectSchema>
export type InputSchema = z.infer<typeof InputSchema>
export type RoutingSchema = z.infer<typeof RoutingSchema>
export type AesSchema = z.infer<typeof AesSchema>
export type PowerSchema = z.infer<typeof PowerSchema>
export type GpioInputSchema = z.infer<typeof GpioInputSchema>
export type GpioPinSchema = z.infer<typeof GpioPinSchema>
export type GpioOutputSchema = z.infer<typeof GpioOutputSchema>
export type GpioSchema = z.infer<typeof GpioSchema>
export type ControlDspOutputSchema = z.infer<typeof ControlDspOutputSchema>
export type ControlSchema = z.infer<typeof ControlSchema>
export type ClockSchema = z.infer<typeof ClockSchema>
export type MonitorOutputErrorSchema = z.infer<typeof MonitorOutputErrorSchema>
export type MonitorOutputSchema = z.infer<typeof MonitorOutputSchema>
export type MonitorSchema = z.infer<typeof MonitorSchema>
export type ErrorsSchema = z.infer<typeof ErrorsSchema>
export type En54SigGenBandSchema = z.infer<typeof En54SigGenBandSchema>
export type En54Schema = z.infer<typeof En54Schema>
export type LevelPeakSchema = z.infer<typeof LevelPeakSchema>
export type LevelSchema = z.infer<typeof LevelSchema>
export type ConfigurationLibraryEntrySchema = z.infer<typeof ConfigurationLibraryEntrySchema>
export type ConfigurationSchema = z.infer<typeof ConfigurationSchema>
export type LayoutEntrySchema = z.infer<typeof LayoutEntrySchema>
export type LayoutSchema = z.infer<typeof LayoutSchema>
export type AvbInputMappingSchema = z.infer<typeof AvbInputMappingSchema>
export type AvbSchema = z.infer<typeof AvbSchema>
export type Aes67Schema = z.infer<typeof Aes67Schema>
