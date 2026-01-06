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
