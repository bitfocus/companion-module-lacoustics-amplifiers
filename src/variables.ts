import { CompanionVariableDefinitions, CompanionVariableValues } from '@companion-module/base'
import type ModuleInstance from './main.js'

const sanitiseVariableId = (id: string, substitute = '_'): string => id.replaceAll(/[^a-zA-Z0-9-_.]/gm, substitute)
const formatVariableNames = (str: string): string => {
	return str.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

export function UpdateVariableDefinitions(self: ModuleInstance): void {
	const varDefs: CompanionVariableDefinitions = {}
	Object.keys(self.device.info).forEach((key) => {
		varDefs[sanitiseVariableId(key)] = { name: formatVariableNames(key) }
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
