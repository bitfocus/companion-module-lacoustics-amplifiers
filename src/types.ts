import type {
	InstanceBase,
	CompanionActionSchema,
	CompanionOptionValues,
	CompanionFeedbackSchema,
	CompanionVariableValues,
} from '@companion-module/base'
import type { ModuleConfig, ModuleSecrets } from './config.js'
import { LacousticDevice } from './device.js'
import * as Enums from './enums/enums.js'

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
	actions: Record<string, CompanionActionSchema<CompanionOptionValues>>
	feedbacks: Record<string, CompanionFeedbackSchema<CompanionOptionValues>>
	variables: CompanionVariableValues
}

export interface InstanceBaseExt extends InstanceBase<ModuleTypes> {
	device: LacousticDevice<Enums.InfoNameEnum>
	feedbackSubscriptions: feedbackSubscriptions
}
