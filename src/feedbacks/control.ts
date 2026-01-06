import type { CompanionFeedbackDefinition, CompanionFeedbackDefinitions } from '@companion-module/base'
import type { ModuleInstance } from '../main.js'
import { ChannelOption } from '../options.js'
import { styles, feedbackSubscribe, feedbackUnsubscribe } from './consts.js'

export function getControlFeedbacks(instance: ModuleInstance): CompanionFeedbackDefinitions {
	const feedbacks: Record<string, CompanionFeedbackDefinition> = {}
	if (instance.device.outputDspChannelCount > 0) {
		feedbacks.dspOutputMute = {
			name: 'DSP Output - Mute',
			type: 'boolean',
			defaultStyle: styles.blackOnRed,
			options: [ChannelOption(instance.device.outputDspChannelCount)],
			callback: (feedback, _context) => {
				return instance.device.outputDspChannels[Number(feedback.options.channel) - 1].mute
			},
		}
		feedbacks.dspOutputPolarity = {
			name: 'DSP Output - Polarity',
			type: 'boolean',
			defaultStyle: styles.blackOnAmber,
			options: [ChannelOption(instance.device.outputDspChannelCount)],
			callback: (feedback, _context) => {
				return instance.device.outputDspChannels[Number(feedback.options.channel) - 1].invert
			},
		}
		feedbacks.dspOutputDelay = {
			name: 'DSP Output - Delay',
			type: 'value',
			options: [ChannelOption(instance.device.outputDspChannelCount)],
			callback: (feedback, _context) => {
				return instance.device.outputDspChannels[Number(feedback.options.channel) - 1].delay
			},
		}
		feedbacks.dspOutputGain = {
			name: 'DSP Output - Gain',
			type: 'value',
			options: [ChannelOption(instance.device.outputDspChannelCount)],
			callback: (feedback, _context) => {
				return instance.device.outputDspChannels[Number(feedback.options.channel) - 1].gain
			},
		}
		feedbacks.dspOutputVolume = {
			name: 'DSP Output - Gain',
			type: 'value',
			options: [ChannelOption(instance.device.outputDspChannelCount)],
			callback: (feedback, _context) => {
				return instance.device.outputDspChannels[Number(feedback.options.channel) - 1].volume
			},
		}
	}
	Object.keys(feedbacks).forEach((key) => {
		feedbacks[key].subscribe = feedbackSubscribe(instance, 'control')
		feedbacks[key].unsubscribe = feedbackUnsubscribe(instance, 'control')
	})
	return feedbacks
}
