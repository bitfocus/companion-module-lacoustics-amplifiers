import type { CompanionFeedbackDefinition, CompanionFeedbackDefinitions } from '@companion-module/base'
import type ModuleInstance from '../main.js'
import { ChannelOption } from '../options.js'
import { styles, feedbackSubscribe, feedbackUnsubscribe } from './consts.js'
import { intRangeLimiter } from '../utils.js'

export function getControlFeedbacks(instance: ModuleInstance): CompanionFeedbackDefinitions {
	const feedbacks: Record<string, CompanionFeedbackDefinition> = {}
	if (instance.device.outputDspChannelCount > 0) {
		feedbacks.dspOutputMute = {
			name: 'DSP Output - Mute',
			type: 'boolean',
			defaultStyle: styles.blackOnRed,
			options: [ChannelOption(instance.device.outputDspChannelCount)],
			callback: (feedback, _context) => {
				feedbackSubscribe(instance, 'control')
				const channelNum = intRangeLimiter(feedback.options.channel as number, 1, instance.device.outputDspChannelCount)
				return instance.device.outputDspChannels[channelNum - 1].mute
			},
		}
		feedbacks.dspOutputPolarity = {
			name: 'DSP Output - Polarity',
			type: 'boolean',
			defaultStyle: styles.blackOnAmber,
			options: [ChannelOption(instance.device.outputDspChannelCount)],
			callback: (feedback, _context) => {
				feedbackSubscribe(instance, 'control')
				const channelNum = intRangeLimiter(feedback.options.channel as number, 1, instance.device.outputDspChannelCount)
				return instance.device.outputDspChannels[channelNum - 1].invert
			},
		}
		feedbacks.dspOutputDelay = {
			name: 'DSP Output - Delay',
			type: 'value',
			options: [ChannelOption(instance.device.outputDspChannelCount)],
			callback: (feedback, _context) => {
				feedbackSubscribe(instance, 'control')
				const channelNum = intRangeLimiter(feedback.options.channel as number, 1, instance.device.outputDspChannelCount)
				return instance.device.outputDspChannels[channelNum - 1].delay
			},
		}
		feedbacks.dspOutputGain = {
			name: 'DSP Output - Gain',
			type: 'value',
			options: [ChannelOption(instance.device.outputDspChannelCount)],
			callback: (feedback, _context) => {
				feedbackSubscribe(instance, 'control')
				const channelNum = intRangeLimiter(feedback.options.channel as number, 1, instance.device.outputDspChannelCount)
				return instance.device.outputDspChannels[channelNum - 1].gain
			},
		}
		feedbacks.dspOutputVolume = {
			name: 'DSP Output - Volume',
			type: 'value',
			options: [ChannelOption(instance.device.outputDspChannelCount)],
			callback: (feedback, _context) => {
				feedbackSubscribe(instance, 'control')
				const channelNum = intRangeLimiter(feedback.options.channel as number, 1, instance.device.outputDspChannelCount)
				return instance.device.outputDspChannels[channelNum - 1].volume
			},
		}
	}
	Object.keys(feedbacks).forEach((key) => {
		feedbacks[key].unsubscribe = feedbackUnsubscribe(instance, 'control')
	})
	return feedbacks
}
