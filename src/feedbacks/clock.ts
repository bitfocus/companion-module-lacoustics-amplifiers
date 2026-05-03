import type { CompanionFeedbackDefinitions } from '@companion-module/base'
import type ModuleInstance from '../main.js'
import { styles, feedbackSubscribe, addUnsubscribe } from './consts.js'

export enum FeedbackIdsClock {
	Lock = 'clockLock',
	Status = 'clockStatus',
	Type = 'clockType',
}

export type FeedbackSchemaClock = {
	[FeedbackIdsClock.Lock]: {
		type: 'boolean'
		// eslint-disable-next-line @typescript-eslint/no-empty-object-type
		options: {}
	}
	[FeedbackIdsClock.Status]: {
		type: 'value'
		// eslint-disable-next-line @typescript-eslint/no-empty-object-type
		options: {}
	}
	[FeedbackIdsClock.Type]: {
		type: 'value'
		// eslint-disable-next-line @typescript-eslint/no-empty-object-type
		options: {}
	}
}

export function getClockFeedbacks(
	instance: ModuleInstance,
): Partial<CompanionFeedbackDefinitions<FeedbackSchemaClock>> {
	const feedbacks: Partial<CompanionFeedbackDefinitions<FeedbackSchemaClock>> = {}
	if (instance.device.clockSupported) {
		feedbacks.clockLock = {
			name: 'Clock - Locked',
			type: 'boolean',
			defaultStyle: styles.blackOnRed,
			options: [],
			callback: (_feedback, _context) => {
				feedbackSubscribe(instance, 'clock')
				return instance.device.clockLocked
			},
		}
		feedbacks.clockStatus = {
			name: 'Clock - Status',
			type: 'value',
			options: [],
			callback: (_feedback, _context) => {
				feedbackSubscribe(instance, 'clock')
				return instance.device.clockStatus
			},
		}
		feedbacks.clockType = {
			name: 'Clock - Type',
			type: 'value',
			options: [],
			callback: (_feedback, _context) => {
				feedbackSubscribe(instance, 'clock')
				return instance.device.clockType
			},
		}
	}

	addUnsubscribe(instance, feedbacks, 'clock')

	return feedbacks
}
