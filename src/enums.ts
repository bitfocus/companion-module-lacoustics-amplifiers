import { z } from 'zod'

/* =========================
 * Network / Audio
 * ========================= */

export const NetworkAudioActiveEnum = z.enum(['AVB', 'AES67'])
export type NetworkAudioActiveEnum = z.infer<typeof NetworkAudioActiveEnum>

export const HdmiIntensityEnum = z.enum(['OFF', 'LOW', 'MEDIUM', 'NORMAL', 'HIGH'])
export type HdmiIntensityEnum = z.infer<typeof HdmiIntensityEnum>

/* =========================
 * Bridge Port
 * ========================= */

export const BridgePortStatusReportEnum = z.enum(['idle', 'error', 'warning', 'ok'])
export type BridgePortStatusReportEnum = z.infer<typeof BridgePortStatusReportEnum>

export const BridgePortStatusErrorEnum = z.enum(['none', 'internal', 'down', 'pdelay'])
export type BridgePortStatusErrorEnum = z.infer<typeof BridgePortStatusErrorEnum>

export const BridgePortStatusWarningEnum = z.enum(['none', 'speed', 'duplex'])
export type BridgePortStatusWarningEnum = z.infer<typeof BridgePortStatusWarningEnum>

export const BridgePortLinkStateEnum = z.enum(['down', 'up'])
export type BridgePortLinkStateEnum = z.infer<typeof BridgePortLinkStateEnum>

export const BridgePortLinkDuplexEnum = z.enum(['half', 'full'])
export type BridgePortLinkDuplexEnum = z.infer<typeof BridgePortLinkDuplexEnum>

export const BridgePortLinkSpeedEnum = z.enum(['10', '100', '1000'])
export type BridgePortLinkSpeedEnum = z.infer<typeof BridgePortLinkSpeedEnum>

export const BridgePortRstpStateEnum = z.enum(['disabled', 'blocking', 'forwarding', 'learning'])
export type BridgePortRstpStateEnum = z.infer<typeof BridgePortRstpStateEnum>

export const BridgePortRstpRoleEnum = z.enum(['disabled', 'root', 'designated', 'alternate', 'backup'])
export type BridgePortRstpRoleEnum = z.infer<typeof BridgePortRstpRoleEnum>

/* =========================
 * Misc
 * ========================= */

export const NetworkAuxEnum = z.enum(['network', 'aux'])
export type NetworkAuxEnum = z.infer<typeof NetworkAuxEnum>

export const AnaAesEnum = z.enum(['ana', 'aes'])
export type AnaAesEnum = z.infer<typeof AnaAesEnum>

export const ABEnum = z.enum(['A', 'B'])
export type ABEnum = z.infer<typeof ABEnum>

/* =========================
 * GPIO
 * ========================= */

export const GpioOutputStateEnum = z.enum(['open', 'closed'])
export type GpioOutputStateEnum = z.infer<typeof GpioOutputStateEnum>

export const GpioOutputFunctionEnum = z.enum([
	'none',
	'state',
	'fault',
	'alive',
	'eth_link',
	'en54',
	'aes_lock',
	'stream_lock',
])
export type GpioOutputFunctionEnum = z.infer<typeof GpioOutputFunctionEnum>

export const GpioOutputStateSelectEnum = z.enum(['open', 'closed'])
export type GpioOutputStateSelectEnum = z.infer<typeof GpioOutputStateSelectEnum>

export const GpioPinDirectionEnum = z.enum(['input', 'output'])
export type GpioPinDirectionEnum = z.infer<typeof GpioPinDirectionEnum>

export const GpioInputStateEnum = z.enum(['low', 'high'])
export type GpioInputStateEnum = z.infer<typeof GpioInputStateEnum>

export const GpioInputFunctionLowEnum = z.enum([
	'none',
	'mute_set',
	'mute_clr',
	'mute_toggle',
	'load_config_a',
	'load_config_b',
	'load_config_next',
	'load_config_previous',
	'standby',
	'wakeup',
	'standby_wakeup',
	'gain_up',
	'gain_down',
])
export type GpioInputFunctionLowEnum = z.infer<typeof GpioInputFunctionLowEnum>

export const GpioInputFunctionHighEnum = z.enum([
	'none',
	'mute_set',
	'mute_clr',
	'mute_toggle',
	'load_config_a',
	'load_config_b',
	'load_config_next',
	'load_config_previous',
	'standby',
	'wakeup',
	'standby_wakeup',
	'gain_up',
	'gain_down',
])
export type GpioInputFunctionHighEnum = z.infer<typeof GpioInputFunctionHighEnum>

/* =========================
 * Clock / Monitor
 * ========================= */

export const ClockSourceStatusEnum = z.enum([
	'stopped',
	'starting',
	'locking',
	'locked',
	'holdover',
	'freewheel',
	'fault',
])
export type ClockSourceStatusEnum = z.infer<typeof ClockSourceStatusEnum>

export const ClockSourceTypeEnum = z.enum(['internal', 'avb', 'crf', 'ptp']).or(z.string())
export type ClockSourceTypeEnum = z.infer<typeof ClockSourceTypeEnum>

export const MonitorOutputStateEnum = z.enum(['ok', 'protected', 'disabled', 'retry'])
export type MonitorOutputStateEnum = z.infer<typeof MonitorOutputStateEnum>

export const MonitorOutputTemperatureStateEnum = z.enum(['ok', 'high', 'over'])
export type MonitorOutputTemperatureStateEnum = z.infer<typeof MonitorOutputTemperatureStateEnum>

export const MonitorErrorEnum = z.enum(['ok', 'dsp', 'power', 'reserved', 'init', 'hardware'])
export type MonitorErrorEnum = z.infer<typeof MonitorErrorEnum>

