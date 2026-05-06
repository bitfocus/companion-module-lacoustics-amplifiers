import { z } from 'zod'

/* =========================
 * Info
 * ========================= */

export const InfoNameEnum = z.enum([
	'LA1.16i',
	'LA12X',
	'LA2Xi',
	'LA4',
	'LA4X',
	'LA8',
	'LA7.16',
	'LA7.16i',
	'LC16D',
	'LS10',
	'P1',
])
export type InfoNameEnum = z.infer<typeof InfoNameEnum>

/* =========================
 * Network / Audio
 * ========================= */

export const NetworkAudioActiveEnum = z.enum(['AVB', 'AES67'])
export type NetworkAudioActiveEnum = z.infer<typeof NetworkAudioActiveEnum>

/* =========================
 * HMI
 * ========================= */

export const HmiIntensityEnum = z.enum(['OFF', 'LOW', 'MEDIUM', 'NORMAL', 'HIGH'])
export type HmiIntensityEnum = z.infer<typeof HmiIntensityEnum>

export const HmiUnitDelayEnum = z.enum(['MS', 'SAMPLES', 'METERS', 'FEET'])
export type HmiUnitDelayEnum = z.infer<typeof HmiUnitDelayEnum>

export const HmiUnitTemperatureEnum = z.enum(['CELSIUS', 'FAHRENHEIT'])
export type HmiUnitTemperatureEnum = z.infer<typeof HmiUnitTemperatureEnum>

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

export const ClockSourceTypeEnum = z.enum(['internal', 'avb', 'crf', 'ptp'])
export type ClockSourceTypeEnum = z.infer<typeof ClockSourceTypeEnum>

export const LA2xiClockSourceTypeEnum = z.enum(['internal', 'avb', 'ptp'])
export type LA2xiClockSourceTypeEnum = z.infer<typeof LA2xiClockSourceTypeEnum>

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

/* =========================
 * AES Input
 * ========================= */

export const AesInputStatusReportEnum = z.enum(['IDLE', 'ERROR', 'WARNING', 'OK'])
export type AesInputStatusReportEnum = z.infer<typeof AesInputStatusReportEnum>

export const AesInputStatusErrorEnum = z.enum(['NONE', 'LOCK', 'INTERNAL', 'DATA', 'SIGNAL'])
export type AesInputStatusErrorEnum = z.infer<typeof AesInputStatusErrorEnum>

export const AesInputStatusWarningEnum = z.enum(['NONE', 'FREQUENCY', 'PHASE'])
export type AesInputStatusWarningEnum = z.infer<typeof AesInputStatusWarningEnum>

export const AesInputFormatRateEnum = z.enum([
	'NONE',
	'INVALID',
	'32kHz',
	'44.1kHz',
	'48kHz',
	'64kHz',
	'88.2kHz',
	'96kHz',
	'128kHz',
	'176.4kHz',
	'192kHz',
])
export type AesInputFormatRateEnum = z.infer<typeof AesInputFormatRateEnum>

/* =========================
 * Input Source
 * ========================= */

export const InputSourceSelectEnum = z.enum(['xlr', 'network'])
export type InputSourceSelectEnum = z.infer<typeof InputSourceSelectEnum>

export const InputSourceActiveEnum = InputSourceSelectEnum
export type InputSourceActiveEnum = z.infer<typeof InputSourceActiveEnum>

export const InputXlrSelectEnum = z.enum(['ana', 'aes'])
export type InputXlrSelectEnum = z.infer<typeof InputXlrSelectEnum>

export const InputXlrActiveEnum = InputXlrSelectEnum
export type InputXlrActiveEnum = z.infer<typeof InputXlrActiveEnum>

/* =========================
 * P1 Input Source Enums
 * ========================= */

export const InputFallbackAesGroupSourceEnum = z.enum(['ana', 'mic'])
export type InputFallbackAesGroupSourceEnum = z.infer<typeof InputFallbackAesGroupSourceEnum>

export const InputFallbackAvbGroupSourceEnum = z.enum(['ana', 'mic', 'aes'])
export type InputFallbackAvbGroupSourceEnum = z.infer<typeof InputFallbackAvbGroupSourceEnum>

export const InputSettingsPolarityEnum = z.enum(['NORMAL', 'INVERTED'])
export type InputSettingsPolarityEnum = z.infer<typeof InputSettingsPolarityEnum>

