import type { ModuleInstance } from './main.js'

export function UpdateActions(self: ModuleInstance): void {
	self.setActionDefinitions({
		reboot: {
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
		power: {
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
		muteOutput: {
			name: 'Mute Output',
			options: [
				{
					type: 'number',
					id: 'channel',
					label: 'Channel',
					default: 1,
					min: 1,
					max: 16,
					range: true,
					step: 1,
				},
				{
					type: 'dropdown',
					id: 'state',
					label: 'State',
					choices: [
						{ id: 'mute', label: 'Muted' },
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
						self.log('debug', `Mute toggle not implented yet`)
						return
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
	})
}
