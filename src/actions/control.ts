import type { CompanionActionDefinition, CompanionActionDefinitions } from '@companion-module/base'
import type { ModuleInstance } from '../main.js'
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
				const channelNum = intRangeLimiter(String(event.options.channel), 1, instance.device.outputDspChannelCount)
				let newState = false
				switch (event.options.state?.toString()) {
					case 'mute':
						newState = true
						break
					case 'on':
						newState = false
						break
					case 'toggle':
						newState = !instance.device.outputDspChannels[channelNum - 1].mute
				}
				try {
					await instance.clientPost(`/control/dsp/output/${channelNum}/mute`, newState)
					instance.log('info', `Channel ${channelNum} Mute ${newState ? 'on' : 'off'}`)
				} catch (err) {
					instance.log('warn', `Channel ${channelNum} Mute failed`)
					instance.handleError(err)
				}
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
				const channelNum = intRangeLimiter(String(event.options.channel), 1, instance.device.outputDspChannelCount)
				let newState = false
				switch (event.options.state?.toString()) {
					case 'invert':
						newState = true
						break
					case 'normal':
						newState = false
						break
					case 'toggle':
						newState = !instance.device.outputDspChannels[channelNum - 1].invert
				}
				try {
					await instance.clientPost(`/control/dsp/output/${channelNum}/invert`, newState)
					instance.log('info', `Channel ${channelNum} Polarity ${newState ? 'inverted' : 'normal'}`)
				} catch (err) {
					instance.log('warn', `Channel ${channelNum} Polarity Invert failed`)
					instance.handleError(err)
				}
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
				},
			],
			callback: async (event) => {
				const channelNum = intRangeLimiter(String(event.options.channel), 1, instance.device.outputDspChannelCount)
				const delay = Math.round(Number(event.options.delay))

				try {
					await instance.clientPost(`/control/dsp/output/${channelNum}/delay`, delay)
					instance.log('info', `Channel ${channelNum} delay ${delay} samples`)
				} catch (err) {
					instance.log('warn', `Channel ${channelNum} Delay set failed`)
					instance.handleError(err)
				}
			},
			learn: async (event) => {
				return {
					...event.options,
					delay: instance.device.outputDspChannels[Number(event.options.channel) - 1].delay,
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

				try {
					await instance.clientPost(`/control/dsp/output/${event.options.channel}/gain`, gain)
					instance.log('info', `Channel ${event.options.channel} gain ${gain} dB`)
				} catch (err) {
					instance.log('warn', `Channel ${event.options.channel} gain set failed`)
					instance.handleError(err)
				}
			},
			learn: async (event) => {
				const channelNum = intRangeLimiter(String(event.options.channel), 1, instance.device.outputDspChannelCount)
				return {
					...event.options,
					gain: instance.device.outputDspChannels[channelNum - 1].gain,
				}
			},
		}
	}
	return actions
}
