import type { ModuleInstance } from './main.js'
import { getControlActions } from './actions/control.js'
import { getPowerActions } from './actions/power.js'

export function UpdateActions(self: ModuleInstance): void {
	const actions = {
		...getControlActions(self),
		...getPowerActions(self),
	}
	self.setActionDefinitions(actions)
}
