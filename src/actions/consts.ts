import {
	CompanionActionContext,
	CompanionActionDefinitions,
	CompanionActionInfo,
	CompanionActionSchema,
	CompanionOptionValues,
} from '@companion-module/base'
import type ModuleInstance from '../main.js'
import { FeedbackSubscriptionKey } from '../types.js'

// These are necessary to make sure the correct polling takes place for actions that have a toggle or relative action

export const actionSubscribe =
	(instance: ModuleInstance, type: FeedbackSubscriptionKey) =>
	(action: CompanionActionInfo, _context: CompanionActionContext): void => {
		instance.feedbackSubscriptions[type].add(`action_${action.id}`)
	}

export const actionUnsubscribe =
	(instance: ModuleInstance, type: FeedbackSubscriptionKey) =>
	(action: CompanionActionInfo, _context: CompanionActionContext): void => {
		instance.feedbackSubscriptions[type].delete(`action_${action.id}`)
	}

export function ensureAllActionKeys<
	TSchema extends Record<string, CompanionActionSchema<CompanionOptionValues>>,
	TEnum extends Record<string, keyof TSchema & string>,
>(
	actions: Partial<CompanionActionDefinitions<TSchema>>,
	actionIds: TEnum,
): asserts actions is CompanionActionDefinitions<TSchema> {
	for (const key of Object.values(actionIds)) {
		if (!(key in actions)) {
			;(actions as Record<string, unknown>)[key] = undefined
		}
	}
}
