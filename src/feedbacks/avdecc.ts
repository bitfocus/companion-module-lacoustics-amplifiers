import type { CompanionFeedbackDefinition, CompanionFeedbackDefinitions } from '@companion-module/base'
import type { ModuleInstance } from '../main.js'
import { styles, feedbackSubscribe, feedbackUnsubscribe } from './consts.js'

export function getAvdeccFeedbacks(instance: ModuleInstance): CompanionFeedbackDefinitions {
	const feedbacks: Record<string, CompanionFeedbackDefinition> = {}
	if (instance.device.avdeccSupported) {
		feedbacks.avdeccLock = {
			name: 'Avdecc - Lock',
			type: 'boolean',
			defaultStyle: styles.blackOnRed,
			options: [],
			callback: (_feedback, _context) => {
				return instance.device.avdeccLock
			},
		}
		feedbacks.avdeccEntityId = {
			name: 'Avdecc - Entity Id',
			type: 'value',
			options: [],
			callback: (_feedback, _context) => {
				return instance.device.avdeccEntityId
			},
		}
	}

	Object.keys(feedbacks).forEach((key) => {
		feedbacks[key].subscribe = feedbackSubscribe(instance, 'avdecc')
		feedbacks[key].unsubscribe = feedbackUnsubscribe(instance, 'avdecc')
	})
	return feedbacks
}
