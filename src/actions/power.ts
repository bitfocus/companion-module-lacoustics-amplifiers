import type { CompanionActionDefinition, CompanionActionDefinitions } from '@companion-module/base'
import type ModuleInstance from '../main.js'

export function getPowerActions(instance: ModuleInstance): CompanionActionDefinitions {
	const actions: Record<string, CompanionActionDefinition> = {}
	if (instance.device.powerRebootable) {
		actions.reboot = {
			name: 'Power - Reboot',
			options: [],
			callback: async (_event) => {
				await instance.clientPost('/power/reboot', true)
				instance.log('info', `Rebooting...`)
			},
		}
	}
	if (instance.device.powerCanStandby) {
		actions.standby = {
			name: 'Power - Standby',
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
				switch (event.options.state as string) {
					case 'standby':
						newState = true
						break
					case 'on':
						newState = false
						break
					case 'toggle':
						newState = !instance.device.powerStandby
				}
				await instance.clientPost('/power/standby', newState)
				instance.log('info', `Powering ${newState ? 'off' : 'on'}`)
			},
		}
	}
	return actions
}
