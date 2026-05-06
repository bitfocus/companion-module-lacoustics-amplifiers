import type { CompanionFeedbackDefinitions } from '@companion-module/base'
import type ModuleInstance from '../main.js'
import { ChannelOption } from '../options.js'
import { styles, feedbackSubscribe, addUnsubscribe, ensureAllFeedbackKeys } from './consts.js'
import { intRangeLimiter } from '../utils.js'

export enum FeedbackIdsControl {
	DspOutputMute = 'dspOutputMute',
	DspOutputPolarity = 'dspOutputPolarity',
	DspOutputDelay = 'dspOutputDelay',
	DspOutputGain = 'dspOutputGain',
	DspOutputVolume = 'dspOutputVolume',
}

export type FeedbackSchemaControl = {
	[FeedbackIdsControl.DspOutputMute]: {
		type: 'boolean'
		options: {
			channel: number
		}
	}
	[FeedbackIdsControl.DspOutputPolarity]: {
		type: 'boolean'
		options: {
			channel: number
		}
	}
	[FeedbackIdsControl.DspOutputDelay]: {
		type: 'value'
		options: {
			channel: number
		}
	}
	[FeedbackIdsControl.DspOutputGain]: {
		type: 'value'
		options: {
			channel: number
		}
	}
	[FeedbackIdsControl.DspOutputVolume]: {
		type: 'value'
		options: {
			channel: number
		}
	}
}

export function getControlFeedbacks(instance: ModuleInstance): CompanionFeedbackDefinitions<FeedbackSchemaControl> {
	const feedbacks: Partial<CompanionFeedbackDefinitions<FeedbackSchemaControl>> = {}
	if (instance.device.outputDspChannelCount > 0) {
		feedbacks.dspOutputMute = {
			name: 'DSP Output - Mute',
			type: 'boolean',
			defaultStyle: styles.blackOnRed,
			options: [ChannelOption(instance.device.outputDspChannelCount)],
			callback: (feedback, _context) => {
				feedbackSubscribe(instance, 'control', feedback)
				const channelNum = intRangeLimiter(feedback.options.channel, 1, instance.device.outputDspChannelCount)
				return instance.device.outputDspChannels[channelNum - 1].mute
			},
		}
		feedbacks.dspOutputPolarity = {
			name: 'DSP Output - Polarity',
			type: 'boolean',
			defaultStyle: styles.blackOnAmber,
			options: [ChannelOption(instance.device.outputDspChannelCount)],
			callback: (feedback, _context) => {
				feedbackSubscribe(instance, 'control', feedback)
				const channelNum = intRangeLimiter(feedback.options.channel, 1, instance.device.outputDspChannelCount)
				return instance.device.outputDspChannels[channelNum - 1].invert
			},
		}
		feedbacks.dspOutputDelay = {
			name: 'DSP Output - Delay',
			type: 'value',
			options: [ChannelOption(instance.device.outputDspChannelCount)],
			callback: (feedback, _context) => {
				feedbackSubscribe(instance, 'control', feedback)
				const channelNum = intRangeLimiter(feedback.options.channel, 1, instance.device.outputDspChannelCount)
				return instance.device.outputDspChannels[channelNum - 1].delay
			},
		}
		feedbacks.dspOutputGain = {
			name: 'DSP Output - Gain',
			type: 'value',
			options: [ChannelOption(instance.device.outputDspChannelCount)],
			callback: (feedback, _context) => {
				feedbackSubscribe(instance, 'control', feedback)
				const channelNum = intRangeLimiter(feedback.options.channel, 1, instance.device.outputDspChannelCount)
				return instance.device.outputDspChannels[channelNum - 1].gain
			},
		}
		feedbacks.dspOutputVolume = {
			name: 'DSP Output - Volume',
			type: 'value',
			options: [ChannelOption(instance.device.outputDspChannelCount)],
			callback: (feedback, _context) => {
				feedbackSubscribe(instance, 'control', feedback)
				const channelNum = intRangeLimiter(feedback.options.channel, 1, instance.device.outputDspChannelCount)
				return instance.device.outputDspChannels[channelNum - 1].volume
			},
		}
	}

	addUnsubscribe(instance, feedbacks, 'control')
	ensureAllFeedbackKeys(feedbacks, FeedbackIdsControl)
	return feedbacks
}
