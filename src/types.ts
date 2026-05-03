import type { InstanceBase, CompanionVariableValues } from '@companion-module/base'
import { ActionSchema } from './actions.js'
import type { ModuleConfig, ModuleSecrets } from './config.js'
import { LacousticsDevice } from './device.js'
import * as Enums from './enums/enums.js'
import { FeedbackSchema } from './feedbacks.js'

export const feedbackSubscriptionKeys = [
	'aes',
	'aes67',
	'avb',
	'avdecc',
	'bridge',
	'clock',
	'configuration',
	'control',
	'en54',
	'fan',
	'gpio',
	'hmi',
	'info',
	'input',
	'layout',
	'level',
	'lldp',
	'madi',
	'monitor',
	'mpl',
	'network',
	'output',
	'power',
	'ptp',
	'routing',
	'siggen',
] as const

export type FeedbackSubscriptionKey = (typeof feedbackSubscriptionKeys)[number]

export type feedbackSubscriptions = {
	[K in FeedbackSubscriptionKey]: Set<string>
}

export interface ModuleTypes {
	config: ModuleConfig
	secrets: ModuleSecrets
	actions: ActionSchema
	feedbacks: FeedbackSchema
	variables: CompanionVariableValues
}

export interface InstanceBaseExt extends InstanceBase<ModuleTypes> {
	device: LacousticsDevice<Enums.InfoNameEnum>
	feedbackSubscriptions: feedbackSubscriptions
}
