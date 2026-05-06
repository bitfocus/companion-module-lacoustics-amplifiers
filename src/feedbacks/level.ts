import type { CompanionFeedbackDefinitions } from '@companion-module/base'
import type ModuleInstance from '../main.js'
import { ChannelOption } from '../options.js'
import { feedbackSubscribe, addUnsubscribe, ensureAllFeedbackKeys } from './consts.js'
import { intRangeLimiter } from '../utils.js'

export enum FeedbackIdsLevels {
	DspOutput = 'levelsDspOutput',
	DspInput = 'levelsDspInput',
}

export type FeedbackSchemaLevels = {
	[FeedbackIdsLevels.DspOutput]: {
		type: 'value'
		options: {
			channel: number
		}
	}
	[FeedbackIdsLevels.DspInput]: {
		type: 'value'
		options: {
			channel: number
		}
	}
}

export function getLevelFeedbacks(instance: ModuleInstance): CompanionFeedbackDefinitions<FeedbackSchemaLevels> {
	const feedbacks: Partial<CompanionFeedbackDefinitions<FeedbackSchemaLevels>> = {}
	if (instance.device.outputDspLevelsCount > 0) {
		feedbacks.levelsDspOutput = {
			name: 'Levels - DSP Output',
			type: 'value',
			options: [ChannelOption(instance.device.outputDspLevelsCount)],
			callback: (feedback, _context) => {
				feedbackSubscribe(instance, 'level', feedback)
				const channelNum = intRangeLimiter(feedback.options.channel, 1, instance.device.outputDspChannelCount)
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
				feedbackSubscribe(instance, 'level', feedback)
				const channelNum = intRangeLimiter(feedback.options.channel, 1, instance.device.inputDspLevelsCount)
				return instance.device.inputDspLevels[channelNum - 1].peak
			},
		}
	}

	addUnsubscribe(instance, feedbacks, 'level')
	ensureAllFeedbackKeys(feedbacks, FeedbackIdsLevels)
	return feedbacks
}