export const MonitorFuseProtectEnum = z.enum(['ok', 'limiting'])
export type MonitorFuseProtectEnum = z.infer<typeof MonitorFuseProtectEnum>

/* =========================
 * EN54
 * ========================= */

export const En54OptionsEnum = z.enum(['PILOT_TONE', 'AES_LOCK', 'AES_AUDIO', 'SPEAKER', 'STREAM_LOCK'])
export type En54OptionsEnum = z.infer<typeof En54OptionsEnum>

export const En54StateEnum = z.enum(['ok', 'error'])
export type En54StateEnum = z.infer<typeof En54StateEnum>

/* =========================
 * Layout
 * ========================= */

export const LayoutActiveSourceEnum = z.enum(['none', 'factory', 'user', 'configuration'])
export type LayoutActiveSourceEnum = z.infer<typeof LayoutActiveSourceEnum>

/* =========================
 * AVB Input
 * ========================= */

export const AvbInputClockStreamStatusEnum = z.enum(['IDLE', 'ERROR', 'WARNING', 'OK'])
export type AvbInputClockStreamStatusEnum = z.infer<typeof AvbInputClockStreamStatusEnum>

export const AvbInputClockStreamStatusReportEnum = z.enum(['IDLE', 'ERROR', 'CONNECTING', 'CONNECTED', 'SYNC'])
export type AvbInputClockStreamStatusReportEnum = z.infer<typeof AvbInputClockStreamStatusReportEnum>

export const AvbInputClockStreamStatusErrorEnum = z.enum(['NONE', 'TIMEOUT', 'CONNECTION', 'RESERVATION', 'DATA'])
export type AvbInputClockStreamStatusErrorEnum = z.infer<typeof AvbInputClockStreamStatusErrorEnum>

export const AvbInputClockStreamStateEnum = z.enum([
	'not_bound',
	'waiting_talker',
	'connecting',
	'con_timeout',
	'con_error',
	'waiting_rsv',
	'rsv_error',
	'waiting_start',
	'waiting_data',
	'data_error',
	'validating',
	'ready',
	'waiting_mclk',
	'locked',
])
export type AvbInputClockStreamStateEnum = z.infer<typeof AvbInputClockStreamStateEnum>

export const AvbInputAudioStreamFormatTypeEnum = z.enum(['AAF', 'AM824'])
export type AvbInputAudioStreamFormatTypeEnum = z.infer<typeof AvbInputAudioStreamFormatTypeEnum>

export const AvbInputAudioStreamFormatRateEnum = z.enum(['96kHz', '48kHz'])
export type AvbInputAudioStreamFormatRateEnum = z.infer<typeof AvbInputAudioStreamFormatRateEnum>

/* Aliases */

export const AvbInputAudioStreamStatusEnum = AvbInputClockStreamStatusEnum
export type AvbInputAudioStreamStatusEnum = z.infer<typeof AvbInputAudioStreamStatusEnum>

export const AvbInputAudioStreamStatusReportEnum = AvbInputClockStreamStatusReportEnum
export type AvbInputAudioStreamStatusReportEnum = z.infer<typeof AvbInputAudioStreamStatusReportEnum>

export const AvbInputAudioStreamStatusErrorEnum = AvbInputClockStreamStatusErrorEnum
export type AvbInputAudioStreamStatusErrorEnum = z.infer<typeof AvbInputAudioStreamStatusErrorEnum>

export const AvbInputAudioStreamStateEnum = AvbInputClockStreamStateEnum
export type AvbInputAudioStreamStateEnum = z.infer<typeof AvbInputAudioStreamStateEnum>

/* =========================
 * AVB Output
 * ========================= */

export const AvbOutputClockStreamStateEnum = z.enum([
	'idle',
	'waiting_destination_mac_address',
	'waiting_listener_connection_request',
	'waiting_stream_id',
	'waiting_stream_reservation',
	'stream_reservation_error',
	'connected',
	'streaming',
])
export type AvbOutputClockStreamStateEnum = z.infer<typeof AvbOutputClockStreamStateEnum>

/* =========================
 * AES67
 * ========================= */

export const Aes67AudioStreamCmdEnum = z.enum(['STOP', 'START'])
export type Aes67AudioStreamCmdEnum = z.infer<typeof Aes67AudioStreamCmdEnum>

export const Aes67AudioStreamStatusEnum = z.enum(['IDLE', 'ERROR', 'WARNING', 'OK'])
export type Aes67AudioStreamStatusEnum = z.infer<typeof Aes67AudioStreamStatusEnum>

export const Aes67AudioStreamStatusReportEnum = z.enum(['IDLE', 'ERROR', 'CONNECTING', 'CONNECTED'])
export type Aes67AudioStreamStatusReportEnum = z.infer<typeof Aes67AudioStreamStatusReportEnum>

export const Aes67AudioStreamStatusErrorEnum = z.enum(['NONE', 'TIMING', 'FORMAT', 'DISCONNECTED', 'CONFLICT'])
export type Aes67AudioStreamStatusErrorEnum = z.infer<typeof Aes67AudioStreamStatusErrorEnum>

export const Aes67AudioStreamFormatAudioFormatEnum = z.enum(['L16PCM', 'L24PCM'])
export type Aes67AudioStreamFormatAudioFormatEnum = z.infer<typeof Aes67AudioStreamFormatAudioFormatEnum>

export const Aes67AudioStreamPacketTimeEnum = z.enum(['1 millisecond', '333 microseconds'])
export type Aes67AudioStreamPacketTimeEnum = z.infer<typeof Aes67AudioStreamPacketTimeEnum>
