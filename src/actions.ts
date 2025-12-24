import type { CompanionActionDefinition } from '@companion-module/base'
import type { ModuleInstance } from './main.js'

export enum ActionId {
	Reboot = 'reboot',
	Power = 'power',
	OutputMute = 'outputMute',
	OutputPolarity = 'outputPolarity',
	OutputDelay = 'outputDelay',
	OutputGain = 'outputGain',
}

export function UpdateActions(self: ModuleInstance): void {
	const ActionDefinitions: { [id in ActionId]: CompanionActionDefinition | undefined } = {
		[ActionId.Reboot]: {
			name: 'Reboot',
			options: [],
			callback: async (_event) => {
				try {
					await self.clientPost('/power/reboot', true)
					self.log('info', `Rebooting...`)
				} catch (err) {
					self.log('warn', `Reboot failed`)
					self.handleError(err)
				}
			},
		},
		[ActionId.Power]: {
			name: 'Power',
			options: [
				{
					type: 'dropdown',
					id: 'state',
					label: 'State',
					choices: [
						{ id: 'standby', label: 'Standby' },
						{ id: 'on', label: 'On' },
						{ id: 'toggle', label: 'Toggle' },
					],
					default: 'standby',
				},
			],
			callback: async (event) => {
				let newState = false
				switch (event.options.state?.toString()) {
					case 'standby':
						newState = true
						break
					case 'on':
						newState = false
						break
					case 'toggle':
						newState = !self.device.power
				}
				try {
					await self.clientPost('/power/standby', newState)
					self.log('info', `Powering ${newState ? 'off' : 'on'}`)
				} catch (err) {
					self.log('warn', `Power failed`)
					self.handleError(err)
				}
			},
		},
		[ActionId.OutputMute]: {
			name: 'Output - Mute',
			options: [
				{
					type: 'number',
					id: 'channel',
					label: 'Channel',
					default: 1,
					min: 1,
					max: self.device.outputChannelCount,
					range: true,
					step: 1,
				},
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
				let newState = false
				switch (event.options.state?.toString()) {
					case 'mute':
						newState = true
						break
					case 'on':
						newState = false
						break
					case 'toggle':
						newState = !self.device.outputChannels[Number(event.options.channel)].mute
				}
				try {
					await self.clientPost(`/control/dsp/output/${event.options.channel}/mute`, newState)
					self.log('info', `Channel ${event.options.channel} Mute ${newState ? 'on' : 'off'}`)
				} catch (err) {
					self.log('warn', `Channel ${event.options.channel} Mute failed`)
					self.handleError(err)
				}
			},
		},
		[ActionId.OutputPolarity]: {
			name: 'Output - Polarity',
			options: [
				{
					type: 'number',
					id: 'channel',
					label: 'Channel',
					default: 1,
					min: 1,
					max: self.device.outputChannelCount,
					range: true,
					step: 1,
				},
				{
					type: 'dropdown',
					id: 'state',
					label: 'State',
					choices: [
						{ id: 'invert', label: 'Invert' },
						{ id: 'normal', label: 'Normal' },
						{ id: 'toggle', label: 'Toggle' },
					],
					default: 'on',
				},
			],
			callback: async (event) => {
				let newState = false
				switch (event.options.state?.toString()) {
					case 'invert':
						newState = true
						break
					case 'normal':
						newState = false
						break
					case 'toggle':
						newState = !self.device.outputChannels[Number(event.options.channel)].invert
				}
				try {
					await self.clientPost(`/control/dsp/output/${event.options.channel}/invert`, newState)
					self.log('info', `Channel ${event.options.channel} Polarity ${newState ? 'inverted' : 'normal'}`)
				} catch (err) {
					self.log('warn', `Channel ${event.options.channel} Polarity Invert failed`)
					self.handleError(err)
				}
			},
		},
		[ActionId.OutputDelay]: {
			name: 'Output - Delay',
			options: [
				{
					type: 'number',
					id: 'channel',
					label: 'Channel',
					default: 1,
					min: 1,
					max: self.device.outputChannelCount,
					range: true,
					step: 1,
				},
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
				const delay = Math.round(Number(event.options.delay))

				try {
					await self.clientPost(`/control/dsp/output/${event.options.channel}/delay`, delay)
					self.log('info', `Channel ${event.options.channel} delay ${delay} samples`)
				} catch (err) {
					self.log('warn', `Channel ${event.options.channel} Delay set failed`)
					self.handleError(err)
				}
			},
			learn: async (event) => {
				return {
					...event.options,
					delay: self.device.outputChannels[Number(event.options.channel)].delay,
				}
			},
		},
		[ActionId.OutputGain]: {
			name: 'Output - Gain',
			options: [
				{
					type: 'number',
					id: 'channel',
					label: 'Channel',
					default: 1,
					min: 1,
					max: self.device.outputChannelCount,
					range: true,
					step: 1,
				},
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
					await self.clientPost(`/control/dsp/output/${event.options.channel}/gain`, gain)
					self.log('info', `Channel ${event.options.channel} gain ${gain} dB`)
				} catch (err) {
					self.log('warn', `Channel ${event.options.channel} gain set failed`)
					self.handleError(err)
				}
			},
			learn: async (event) => {
				return {
					...event.options,
					gain: self.device.outputChannels[Number(event.options.channel)].gain,
				}
			},
		},
	}

	self.setActionDefinitions(ActionDefinitions)
}
