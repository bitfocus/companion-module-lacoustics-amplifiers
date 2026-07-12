import { type CompanionActionDefinitions, createModuleLogger } from '@companion-module/base'
import type ModuleInstance from '../main.js'
import { ChannelOption } from '../options.js'
import { intRangeLimiter } from '../utils.js'
import { actionSubscribe, actionUnsubscribe, ensureAllActionKeys } from './consts.js'
import { ControlDspOutputSchema } from '../schemas/base.js'

export enum ActionIdsControl {
	DspOutputMute = 'dspOutputMute',
	DspOutputPolarity = 'dspOutputPolarity',
	DspOutputDelay = 'dspOutputDelay',
	DspOutputGain = 'dspOutputGain',
}

export type ActionSchemaControl = {
	[ActionIdsControl.DspOutputMute]: {
		options: {
			channel: number
			state: 'mute' | 'on' | 'toggle'
		}
	}
	[ActionIdsControl.DspOutputPolarity]: {
		options: {
			channel: number
			state: 'invert' | 'normal' | 'toggle'
		}
	}
	[ActionIdsControl.DspOutputDelay]: {
		options: {
			channel: number
			delay: number
		}
	}
	[ActionIdsControl.DspOutputGain]: {
		options: {
			channel: number
			gain: number
		}
	}
}

export function getControlActions(instance: ModuleInstance): CompanionActionDefinitions<ActionSchemaControl> {
	const actions: Partial<CompanionActionDefinitions<ActionSchemaControl>> = {}
	const logger = createModuleLogger('Actions:Control')
	if (instance.device.outputDspChannelCount > 0) {
		actions[ActionIdsControl.DspOutputMute] = {
			name: 'Output - Mute',
			options: [
				ChannelOption(instance.device.outputDspChannelCount),
				{
					type: 'dropdown',
					id: 'state',
					label: 'State',
					choices: [
						{ id: 'mute', label: 'Mute' },
						{ id: 'on', label: 'On' },
						{ id: 'toggle', label: 'Toggle' },
					],
					default: 'on',
				},
			],
			callback: async (event) => {
				const channelNum = intRangeLimiter(event.options.channel, 1, instance.device.outputDspChannelCount)
				let newState: boolean
				switch (event.options.state) {
					case 'mute':
						newState = true
						break
					case 'on':
						newState = false
						break
					case 'toggle':
						newState = !instance.device.outputDspChannels[channelNum - 1].mute
						break
					default: {
						const _exhaustiveCheck: never = event.options.state
						return _exhaustiveCheck
					}
				}
				await instance.clientPost(`/control/dsp/output/${channelNum}/mute`, newState)
				logger.info(`Channel ${channelNum} Mute ${newState ? 'on' : 'off'}`)
				instance.handleArrayItemUpdate<ControlDspOutputSchema>(
					(d) => ('control' in d ? d.control.dsp.output : undefined),
					channelNum,
					{ mute: newState },
					'control',
				)
			},
			optionsToMonitorForSubscribe: [],
			subscribe: actionSubscribe(instance, 'control'),
			unsubscribe: actionUnsubscribe(instance, 'control'),
		}
		actions[ActionIdsControl.DspOutputPolarity] = {
			name: 'Output - Polarity',
			options: [
				ChannelOption(instance.device.outputDspChannelCount),
				{
					type: 'dropdown',
					id: 'state',
					label: 'State',
					choices: [
						{ id: 'invert', label: 'Invert' },
						{ id: 'normal', label: 'Normal' },
						{ id: 'toggle', label: 'Toggle' },
					],
					default: 'normal',
				},
			],
			callback: async (event) => {
				const channelNum = intRangeLimiter(event.options.channel, 1, instance.device.outputDspChannelCount)
				let newState: boolean
				switch (event.options.state) {
					case 'invert':
						newState = true
						break
					case 'normal':
						newState = false
						break
					case 'toggle':
						newState = !instance.device.outputDspChannels[channelNum - 1].invert
						break
					default: {
						const _exhaustiveCheck: never = event.options.state
						return _exhaustiveCheck
					}
				}
				await instance.clientPost(`/control/dsp/output/${channelNum}/invert`, newState)
				logger.info(`Channel ${channelNum} Polarity ${newState ? 'inverted' : 'normal'}`)
				instance.handleArrayItemUpdate<ControlDspOutputSchema>(
					(d) => ('control' in d ? d.control.dsp.output : undefined),
					channelNum,
					{ invert: newState },
					'control',
				)
			},
			optionsToMonitorForSubscribe: [],
			subscribe: actionSubscribe(instance, 'control'),
			unsubscribe: actionUnsubscribe(instance, 'control'),
		}
		actions[ActionIdsControl.DspOutputDelay] = {
			name: 'Output - Delay',
			options: [
				ChannelOption(instance.device.outputDspChannelCount),
				{
					type: 'number',
					id: 'delay',
					label: 'Delay',
					default: 0,
					min: 0,
					max: 96000,
					description: 'Output delay in samples',
					asInteger: true,
				},
			],
			callback: async (event) => {
				const channelNum = intRangeLimiter(event.options.channel, 1, instance.device.outputDspChannelCount)
				const delay = event.options.delay

				await instance.clientPost(`/control/dsp/output/${channelNum}/delay`, delay)
				logger.info(`Channel ${channelNum} delay ${delay} samples`)
				instance.handleArrayItemUpdate<ControlDspOutputSchema>(
					(d) => ('control' in d ? d.control.dsp.output : undefined),
					channelNum,
					{ delay: delay },
					'control',
				)
			},
			learn: async (event) => {
				const channelNum = intRangeLimiter(event.options.channel, 1, instance.device.outputDspChannelCount)
				await instance.queryDevice('control')
				return {
					delay: instance.device.outputDspChannels[channelNum - 1].delay,
				}
			},
		}
		actions[ActionIdsControl.DspOutputGain] = {
			name: 'Output - Gain',
			options: [
				ChannelOption(instance.device.outputDspChannelCount),
				{
					type: 'number',
					id: 'gain',
					label: 'Gain',
					default: 0,
					min: -60,
					max: 15,
					description: 'Output gain in dB',
				},
			],
			callback: async (event) => {
				const gain = event.options.gain
				const channelNum = intRangeLimiter(event.options.channel, 1, instance.device.outputDspChannelCount)
				await instance.clientPost(`/control/dsp/output/${channelNum}/gain`, gain)
				logger.info(`Channel ${channelNum} gain ${gain} dB`)
				instance.handleArrayItemUpdate<ControlDspOutputSchema>(
					(d) => ('control' in d ? d.control.dsp.output : undefined),
					channelNum,
					{ gain: gain },
					'control',
				)
			},
			learn: async (event) => {
				const channelNum = intRangeLimiter(event.options.channel, 1, instance.device.outputDspChannelCount)
				await instance.queryDevice('control')
				return {
					gain: instance.device.outputDspChannels[channelNum - 1].gain,
				}
			},
		}
	}

	ensureAllActionKeys(actions, ActionIdsControl)
	return actions
}
