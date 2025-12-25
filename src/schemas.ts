import * as z from 'zod'

const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Faf]{2})|([0-9A-Fa-f]{4}\.){2}([0-9A-Fa-f]{4})$/

export const Index = z.object({
	index: z.number().int().positive(),
})

const Nullable = <T extends z.ZodTypeAny>(schema: T) => schema.nullable()

const Bool = z.boolean()
const Int = z.number().int()
const Num = z.number()
const Str = z.string()

export const InfoSchema = z.object({
	name: Str,
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
		select: Nullable(z.any()),
	}),
	audio: z.object({
		active: z.literal('AES67'),
	}),
})

export const AvdeccSchema = z.object({
	lock: Bool,
	entity_id: Str,
})

export const HmiSchema = z.object({
	identify: Bool,
	intensity: z.enum(['NORMAL', 'LOW', 'HIGH']),
})

export const PtpClockSchema = z.object({
	gm_id: Str,
	priority1: Int,
	priority2: Int,
	as_path_length: Int,
})

export const PtpSchema = z.object({
	ptpv2_domain: Int,
	primary: PtpClockSchema,
	secondary: PtpClockSchema,
})

export const BridgePortSchema = Index.extend({
	enable: Bool,
	status: z.object({
		report: Str,
		error: Str,
		warning: Str,
		clear_error: Nullable(z.any()),
	}),
	link: z.object({
		state: Str,
		duplex: Str,
		speed: Str,
	}),
	rstp: z.object({
		state: Str,
		role: Str,
		tc_detected: Bool,
	}),
	gptp: z.object({
		capable: Bool,
		pdelay: Int,
		pdelay_threshold: Int,
	}),
	sr_class_a_capable: Bool,
	sr_class_b_capable: Bool,
	bandwidth: z.object({
		max: Int,
		used: Int,
	}),
})

export const BridgeSchema = z.object({
	rstp: z.object({ enable: Bool }),
	streams: z.object({ max: Int, used: Int }),
	vlans: z.object({ max: Int, used: Int }),
	port: z.array(BridgePortSchema),
})

export const LldpSchema = z.object({
	port: z.array(
		z.object({
			chassis_id: Str,
			ip: Str,
			system_desc: Str,
			port_desc: Str,
		}),
	),
})

