import { combineRgb, CompanionFeedbackDefinition } from '@companion-module/base'
import type { ModuleInstance } from './main.js'
import { ChannelOption } from './options.js'

export enum FeedbackId {
	OutputMute = 'outputMute',
	OutputPolarity = 'outputPolarity',
	OutputDelay = 'outputDelay',
	OutputGain = 'outputGain',
	OutputVolume = 'outputVolume',
	OutputLevel = 'outputLevel',
	InputLevel = 'inputLevel',
	PowerStandby = 'powerStandby',
}

const colors = {
	red: combineRgb(255, 0, 0),
	black: combineRgb(0, 0, 0),
	amber: combineRgb(255, 191, 0),
}

const styles = {
	blackOnRed: {
		bgcolor: colors.red,
		color: colors.black,
	},
	blackOnAmber: {
		bgcolor: colors.amber,
		color: colors.black,
	},
}

export function UpdateFeedbacks(self: ModuleInstance): void {
	const FeedbackDefinitions: { [id in FeedbackId]: CompanionFeedbackDefinition | undefined } = {
		[FeedbackId.OutputMute]: {
			name: 'Output - Mute',
			type: 'boolean',
			defaultStyle: styles.blackOnRed,
			options: [ChannelOption(self.device.outputChannelCount)],
			callback: (feedback, _context) => {
				return self.device.outputChannels[Number(feedback.options.channel) - 1].mute
			},
		},
		[FeedbackId.OutputPolarity]: {
			name: 'Output - Polarity',
			type: 'boolean',
			defaultStyle: styles.blackOnAmber,
			options: [ChannelOption(self.device.outputChannelCount)],
			callback: (feedback, _context) => {
				return self.device.outputChannels[Number(feedback.options.channel) - 1].invert
			},
		},
		[FeedbackId.OutputDelay]: {
			name: 'Output - Delay',
			type: 'value',
			options: [ChannelOption(self.device.outputChannelCount)],
			callback: (feedback, _context) => {
				return self.device.outputChannels[Number(feedback.options.channel) - 1].delay
			},
		},
		[FeedbackId.OutputGain]: {
			name: 'Output - Gain',
			type: 'value',
			options: [ChannelOption(self.device.outputChannelCount)],
			callback: (feedback, _context) => {
				return self.device.outputChannels[Number(feedback.options.channel) - 1].gain
			},
		},
		[FeedbackId.OutputVolume]: {
			name: 'Output - Volume',
			type: 'value',
			options: [ChannelOption(self.device.outputChannelCount)],
			callback: (feedback, _context) => {
				return self.device.outputChannels[Number(feedback.options.channel) - 1].volume
			},
		},
		[FeedbackId.OutputLevel]: {
			name: 'Output - Level',
			type: 'value',
			options: [ChannelOption(self.device.outputLevelsCount)],
			callback: (feedback, _context) => {
				return self.device.outputLevels[Number(feedback.options.channel) - 1].peak
			},
		},
		[FeedbackId.InputLevel]: {
			name: 'Input - Level',
			type: 'value',
			options: [ChannelOption(self.device.inputLevelsCount)],
			callback: (feedback, _context) => {
				return self.device.inputLevels[Number(feedback.options.channel) - 1].peak
			},
		},
		[FeedbackId.PowerStandby]: {
			name: 'Power - Standby',
			type: 'boolean',
			defaultStyle: styles.blackOnRed,
			options: [],
			callback: (_feedback, _context) => {
				return self.device.power
			},
		},
	}
	self.setFeedbackDefinitions(FeedbackDefinitions)
}
