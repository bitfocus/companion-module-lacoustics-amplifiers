import { CompanionActionDefinitions, CompanionActionSchema, CompanionOptionValues } from '@companion-module/base'

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
