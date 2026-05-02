import type { CompanionFeedbackDefinition, CompanionFeedbackDefinitions } from '@companion-module/base'
import type ModuleInstance from '../main.js'
import { styles, feedbackSubscribe, addUnsubscribe } from './consts.js'

export function getPowerFeedbacks(instance: ModuleInstance): CompanionFeedbackDefinitions {
	const feedbacks: Record<string, CompanionFeedbackDefinition> = {}
	if (instance.device.powerCanStandby) {
		feedbacks.powerStandby = {
			name: 'Power - Standby',
			type: 'boolean',
			defaultStyle: styles.blackOnRed,
			options: [],
			callback: (_feedback, _context) => {
				feedbackSubscribe(instance, 'power')
				return instance.device.powerStandby
			},
		}
	}
	if (instance.device.powerSmpsCount > 0) {
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
				feedbackSubscribe(instance, 'power')
				return instance.device.powerSmpsStatus[Number(feedback.options.psu ?? 1)]
			},
		}
	}
	if (instance.device.powerHas24vIn) {
		feedbacks.power24vIn = {
			name: 'Power - 24V In',
			type: 'boolean',
			defaultStyle: styles.blackOnRed,
			options: [],
			callback: (_feedback, _context) => {
				feedbackSubscribe(instance, 'power')
				return instance.device.power24vIn
			},
		}
	}
	if (instance.device.powerHas24vOut) {
		feedbacks.power24vOut = {
			name: 'Power - 24V Out',
			type: 'boolean',
			defaultStyle: styles.blackOnRed,
			options: [],
			callback: (_feedback, _context) => {
				feedbackSubscribe(instance, 'power')
				return instance.device.power24vOut
			},
		}
	}
	if (instance.device.powerHasMains) {
		feedbacks.power24vOut = {
			name: 'Power - Mains',
			type: 'boolean',
			defaultStyle: styles.blackOnRed,
			options: [],
			callback: (_feedback, _context) => {
				feedbackSubscribe(instance, 'power')
				return instance.device.powerMains
			},
		}
	}

	addUnsubscribe(instance, feedbacks, 'power')

	return feedbacks
}
