import type { CompanionInputFieldNumber } from '@companion-module/base'

export const ChannelOption = (maxChan: number): CompanionInputFieldNumber<'channel'> => {
	return {
		type: 'number',
		id: 'channel',
		label: 'Channel',
		default: 1,
		min: 1,
		max: maxChan,
		range: true,
		step: 1,
		description: `Channel number (1-${maxChan})`,
		asInteger: true,
	}
}
