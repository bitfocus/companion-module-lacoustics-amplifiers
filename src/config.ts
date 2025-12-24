import { Regex, type SomeCompanionConfigField } from '@companion-module/base'

export interface ModuleConfig {
	host: string
	auth: boolean
	username: string
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
	]
}
