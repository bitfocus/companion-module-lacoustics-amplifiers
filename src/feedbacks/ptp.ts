import type { CompanionFeedbackDefinitions } from '@companion-module/base'
import type ModuleInstance from '../main.js'
import { feedbackSubscribe, addUnsubscribe, ensureAllFeedbackKeys } from './consts.js'

export enum FeedbackIdsPtp {
	V2Domain = 'ptpV2Domain',
	Primary = 'ptpPrimary',
	Secondary = 'ptpSecondary',
}

type PtpProperties = keyof ModuleInstance['device']['ptpPrimary']

export type FeedbackSchemaPtp = {
	[FeedbackIdsPtp.V2Domain]: {
		type: 'value'
		// eslint-disable-next-line @typescript-eslint/no-empty-object-type
		options: {}
	}
	[FeedbackIdsPtp.Primary]: {
		type: 'value'
		options: {
			prop: PtpProperties
		}
	}
	[FeedbackIdsPtp.Secondary]: {
		type: 'value'
		options: {
			prop: PtpProperties
		}
	}
}

export function getPtpFeedbacks(instance: ModuleInstance): CompanionFeedbackDefinitions<FeedbackSchemaPtp> {
	const feedbacks: Partial<CompanionFeedbackDefinitions<FeedbackSchemaPtp>> = {}
	if (instance.device.ptpSupported) {
		feedbacks[FeedbackIdsPtp.V2Domain] = {
			name: 'PTP - V2 Domain',
			type: 'value',
			options: [],
			callback: (_feedback, _context) => {
				feedbackSubscribe(instance, 'ptp')
				return instance.device.ptpV2Domain
			},
		}
		feedbacks[FeedbackIdsPtp.Primary] = {
			name: 'PTP - Primary',
			type: 'value',
			options: [
				{
					id: 'prop',
					type: 'dropdown',
					label: 'property',
					default: 'gm_id',
					choices: [
						{ id: 'gm_id', label: 'GM ID' },
						{ id: 'priority1', label: 'Priority 1' },
						{ id: 'priority2', label: 'Priority 2' },
						{ id: 'as_path_length', label: 'Path Length' },
					],
				},
			],
			callback: (feedback, _context) => {
				feedbackSubscribe(instance, 'ptp')
				const prop = feedback.options.prop
				return instance.device.ptpPrimary[prop]
			},
		}
		if (instance.device.ptpSecondarySupported) {
			feedbacks[FeedbackIdsPtp.Secondary] = {
				name: 'PTP - Secondary',
				type: 'value',
				options: [
					{
						id: 'prop',
						type: 'dropdown',
						label: 'property',
						default: 'gm_id',
						choices: [
							{ id: 'gm_id', label: 'GM ID' },
							{ id: 'priority1', label: 'Priority 1' },
							{ id: 'priority2', label: 'Priority 2' },
							{ id: 'as_path_length', label: 'Path Length' },
						],
					},
				],
				callback: (feedback, _context) => {
					feedbackSubscribe(instance, 'ptp')
					const prop = feedback.options.prop
					return instance.device.ptpSecondary[prop]
				},
			}
		}
	}

	addUnsubscribe(instance, feedbacks, 'ptp')
	ensureAllFeedbackKeys(feedbacks, FeedbackIdsPtp)
	return feedbacks
}
