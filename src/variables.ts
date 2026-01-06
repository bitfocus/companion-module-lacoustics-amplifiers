import { CompanionVariableDefinition, CompanionVariableValues } from '@companion-module/base'
import type { ModuleInstance } from './main.js'

export function UpdateVariableDefinitions(self: ModuleInstance): void {
	const varDefs: CompanionVariableDefinition[] = []
	Object.keys(self.device.info).forEach((key) => {
		varDefs.push({ variableId: key, name: key })
	})
	self.setVariableDefinitions(varDefs)
}

export function UpdateVariableValues(self: ModuleInstance): void {
	const varValues: CompanionVariableValues = {}
	for (const [key, value] of Object.entries(self.device.info)) {
		varValues[key] = value
	}
	self.setVariableValues(varValues)
}
