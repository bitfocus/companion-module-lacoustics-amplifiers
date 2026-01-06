import type { CompanionFeedbackDefinition, CompanionFeedbackDefinitions } from '@companion-module/base'
import type { ModuleInstance } from '../main.js'
import { ChannelOption } from '../options.js'
//import { styles } from './consts.js'

export function getLevelFeedbacks(instance: ModuleInstance): CompanionFeedbackDefinitions {
	const feedbacks: Record<string, CompanionFeedbackDefinition> = {}
	if (instance.device.outputDspLevelsCount > 0) {
		feedbacks.levelsDspOutput = {
			name: 'Levels - Dsp Output',
			type: 'value',
			options: [ChannelOption(instance.device.outputDspLevelsCount)],
			callback: (feedback, _context) => {
				return instance.device.outputDspLevels[Number(feedback.options.channel) - 1].peak
			},
		}
	}
	if (instance.device.inputDspLevelsCount > 0) {
		feedbacks.levelsDspInput = {
			name: 'Levels - Dsp Input',
			type: 'value',
			options: [ChannelOption(instance.device.inputDspLevelsCount)],
			callback: (feedback, _context) => {
				return instance.device.inputDspLevels[Number(feedback.options.channel) - 1].peak
			},
		}
	}
	return feedbacks
}
