import type { CompanionFeedbackDefinition, CompanionFeedbackDefinitions } from '@companion-module/base'
import type { ModuleInstance } from '../main.js'
import { feedbackSubscribe, feedbackUnsubscribe } from './consts.js'

export function getPtpFeedbacks(instance: ModuleInstance): CompanionFeedbackDefinitions {
	const feedbacks: Record<string, CompanionFeedbackDefinition> = {}
	if (instance.device.ptpSupported) {
		feedbacks.ptpV2Domain = {
			name: 'PTP - V2 Domain',
			type: 'value',
			options: [],
			callback: (_feedback, _context) => {
				return instance.device.ptpV2Domain
			},
		}
		feedbacks.ptpGmId = {
			name: 'PTP - Grandmaster ID',
			type: 'value',
			options: [{ id: 'useSec', type: 'checkbox', label: 'Secondary Port', default: false }],
			callback: (feedback, _context) => {
				return feedback.options.useSec ? instance.device.ptpGmIdSec : instance.device.ptpGmIdPri
			},
		}
		feedbacks.ptpPri1 = {
			name: 'PTP - Priority 1',
			type: 'value',
			options: [{ id: 'useSec', type: 'checkbox', label: 'Secondary Port', default: false }],
			callback: (feedback, _context) => {
				return feedback.options.useSec ? instance.device.ptpPriority1Sec : instance.device.ptpPriority1Pri
			},
		}
		feedbacks.ptpPri2 = {
			name: 'PTP - Priority 2',
			type: 'value',
			options: [{ id: 'useSec', type: 'checkbox', label: 'Secondary Port', default: false }],
			callback: (feedback, _context) => {
				return feedback.options.useSec ? instance.device.ptpPriority2Sec : instance.device.ptpPriority2Pri
			},
		}
		feedbacks.ptpPathLength = {
			name: 'PTP - Path Length',
			type: 'value',
			options: [{ id: 'useSec', type: 'checkbox', label: 'Secondary Port', default: false }],
			callback: (feedback, _context) => {
				return feedback.options.useSec ? instance.device.ptpPathLengthSec : instance.device.ptpPathLengthPri
			},
		}
	}
	Object.keys(feedbacks).forEach((key) => {
		feedbacks[key].subscribe = feedbackSubscribe(instance, 'ptp')
		feedbacks[key].unsubscribe = feedbackUnsubscribe(instance, 'ptp')
	})
	return feedbacks
}
