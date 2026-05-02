import type { CompanionActionDefinition, CompanionActionDefinitions } from '@companion-module/base'
import type ModuleInstance from '../main.js'
import { ChannelOption } from '../options.js'
import { intRangeLimiter } from '../utils.js'

export function getControlActions(instance: ModuleInstance): CompanionActionDefinitions {
	const actions: Record<string, CompanionActionDefinition> = {}
	if (instance.device.outputDspChannelCount > 0) {
		actions.dspOutputMute = {
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
				const channelNum = intRangeLimiter(event.options.channel as number, 1, instance.device.outputDspChannelCount)
				let newState = false
				switch (event.options.state as string) {
					case 'mute':
						newState = true
						break
					case 'on':
						newState = false
						break
					case 'toggle':
						newState = !instance.device.outputDspChannels[channelNum - 1].mute
				}
				await instance.clientPost(`/control/dsp/output/${channelNum}/mute`, newState)
				instance.log('info', `Channel ${channelNum} Mute ${newState ? 'on' : 'off'}`)
			},
		}
		actions.dspOutputPolarity = {
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
				const channelNum = intRangeLimiter(event.options.channel as number, 1, instance.device.outputDspChannelCount)
				let newState = false
				switch (event.options.state as string) {
					case 'invert':
						newState = true
						break
					case 'normal':
						newState = false
						break
					case 'toggle':
						newState = !instance.device.outputDspChannels[channelNum - 1].invert
				}
				await instance.clientPost(`/control/dsp/output/${channelNum}/invert`, newState)
				instance.log('info', `Channel ${channelNum} Polarity ${newState ? 'inverted' : 'normal'}`)
			},
		}
		actions.dspOutputDelay = {
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
				const channelNum = intRangeLimiter(event.options.channel as number, 1, instance.device.outputDspChannelCount)
				const delay = Number(event.options.delay)

				await instance.clientPost(`/control/dsp/output/${channelNum}/delay`, delay)
				instance.log('info', `Channel ${channelNum} delay ${delay} samples`)
			},
			learn: async (event) => {
				const channelNum = intRangeLimiter(event.options.channel as number, 1, instance.device.outputDspChannelCount)
				return {
					...event.options,
					delay: instance.device.outputDspChannels[channelNum - 1].delay,
				}
			},
		}
		actions.dspOutputGain = {
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
				const gain = Number(event.options.gain)
				const channelNum = intRangeLimiter(event.options.channel as number, 1, instance.device.outputDspChannelCount)
				await instance.clientPost(`/control/dsp/output/${channelNum}/gain`, gain)
				instance.log('info', `Channel ${channelNum} gain ${gain} dB`)
			},
			learn: async (event) => {
				const channelNum = intRangeLimiter(event.options.channel as number, 1, instance.device.outputDspChannelCount)
				return {
					...event.options,
					gain: instance.device.outputDspChannels[channelNum - 1].gain,
				}
			},
		}
	}
	return actions
}
