import type { CompanionFeedbackDefinition, CompanionFeedbackDefinitions } from '@companion-module/base'
import type { ModuleInstance } from '../main.js'
import { feedbackSubscribe, feedbackUnsubscribe } from './consts.js'

export function getPtpFeedbacks(instance: ModuleInstance): CompanionFeedbackDefinitions {
	const feedbacks: Record<string, CompanionFeedbackDefinition> = {}
	if (instance.device.ptpSupported) {
		feedbacks.ptpV2Domain = {
			name: 'PTP - V2 Domain',
			type: 'value',
			options: [],
			callback: (_feedback, _context) => {
				return instance.device.ptpV2Domain
			},
		}
	}

	Object.keys(feedbacks).forEach((key) => {
		feedbacks[key].subscribe = feedbackSubscribe(instance, 'ptp')
		feedbacks[key].unsubscribe = feedbackUnsubscribe(instance, 'ptp')
	})
	return feedbacks
}
