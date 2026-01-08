import type { CompanionInputFieldTextInput } from '@companion-module/base'

export const ChannelOption = (maxChan: number): CompanionInputFieldTextInput => {
	return {
		type: 'textinput',
		id: 'channel',
		label: 'Channel',
		default: '1',
		useVariables: { local: true },
		description: `Channel number (1-${maxChan})`,
	}
}
