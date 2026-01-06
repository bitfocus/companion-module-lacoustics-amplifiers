import type { CompanionFeedbackDefinition, CompanionFeedbackDefinitions } from '@companion-module/base'
import type { ModuleInstance } from '../main.js'
import { styles } from './consts.js'

export function getPowerFeedbacks(instance: ModuleInstance): CompanionFeedbackDefinitions {
	const feedbacks: Record<string, CompanionFeedbackDefinition> = {}
	if (instance.device.powerCanStandby) {
		feedbacks.powerStandby = {
			name: 'Power - Standby',
			type: 'boolean',
			defaultStyle: styles.blackOnRed,
			options: [],
			callback: (_feedback, _context) => {
				return instance.device.powerStandby
			},
		}
	}
	return feedbacks
}
