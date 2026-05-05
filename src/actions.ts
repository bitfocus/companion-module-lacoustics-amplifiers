import type ModuleInstance from './main.js'
import { getControlActions, type ActionSchemaControl } from './actions/control.js'
import { getPowerActions, type ActionSchemaPower } from './actions/power.js'
import { CompanionActionDefinitions } from '@companion-module/base'

//To do: Find a better way to manage the types here

export type ActionSchema = ActionSchemaControl & ActionSchemaPower

export function UpdateActions(self: ModuleInstance): void {
	const actions: CompanionActionDefinitions<ActionSchema> = {
		...getControlActions(self),
		...getPowerActions(self),
	}
	self.setActionDefinitions(actions)
}
