import type { CompanionFeedbackDefinitions } from '@companion-module/base'
import type ModuleInstance from '../main.js'
import { styles, feedbackSubscribe, addUnsubscribe, ensureAllFeedbackKeys } from './consts.js'

export enum FeedbackIdsPower {
	Standby = 'powerStandby',
	SmpsStatus = 'powerSmpsStatus',
	Dc24vIn = 'power24vIn',
	Dc24vOut = 'power24vOut',
	Mains = 'powerMains',
}

export type FeedbackSchemaPower = {
	[FeedbackIdsPower.Standby]: {
		type: 'boolean'
		options: Record<string, never>
	}
	[FeedbackIdsPower.SmpsStatus]: {
		type: 'boolean'
		options: { psu: number }
	}
	[FeedbackIdsPower.Dc24vIn]: {
		type: 'boolean'
		options: Record<string, never>
	}
	[FeedbackIdsPower.Dc24vOut]: {
		type: 'boolean'
		options: Record<string, never>
	}
	[FeedbackIdsPower.Mains]: {
		type: 'boolean'
		options: Record<string, never>
	}
}

export function getPowerFeedbacks(instance: ModuleInstance): CompanionFeedbackDefinitions<FeedbackSchemaPower> {
	const feedbacks: Partial<CompanionFeedbackDefinitions<FeedbackSchemaPower>> = {}
	if (instance.device.powerCanStandby) {
		feedbacks[FeedbackIdsPower.Standby] = {
			name: 'Power - Standby',
			type: 'boolean',
			defaultStyle: styles.blackOnRed,
			options: [],
			callback: (feedback, _context) => {
				feedbackSubscribe(instance, 'power', feedback)
				return instance.device.powerStandby
			},
		}
	}
	if (instance.device.powerSmpsCount > 0) {
		feedbacks[FeedbackIdsPower.SmpsStatus] = {
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
					asInteger: true,
				},
			],
			callback: (feedback, _context) => {
				feedbackSubscribe(instance, 'power', feedback)
				return instance.device.powerSmpsStatus[Number(feedback.options.psu ?? 1)]
			},
		}
	}
	if (instance.device.powerHas24vIn) {
		feedbacks[FeedbackIdsPower.Dc24vIn] = {
			name: 'Power - 24V In',
			type: 'boolean',
			defaultStyle: styles.blackOnRed,
			options: [],
			callback: (feedback, _context) => {
				feedbackSubscribe(instance, 'power', feedback)
				return instance.device.power24vIn
			},
		}
	}
	if (instance.device.powerHas24vOut) {
		feedbacks[FeedbackIdsPower.Dc24vOut] = {
			name: 'Power - 24V Out',
			type: 'boolean',
			defaultStyle: styles.blackOnRed,
			options: [],
			callback: (feedback, _context) => {
				feedbackSubscribe(instance, 'power', feedback)
				return instance.device.power24vOut
			},
		}
	}
	if (instance.device.powerHasMains) {
		feedbacks[FeedbackIdsPower.Mains] = {
			name: 'Power - Mains',
			type: 'boolean',
			defaultStyle: styles.blackOnRed,
			options: [],
			callback: (feedback, _context) => {
				feedbackSubscribe(instance, 'power', feedback)
				return instance.device.powerMains
			},
		}
	}

	addUnsubscribe(instance, feedbacks, 'power')
	ensureAllFeedbackKeys(feedbacks, FeedbackIdsPower)
	return feedbacks
}
