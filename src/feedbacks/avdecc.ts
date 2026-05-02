import type { CompanionFeedbackDefinitions } from '@companion-module/base'
import type ModuleInstance from '../main.js'
import { styles, feedbackSubscribe, addUnsubscribe } from './consts.js'

export enum FeedbackIdsAvdecc {
	Lock = 'avdeccLock',
	EntityId = 'avdeccEntityId',
}

export type FeedbackSchemaAvdecc = {
	[FeedbackIdsAvdecc.Lock]: {
		type: 'boolean'
		options: Record<string, never>
	}
	[FeedbackIdsAvdecc.EntityId]: {
		type: 'value'
		options: Record<string, never>
	}
}

export function getAvdeccFeedbacks(
	instance: ModuleInstance,
): Partial<CompanionFeedbackDefinitions<FeedbackSchemaAvdecc>> {
	const feedbacks: Partial<CompanionFeedbackDefinitions<FeedbackSchemaAvdecc>> = {}
	if (instance.device.avdeccSupported) {
		feedbacks.avdeccLock = {
			name: 'Avdecc - Lock',
			type: 'boolean',
			defaultStyle: styles.blackOnRed,
			options: [],
			callback: (_feedback, _context) => {
				feedbackSubscribe(instance, 'avdecc')
				return instance.device.avdeccLock
			},
		}
		feedbacks.avdeccEntityId = {
			name: 'Avdecc - Entity Id',
			type: 'value',
			options: [],
			callback: (_feedback, _context) => {
				feedbackSubscribe(instance, 'avdecc')
				return instance.device.avdeccEntityId
			},
		}
	}

	addUnsubscribe(instance, feedbacks, 'avdecc')

	return feedbacks
}