export const InputSettingsMicPreampGainEnum = z.enum([
	'0dB',
	'3dB',
	'6dB',
	'9dB',
	'12dB',
	'15dB',
	'18dB',
	'21dB',
	'24dB',
	'27dB',
	'30dB',
	'33dB',
	'36dB',
	'39dB',
	'42dB',
	'45dB',
	'48dB',
	'51dB',
	'54dB',
	'57dB',
	'60dB',
])
export type InputSettingsMicPreampGainEnum = z.infer<typeof InputSettingsMicPreampGainEnum>

export const AesOutputFrequencyEnum = z.enum(['96kHz', '48kHz'])
export type AesOutputFrequencyEnum = z.infer<typeof AesOutputFrequencyEnum>

export const P1GpioInputFunctionLowEnum = z.enum([
	'none',
	'mute_set',
	'mute_clr',
	'mute_toggle',
	'load_config_a',
	'load_config_b',
	'load_config_next',
	'load_config_previous',
])
export type P1GpioInputFunctionLowEnum = z.infer<typeof P1GpioInputFunctionLowEnum>

export const P1GpioInputFunctionHighEnum = z.enum([
	'none',
	'mute_set',
	'mute_clr',
	'mute_toggle',
	'load_config_a',
	'load_config_b',
	'load_config_next',
	'load_config_previous',
])

export type P1GpioInputFunctionHighEnum = z.infer<typeof P1GpioInputFunctionHighEnum>

export const P1GpioOutputFunctionEnum = z.enum([
	'none',
	'state',
	'power',
	'alive',
	'eth_link',
	'error',
	'aes_lock',
	'stream_lock',
])

export type P1GpioOutputFunctionEnum = z.infer<typeof P1GpioOutputFunctionEnum>

/* =========================
 * P1 Output Source Enums
 * ========================= */

export const OutputSettingsAnaMuxEnum = z.enum([
	'NONE',
	'ANA_1',
	'ANA_2',
	'ANA_3',
	'ANA_4',
	'AES_1',
	'AES_2',
	'AES_3',
	'AES_4',
	'AVB_1',
	'AVB_2',
	'AVB_3',
	'AVB_4',
	'AVB_5',
	'AVB_6',
	'AVB_7',
	'AVB_8',
	'MIC_1',
	'MIC_2',
	'MIC_3',
	'MIC_4',
	'DSP_BUS_1',
	'DSP_BUS_2',
	'DSP_BUS_3',
	'DSP_BUS_4',
	'DSP_CUE',
	'DSP_GEN',
	'DSP_BUS_5',
	'DSP_BUS_6',
	'DSP_BUS_7',
	'DSP_BUS_8',
	'MPL_L',
	'MPL_R',
])
export type OutputSettingsAnaMuxEnum = z.infer<typeof OutputSettingsAnaMuxEnum>

export const OutputSettingsPolarityEnum = InputSettingsPolarityEnum
export type OutputSettingsPolarityEnum = z.infer<typeof OutputSettingsPolarityEnum>

export const OutputSettingsAesMuxEnum = OutputSettingsAnaMuxEnum
export type OutputSettingsAesMuxEnum = z.infer<typeof OutputSettingsAesMuxEnum>

export const OutputSettingsAvbMuxEnum = OutputSettingsAnaMuxEnum
export type OutputSettingsAvbMuxEnum = z.infer<typeof OutputSettingsAvbMuxEnum>

export const OutputSettingsMonMuxEnum = OutputSettingsAnaMuxEnum
export type OutputSettingsMonMuxEnum = z.infer<typeof OutputSettingsMonMuxEnum>

/* =========================
 * P1 Sig Gen
 * ========================= */

export const SiggenTypeEnum = z.enum(['NONE', 'SINE', 'BURST', 'SWEEP', 'NOISE'])
export type SiggenTypeEnum = z.infer<typeof SiggenTypeEnum>

export const SiggenSweepTypeEnum = z.enum(['SINGLE', 'REPEAT'])
export type SiggenSweepTypeEnum = z.infer<typeof SiggenSweepTypeEnum>

export const SiggenSweepTimeEnum = z.enum(['0.68', '1.36', '2.73', '5.46'])
export type SiggenSweepTimeEnum = z.infer<typeof SiggenSweepTimeEnum>

export const SiggenNoiseTypeEnum = z.enum(['WHITE', 'PINK'])
export type SiggenNoiseTypeEnum = z.infer<typeof SiggenNoiseTypeEnum>

