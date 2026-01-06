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
	'monitor',
	'network',
	'power',
	'ptp',
	'routing',
] as const

export type FeedbackSubscriptionKey = (typeof feedbackSubscriptionKeys)[number]

export type feedbackSubscriptions = {
	[K in FeedbackSubscriptionKey]: Set<string>
}
