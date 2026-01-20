import type { CompanionFeedbackDefinition, CompanionFeedbackDefinitions } from '@companion-module/base'
import type { ModuleInstance } from '../main.js'
import { ChannelOption } from '../options.js'
import { feedbackSubscribe, feedbackUnsubscribe } from './consts.js'
import { intRangeLimiter } from '../utils.js'

export function getLevelFeedbacks(instance: ModuleInstance): CompanionFeedbackDefinitions {
	const feedbacks: Record<string, CompanionFeedbackDefinition> = {}
	if (instance.device.outputDspLevelsCount > 0) {
		feedbacks.levelsDspOutput = {
			name: 'Levels - DSP Output',
			type: 'value',
			options: [ChannelOption(instance.device.outputDspLevelsCount)],
			callback: (feedback, _context) => {
				const channelNum = intRangeLimiter(String(feedback.options.channel), 1, instance.device.outputDspChannelCount)
				return instance.device.outputDspLevels[channelNum - 1].peak
			},
		}
	}
	if (instance.device.inputDspLevelsCount > 0) {
		feedbacks.levelsDspInput = {
			name: 'Levels - DSP Input',
			type: 'value',
			options: [ChannelOption(instance.device.inputDspLevelsCount)],
			callback: (feedback, _context) => {
				const channelNum = intRangeLimiter(String(feedback.options.channel), 1, instance.device.inputDspLevelsCount)
				return instance.device.inputDspLevels[channelNum - 1].peak
			},
		}
	}
	Object.keys(feedbacks).forEach((key) => {
		feedbacks[key].subscribe = feedbackSubscribe(instance, 'level')
		feedbacks[key].unsubscribe = feedbackUnsubscribe(instance, 'level')
	})
	return feedbacks
}
