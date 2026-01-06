import type { CompanionFeedbackDefinition, CompanionFeedbackDefinitions } from '@companion-module/base'
import type { ModuleInstance } from '../main.js'
import { ChannelOption } from '../options.js'
import { styles, feedbackSubscribe, feedbackUnsubscribe } from './consts.js'

export function getControlFeedbacks(instance: ModuleInstance): CompanionFeedbackDefinitions {
	const feedbacks: Record<string, CompanionFeedbackDefinition> = {}
	if (instance.device.outputDspChannelCount > 0) {
		feedbacks.dspOutputMute = {
			name: 'Output - Mute',
			type: 'boolean',
			defaultStyle: styles.blackOnRed,
			options: [ChannelOption(instance.device.outputDspChannelCount)],
			callback: (feedback, _context) => {
				return instance.device.outputDspChannels[Number(feedback.options.channel) - 1].mute
			},
			subscribe: feedbackSubscribe(instance, 'control'),
			unsubscribe: feedbackUnsubscribe(instance, 'control'),
		}
		feedbacks.dspOutputPolarity = {
			name: 'Output - Polarity',
			type: 'boolean',
			defaultStyle: styles.blackOnAmber,
			options: [ChannelOption(instance.device.outputDspChannelCount)],
			callback: (feedback, _context) => {
				return instance.device.outputDspChannels[Number(feedback.options.channel) - 1].invert
			},
			subscribe: feedbackSubscribe(instance, 'control'),
			unsubscribe: feedbackUnsubscribe(instance, 'control'),
		}
		feedbacks.dspOutputDelay = {
			name: 'Output - Delay',
			type: 'value',
			options: [ChannelOption(instance.device.outputDspChannelCount)],
			callback: (feedback, _context) => {
				return instance.device.outputDspChannels[Number(feedback.options.channel) - 1].delay
			},
			subscribe: feedbackSubscribe(instance, 'control'),
			unsubscribe: feedbackUnsubscribe(instance, 'control'),
		}
		feedbacks.dspOutputGain = {
			name: 'Output - Gain',
			type: 'value',
			options: [ChannelOption(instance.device.outputDspChannelCount)],
			callback: (feedback, _context) => {
				return instance.device.outputDspChannels[Number(feedback.options.channel) - 1].gain
			},
			subscribe: feedbackSubscribe(instance, 'control'),
			unsubscribe: feedbackUnsubscribe(instance, 'control'),
		}
	}
	return feedbacks
}
