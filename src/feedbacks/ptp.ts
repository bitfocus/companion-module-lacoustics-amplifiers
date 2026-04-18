import type { CompanionFeedbackDefinition, CompanionFeedbackDefinitions } from '@companion-module/base'
import type ModuleInstance from '../main.js'
import { feedbackSubscribe, feedbackUnsubscribe } from './consts.js'
import { isKeyOf } from '../utils.js'

export function getPtpFeedbacks(instance: ModuleInstance): CompanionFeedbackDefinitions {
	const feedbacks: Record<string, CompanionFeedbackDefinition> = {}
	if (instance.device.ptpSupported) {
		feedbacks.ptpV2Domain = {
			name: 'PTP - V2 Domain',
			type: 'value',
			options: [],
			callback: (_feedback, _context) => {
				feedbackSubscribe(instance, 'ptp')
				return instance.device.ptpV2Domain
			},
		}
		feedbacks.ptpPrimary = {
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
				const prop = (feedback.options.prop as string) || 'gm_id'
				if (isKeyOf(instance.device.ptpPrimary, prop)) return instance.device.ptpPrimary[prop]
				return null
			},
		}
		if (instance.device.ptpSecondarySupported) {
			feedbacks.ptpSecondary = {
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
					const prop = (feedback.options.prop as string) || 'gm_id'
					if (isKeyOf(instance.device.ptpSecondary, prop)) return instance.device.ptpSecondary[prop]
					return null
				},
			}
		}
	}
	Object.keys(feedbacks).forEach((key) => {
		feedbacks[key].unsubscribe = feedbackUnsubscribe(instance, 'ptp')
	})
	return feedbacks
}
