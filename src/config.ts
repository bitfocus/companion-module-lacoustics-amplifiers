import { Regex, type SomeCompanionConfigField } from '@companion-module/base'

export interface ModuleConfig {
	host: string
	auth: boolean
	username: string
	interval: 4
	verbose: boolean
}

export interface ModuleSecrets {
	password: string
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'Target Hostname or IP',
			width: 8,
			regex: Regex.HOSTNAME,
		},
		{
			type: 'checkbox',
			id: 'auth',
			label: 'Use Authentication',
			width: 4,
			default: false,
		},
		{
			type: 'textinput',
			id: 'username',
			label: 'Username',
			default: 'admin',
			width: 6,
			isVisibleExpression: '$(options:auth)',
		},
		{
			type: 'secret-text',
			id: 'password',
			label: 'Password',
			default: 'admin',
			width: 6,
			isVisibleExpression: '$(options:auth)',
		},
		{
			type: 'number',
			id: 'interval',
			width: 4,
			label: 'Poll Interval',
			description: 'mS',
			default: 1000,
			min: 200,
			max: 60000,
		},
		{
			type: 'checkbox',
			id: 'verbose',
			label: 'Verbose Logs',
			width: 4,
			default: false,
		},
	]
}
