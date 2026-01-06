import type { CompanionFeedbackDefinition, CompanionFeedbackDefinitions } from '@companion-module/base'
import type { ModuleInstance } from '../main.js'
import { styles, feedbackSubscribe, feedbackUnsubscribe } from './consts.js'

export function getClockFeedbacks(instance: ModuleInstance): CompanionFeedbackDefinitions {
	const feedbacks: Record<string, CompanionFeedbackDefinition> = {}
	if (instance.device.clockSupported) {
		feedbacks.clockLock = {
			name: 'Clock - Locked',
			type: 'boolean',
			defaultStyle: styles.blackOnRed,
			options: [],
			callback: (_feedback, _context) => {
				return instance.device.clockLocked
			},
		}
		feedbacks.clockStatus = {
			name: 'Clock - Status',
			type: 'value',
			options: [],
			callback: (_feedback, _context) => {
				return instance.device.clockStatus
			},
		}
		feedbacks.clockType = {
			name: 'Clock - Type',
			type: 'value',
			options: [],
			callback: (_feedback, _context) => {
				return instance.device.clockType
			},
		}
	}

	Object.keys(feedbacks).forEach((key) => {
		feedbacks[key].subscribe = feedbackSubscribe(instance, 'clock')
		feedbacks[key].unsubscribe = feedbackUnsubscribe(instance, 'clock')
	})
	return feedbacks
}
