import { combineRgb, CompanionFeedbackContext, CompanionFeedbackInfo } from '@companion-module/base'
import { ModuleInstance } from '../main.js'
import { FeedbackSubscriptionKey } from '../types.js'

export const colors = {
	red: combineRgb(255, 0, 0),
	black: combineRgb(0, 0, 0),
	amber: combineRgb(255, 191, 0),
}

export const styles = {
	blackOnRed: {
		bgcolor: colors.red,
		color: colors.black,
	},
	blackOnAmber: {
		bgcolor: colors.amber,
		color: colors.black,
	},
}

export const feedbackSubscribe =
	(instance: ModuleInstance, type: FeedbackSubscriptionKey) =>
	(feedback: CompanionFeedbackInfo, _context: CompanionFeedbackContext): void => {
		instance.feedbackSubscriptions[type].add(feedback.id)
	}

export const feedbackUnsubscribe =
	(instance: ModuleInstance, type: FeedbackSubscriptionKey) =>
	(feedback: CompanionFeedbackInfo, _context: CompanionFeedbackContext): void => {
		instance.feedbackSubscriptions[type].delete(feedback.id)
	}
