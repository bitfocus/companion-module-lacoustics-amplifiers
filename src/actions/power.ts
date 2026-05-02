import type { CompanionActionDefinitions } from '@companion-module/base'
import type ModuleInstance from '../main.js'

export enum ActionIdsPower {
	Reboot = 'reboot',
	Standby = 'standby',
}

export type ActionSchemaPower = {
	[ActionIdsPower.Reboot]: {
		options: Record<string, never>
	}
	[ActionIdsPower.Standby]: {
		options: {
			state: 'standby' | 'on' | 'toggle'
		}
	}
}

export function getPowerActions(instance: ModuleInstance): Partial<CompanionActionDefinitions<ActionSchemaPower>> {
	const actions: Partial<CompanionActionDefinitions<ActionSchemaPower>> = {}
	if (instance.device.powerRebootable) {
		actions[ActionIdsPower.Reboot] = {
			name: 'Power - Reboot',
			options: [],
			callback: async (_event) => {
				await instance.clientPost('/power/reboot', true)
				instance.log('info', `Rebooting...`)
			},
		}
	}
	if (instance.device.powerCanStandby) {
		actions[ActionIdsPower.Standby] = {
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
				switch (event.options.state) {
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
