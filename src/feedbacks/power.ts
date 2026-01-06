import type { CompanionFeedbackDefinition, CompanionFeedbackDefinitions } from '@companion-module/base'
import type { ModuleInstance } from '../main.js'
import { styles, feedbackSubscribe, feedbackUnsubscribe } from './consts.js'

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
			subscribe: feedbackSubscribe(instance, 'power'),
			unsubscribe: feedbackUnsubscribe(instance, 'power'),
		}
		feedbacks.powerSmpsStatus = {
			name: 'Power - SMPS Status',
			type: 'boolean',
			defaultStyle: styles.blackOnRed,
			options: [
				{
					type: 'number',
					id: 'psu',
					label: 'PSU',
					default: 1,
					min: 1,
					max: instance.device.powerSmpsCount,
					range: true,
					step: 1,
				},
			],
			callback: (feedback, _context) => {
				return instance.device.powerSmpsStatus[Number(feedback.options.psu ?? 1) - 1]
			},
			subscribe: feedbackSubscribe(instance, 'power'),
			unsubscribe: feedbackUnsubscribe(instance, 'power'),
		}
	}
	return feedbacks
}
