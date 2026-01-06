import { CompanionVariableDefinition, CompanionVariableValues } from '@companion-module/base'
import type { ModuleInstance } from './main.js'

export function UpdateVariableDefinitions(self: ModuleInstance): void {
	const deviceInfo = self.device.info
	const varDefs: CompanionVariableDefinition[] = []
	Object.keys(deviceInfo).forEach((key) => {
		varDefs.push({ variableId: key, name: key })
	})
	self.setVariableDefinitions(varDefs)
	const varValues: CompanionVariableValues = {}
	for (const [key, value] of Object.entries(deviceInfo)) {
		varValues[key] = value
	}
	self.setVariableValues(varValues)
}