/* =========================
 * P1 Avb Output
 * ========================= */

export const AvbOutputAudioStreamFormatTypeEnum = z.enum(['AAF', 'AM824', 'CRF'])
export type AvbOutputAudioStreamFormatTypeEnum = z.infer<typeof AvbOutputAudioStreamFormatTypeEnum>

export const AvbOutputAudioStreamStatusErrorEnum = z.enum(['NONE', 'RESERVATION'])
export type AvbOutputAudioStreamStatusErrorEnum = z.infer<typeof AvbOutputAudioStreamStatusErrorEnum>

/* =========================
 * LS10 Port
 * ========================= */

export const LS10GpioOutputFunctionEnum = z.enum(['none', 'state', 'fault', 'alive'])
export type LS10GpioOutputFunctionEnum = z.infer<typeof LS10GpioOutputFunctionEnum>

/* =========================
 * LC16D GPIO
 * ========================= */
export const LC16DGpioInputFunctionLowEnum = z.enum([
	'none',
	'load_config_a',
	'load_config_b',
	'load_config_next',
	'load_config_previous',
])
export type LC16DGpioInputFunctionLowEnum = z.infer<typeof LC16DGpioInputFunctionLowEnum>

export const LC16DGpioInputFunctionHighEnum = z.enum([
	'none',
	'load_config_a',
	'load_config_b',
	'load_config_next',
	'load_config_previous',
])
export type LC16DGpioInputFunctionHighEnum = z.infer<typeof LC16DGpioInputFunctionHighEnum>

/* =========================
 * LC16D Monitor
 * ========================= */

export const LC16DMonitorErrorEnum = z.enum(['ok', 'reserved', 'init', 'hardware'])
export type LC16DMonitorErrorEnum = z.infer<typeof LC16DMonitorErrorEnum>

/* =========================
 * LC16D Clock
 * ========================= */

export const LC16DClockSourceTypeEnum = z.enum(['internal', 'avb', 'crf', 'wc', 'madi', 'aes', 'ptp'])
export type LC16DClockSourceTypeEnum = z.infer<typeof LC16DClockSourceTypeEnum>

export const ClockStatusMadiStatusEnum = z.enum(['invalid', 'lock', 'sync'])
export type ClockStatusMadiStatusEnum = z.infer<typeof ClockSourceStatusEnum>

export const ClockStatusAesStatusEnum = ClockStatusMadiStatusEnum
export type ClockStatusAesStatusEnum = z.infer<typeof ClockStatusAesStatusEnum>

export const ClockStatusWcStatusEnum = ClockStatusMadiStatusEnum
export type ClockStatusWcStatusEnum = z.infer<typeof ClockStatusWcStatusEnum>

export const MadiInputStatusReportEnum = z.enum(['IDLE', 'ERROR', 'WARNING', 'OK'])
export type MadiInputStatusReportEnum = z.infer<typeof MadiInputStatusReportEnum>

export const MadiInputStatusErrorEnum = z.enum(['NONE', 'LOCK', 'INTERNAL', 'CHANNELS', 'RATE'])
export type MadiInputStatusErrorEnum = z.infer<typeof MadiInputStatusErrorEnum>

export const MadiInputStatusWarningEnum = z.enum(['NONE', 'FREQUENCY', 'PHASE'])
export type MadiInputStatusWarningEnum = z.infer<typeof MadiInputStatusWarningEnum>

export const MadiInputFormatEnum = z.enum(['NONE', 'INVALID', '96kHz', '48kHz'])
export type MadiInputFormatEnum = z.infer<typeof MadiInputFormatEnum>

export const MadiOutputFormatEnum = z.enum(['96kHz', '48kHz'])
export type MadiOutputFormatEnum = z.infer<typeof MadiOutputFormatEnum>

export const ClockSampleRateEnum = MadiOutputFormatEnum
export type ClockSampleRateEnum = z.infer<typeof ClockSampleRateEnum>

/* =========================
 * Power
 * ========================= */
export const PowerModeReqSource = z.enum(['unknown', 'external', 'mon', 'error'])
export type PowerModeReqSource = z.infer<typeof PowerModeReqSource>

export const PowerAutoStandbyMode = z.enum(['off', 'auto_standby', 'auto_stanby_wakeup'])
export type PowerAutoStandbyMode = z.infer<typeof PowerAutoStandbyMode>
