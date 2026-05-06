import {
	combineRgb,
	CompanionOptionValues,
	CompanionFeedbackContext,
	CompanionFeedbackDefinitions,
	CompanionFeedbackSchema,
	CompanionFeedbackInfo,
	CompanionFeedbackAdvancedEvent,
	CompanionFeedbackBooleanEvent,
	CompanionFeedbackValueEvent,
} from '@companion-module/base'
import ModuleInstance from '../main.js'
import { FeedbackSubscriptionKey } from '../types.js'

export const colors = {
	red: combineRgb(255, 0, 0),
	black: combineRgb(0, 0, 0),
	white: combineRgb(255, 255, 255),
	green: combineRgb(0, 204, 0),
	greenBright: combineRgb(0, 255, 0),
	yellow: combineRgb(255, 255, 0),
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
	(
		feedback: CompanionFeedbackAdvancedEvent | CompanionFeedbackBooleanEvent | CompanionFeedbackValueEvent,
		_context: CompanionFeedbackContext,
	): void => {
		instance.feedbackSubscriptions[type].add(feedback.id)
	}

export const feedbackUnsubscribe =
	(instance: ModuleInstance, type: FeedbackSubscriptionKey) =>
	(feedback: CompanionFeedbackInfo, _context: CompanionFeedbackContext): void => {
		instance.feedbackSubscriptions[type].delete(feedback.id)
	}

export const addUnsubscribe = <
	TSchema extends Record<string, { type: 'boolean' | 'value' | 'advanced'; options: CompanionOptionValues }>,
>(
	instance: ModuleInstance,
	feedbacks: Partial<CompanionFeedbackDefinitions<TSchema>>,
	subscriptionKey: FeedbackSubscriptionKey,
): void => {
	;(Object.keys(feedbacks) as Array<keyof typeof feedbacks>).forEach((key) => {
		const feedback = feedbacks[key]
		if (feedback) {
			feedback.unsubscribe = feedbackUnsubscribe(instance, subscriptionKey)
		}
	})
}

export function ensureAllFeedbackKeys<
	TSchema extends Record<string, CompanionFeedbackSchema<CompanionOptionValues>>,
	TEnum extends Record<string, keyof TSchema & string>,
>(
	feedbacks: Partial<CompanionFeedbackDefinitions<TSchema>>,
	feedbackIds: TEnum,
): asserts feedbacks is CompanionFeedbackDefinitions<TSchema> {
	for (const key of Object.values(feedbackIds)) {
		if (!(key in feedbacks)) {
			;(feedbacks as Record<string, unknown>)[key] = undefined
		}
	}
}