export const ChannelStateSchema = Index.extend({
	enable: Bool,
	active: Bool,
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
			select: Str,
			active: Str,
		}),
	),
	aux: z.object({
		ana: z.object({ gain: Num }),
		mode: z.object({
			select: Str,
			active: Str,
		}),
		channel: z.array(
			z.object({
				input: Int,
				value: Str,
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

export const GpioOutputSchema = Index.extend({
	state: z.enum(['open', 'closed']),
	function: z.enum(['none']),
	state_select: z.enum(['open', 'closed']),
	alive_period: z.number().int(),

	fault_select: z.object({
		amp: z.boolean(),
		channel_temperature: z.boolean(),
		channel_error: z.boolean(),
		eth_link: z.boolean(),
		aes_lock: z.boolean(),
		stream_lock: z.boolean(),
	}),

	eth_link_select: z.object({
		port_1: z.boolean(),
		port_2: z.boolean(),
	}),

	aes_lock_select: z.object({
		aes_1: z.boolean(),
	}),

	audio_stream_lock_select: z.object({
		sink_1: z.boolean(),
		sink_2: z.boolean(),
		sink_3: z.boolean(),
		sink_4: z.boolean(),
		sink_5: z.boolean(),
		sink_6: z.boolean(),
		sink_7: z.boolean(),
		sink_8: z.boolean(),
		sink_9: z.boolean(),
		sink_10: z.boolean(),
		sink_11: z.boolean(),
		sink_12: z.boolean(),
		sink_13: z.boolean(),
		sink_14: z.boolean(),
		sink_15: z.boolean(),
		sink_16: z.boolean(),
	}),

	clock_stream_lock_select: z.object({
		sink_1: z.boolean(),
	}),
})

export const GpioSchema = z.object({
	pin: z.array(
		Index.extend({
			direction: z.enum(['input', 'output']),
			state: z.boolean(),
		}),
	),

	input: z.array(
		Index.extend({
			state: z.string(),
			function_low: z.string(),
			function_high: z.string(),
			config_slot_a: z.number().int(),
			config_slot_b: z.number().int(),
			error: z.number().int(),
		}),
	),

	output: z.array(GpioOutputSchema),
})

export const ControlDspOutputSchema = Index.extend({
	delay: z.number().int().min(0).max(96000),
	gain: z.number().min(-60).max(15),
	volume: z.number().int().min(0).max(750),
	mute: z.boolean(),
	invert: z.boolean(),
})

export const ControlSchema = z.object({
	dsp: z.object({
		output: z.array(ControlDspOutputSchema),
	}),
})

export const ClockSchema = z.object({
	source: z.object({
		locked: z.boolean(),
		status: z.enum(['locked', 'unlocked']),
		type: z.enum(['ptp', 'internal', 'wordclock']).or(z.string()),
		audio_stream: z.number().int(),
		selected_ptp_clock: z.number().int(),
	}),
})

export const MonitorOutputErrorSchema = z.object({
	init: z.boolean(),
	dc_event: z.boolean(),
	channel_error: z.boolean(),
	high_temp: z.boolean(),
	over_temp: z.boolean(),
	short_circuit: z.boolean(),
	hf: z.boolean(),
	power: z.boolean(),
	'15v_no': z.boolean(),
	pwm: z.boolean(),
})

export const MonitorOutputSchema = Index.extend({
	clip: z.boolean(),
	limit: z.boolean(),
	state: z.enum(['ok', 'error']),
	temperature_state: z.enum(['ok', 'warning', 'error']),
	errors: MonitorOutputErrorSchema,
})

export const MonitorSchema = z.object({
	error: z.enum(['ok', 'error']),
	output: z.array(MonitorOutputSchema),
})

export const ErrorsSchema = z.object({
	amp: z.boolean(),
	speakers: z.boolean(),
	pilot_tone: z.boolean(),
	aes_lock: z.boolean(),
	aes_audio: z.boolean(),
	out_temperature: z.boolean(),
	out_error: z.boolean(),
	stream_lock: z.boolean(),
})

export const En54Schema = z.object({
	enable: z.boolean(),

	aes: z.array(
		Index.extend({
			monitor: z.boolean(),
		}),
	),

	stream: z.array(
		Index.extend({
			monitor: z.boolean(),
		}),
	),

	pilot_tone: z.object({
		frequency: z.number(),
		threshold: z.number(),
		resolution: z.number(),
	}),

	options: z.string(),
	period: z.number().int(),

	siggen: z.object({
		hf: z.object({
			frequency: z.number(),
			gain: z.number(),
			time: z.number().int(),
			ramp: z.number().int(),
			taps: z.number().int(),
		}),
		lf: z.object({
			frequency: z.number(),
			gain: z.number(),
			time: z.number().int(),
			ramp: z.number().int(),
			taps: z.number().int(),
		}),
	}),

	state: z.enum(['ok', 'error']),
	errors: ErrorsSchema,
})

export const LevelPeakSchema = Index.extend({
	peak: z.number(),
})

export const LevelSchema = z.object({
	dsp: z.object({
		input: z.array(LevelPeakSchema),
		output: z.array(LevelPeakSchema),
	}),
})

export const LayoutEntrySchema = Index.extend({
	name: z.string(),
})

export const LayoutSchema = z.object({
	library: z.object({
		user: z.array(LayoutEntrySchema),
		factory: z.array(LayoutEntrySchema),
	}),

	active: z.object({
		name: z.string(),
		index: z.number().int(),
		source: z.string(),
	}),

	load_user_layout: z.any().nullable(),
	load_factory_layout: z.any().nullable(),
	save: z.any().nullable(),
})

export const AvbInputMappingSchema = z.object({
	input: z.number().int(),
	stream: z.number().int(),
	channel: z.number().int(),
})

export const AvbSchema = z.object({
	input: z.object({
		mapping: z.array(AvbInputMappingSchema),

		clock_stream: z.object({
			format: z.object({ raw: z.string() }),
			status: z.string(),
			primary: z.object({
				status: z.object({
					report: z.string(),
					error: z.string(),
					connection_fault: z.number().int(),
					reservation_fault: z.number().int(),
				}),
				state: z.string(),
			}),
			secondary: z.object({
				status: z.object({
					report: z.string(),
					error: z.string(),
					connection_fault: z.number().int(),
					reservation_fault: z.number().int(),
				}),
				state: z.string(),
			}),
		}),

		audio_stream: z.array(
			Index.extend({
				format: z.object({
					raw: z.string(),
					type: z.string(),
					rate: z.string(),
					channels: z.number().int(),
				}),
				status: z.string(),
				primary: z.object({
					status: z.object({
						report: z.string(),
						error: z.string(),
						connection_fault: z.number().int(),
						reservation_fault: z.number().int(),
					}),
					locked: z.boolean(),
					state: z.string(),
				}),
				secondary: z.object({
					status: z.object({
						report: z.string(),
						error: z.string(),
						connection_fault: z.number().int(),
						reservation_fault: z.number().int(),
					}),
					locked: z.boolean(),
					state: z.string(),
				}),
			}),
		),
	}),

	output: z.object({
		clock_stream: z.object({
			format: z.object({ raw: z.string() }),
			latency: z.number().int(),
			primary: z.object({ state: z.string() }),
			secondary: z.object({ state: z.string() }),
		}),
	}),
})

export const Aes67Schema = z.object({
	input: z.object({
		mapping: z.array(
			z.object({
				input: z.number().int(),
				stream: z.number().int(),
				channel: z.number().int(),
			}),
		),

		audio_stream: z.array(
			Index.extend({
				cmd: z.string(),
				status: z.string(),
				primary: z.object({
					ip_dest: z.string(),
					port_dest: z.number().int(),
					status: z.object({
						report: z.string(),
						error: z.string(),
					}),
				}),
				secondary: z.object({
					ip_dest: z.string(),
					port_dest: z.number().int(),
					status: z.object({
						report: z.string(),
						error: z.string(),
					}),
				}),
				format: z.object({
					nb_channels: z.number().int(),
					audio_format: z.string(),
				}),
				packet_time: z.string(),
				media_offset: z.number().int(),
				latency: z.number().int(),
			}),
		),
	}),
})

export const DeviceStatusSchema = z.object({
	info: InfoSchema,
	//	network: NetworkSchema,
	//	avdecc: AvdeccSchema,
	//	hmi: HmiSchema,
	//	ptp: PtpSchema,
	//	bridge: BridgeSchema,
	//	lldp: LldpSchema,
	//	input: InputSchema,
	//	routing: RoutingSchema,
	power: PowerSchema,
	//	gpio: GpioSchema,
	control: ControlSchema,
	//	clock: ClockSchema,
	//	monitor: MonitorSchema,
	//	en54: En54Schema,
	level: LevelSchema,
	//	layout: LayoutSchema,
	//	avb: AvbSchema,
	//	aes67: Aes67Schema,
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
export type InputSchema = z.infer<typeof InputSchema>
export type RoutingSchema = z.infer<typeof RoutingSchema>
export type PowerSchema = z.infer<typeof PowerSchema>
export type GpioOutputSchema = z.infer<typeof GpioOutputSchema>
export type GpioSchema = z.infer<typeof GpioSchema>
export type ControlDspOutputSchema = z.infer<typeof ControlDspOutputSchema>
export type ControlSchema = z.infer<typeof ControlSchema>
export type ClockSchema = z.infer<typeof ClockSchema>
export type MonitorOutputErrorSchema = z.infer<typeof MonitorOutputErrorSchema>
export type MonitorOutputSchema = z.infer<typeof MonitorOutputSchema>
export type MonitorSchema = z.infer<typeof MonitorSchema>
export type ErrorsSchema = z.infer<typeof ErrorsSchema>
export type En54Schema = z.infer<typeof En54Schema>
export type LevelPeakSchema = z.infer<typeof LevelPeakSchema>
export type LevelSchema = z.infer<typeof LevelSchema>
export type LayoutEntrySchema = z.infer<typeof LayoutEntrySchema>
export type LayoutSchema = z.infer<typeof LayoutSchema>
export type AvbInputMappingSchema = z.infer<typeof AvbInputMappingSchema>
export type AvbSchema = z.infer<typeof AvbSchema>
export type Aes67Schema = z.infer<typeof Aes67Schema>
export type DeviceStatusSchema = z.infer<typeof DeviceStatusSchema>
