import {
	type CompanionFeedbackDefinition,
	type CompanionFeedbackDefinitions,
	type CompanionInputFieldNumber,
	type CompanionInputFieldDropdown,
	CompanionAdvancedFeedbackDefinition,
} from '@companion-module/base'
import type ModuleInstance from '../main.js'
import { ChannelOption } from '../options.js'
import { colors, feedbackSubscribe, addUnsubscribe } from './consts.js'
import { intRangeLimiter } from '../utils.js'
import { graphics } from 'companion-module-utils'

const positionOption = {
	type: 'dropdown',
	label: 'Position',
	id: 'position',
	default: 'right',
	choices: [
		{ id: 'left', label: 'Left' },
		{ id: 'right', label: 'Right' },
		{ id: 'top', label: 'Top' },
		{ id: 'bottom', label: 'Bottom' },
	],
} as const satisfies CompanionInputFieldDropdown

const paddingOption = {
	type: 'number',
	label: 'Padding',
	id: 'padding',
	description: 'Distance from edge of button, perpendicular orientation',
	min: 0,
	max: 72,
	default: 1,
	range: true,
	step: 1,
	asInteger: true,
} as const satisfies CompanionInputFieldNumber

const offsetOption = {
	type: 'number',
	label: 'Offset',
	id: 'offset',
	description: 'Distance from edge of button, axial orientation',
	min: 0,
	max: 20,
	default: 5,
	range: true,
	step: 1,
	asInteger: true,
} as const satisfies CompanionInputFieldNumber

const valueToPercent = (value: number, min = 0, max = 100, invert = false): number => {
	if (typeof value == 'string') value = Number.parseFloat(value)
	const percent = ((value - min) / (max - min)) * 100
	const result = Number.isNaN(percent) || percent < 0 ? 0 : Math.round(percent)
	return invert ? 100 - result : result
}

const calculateBarDimensions = (
	position: string,
	padding: number,
	offset: number,
	width: number,
	imageWidth: number,
	imageHeight: number,
) => {
	let ofsX1 = 0
	let ofsY1 = 0
	let bWidth = 0
	let bLength = 0

	switch (position) {
		case 'left':
			ofsX1 = padding
			ofsY1 = offset
			bWidth = width
			bLength = imageHeight - ofsY1 * 2
			break
		case 'right':
			ofsY1 = offset
			bWidth = width
			bLength = imageHeight - ofsY1 * 2
			ofsX1 = imageWidth - bWidth - padding
			break
		case 'top':
			ofsX1 = offset
			ofsY1 = padding
			bWidth = width
			bLength = imageWidth - ofsX1 * 2
			break
		case 'bottom':
			ofsX1 = offset
			bWidth = width
			ofsY1 = imageHeight - bWidth - padding
			bLength = imageWidth - ofsX1 * 2
			break
	}

	return { ofsX1, ofsY1, bWidth, bLength }
}

const createLevelMeterFeedback = (
	instance: ModuleInstance,
	name: string,
	channelCount: number,
	getLevelValue: (channelNum: number) => number | undefined,
): CompanionAdvancedFeedbackDefinition => ({
	name,
	type: 'advanced',
	options: [
		ChannelOption(channelCount),
		positionOption,
		paddingOption,
		offsetOption,
		{
			type: 'number',
			label: 'Meter Width',
			id: 'width',
			default: 6,
			min: 1,
			max: 20,
			asInteger: true,
		},
		{
			type: 'number',
			label: 'Minimum Value',
			id: 'min',
			default: -100,
			description: 'Value less than or equal to this will result in no metering',
			min: -0xff,
			max: 0xff,
			asInteger: true,
		},
	],
	callback: async (feedback, _context) => {
		feedbackSubscribe(instance, 'level')
		if (!('image' in feedback) || feedback.image === undefined) {
			instance.log('warn', `Feedback ${feedback.id} does not support images}`)
			return {}
		}

		const opt = feedback.options
		const min = Number(opt.min)
		const max = 0
		const channelNum = intRangeLimiter(opt.channel as number, 1, channelCount)
		const value = getLevelValue(channelNum - 1)

		if (Number.isNaN(value) || value === undefined) throw new Error('Value is a NaN/Undefined')
		if (min >= max) {
			throw new Error(`Invalid min/max choices for level-meter.\n${JSON.stringify(opt)}`)
		}

		const position = (opt.position as string) ?? 'right'
		const padding = Number(opt.padding)
		const offset = Number(opt.offset)
		const width = Number(opt.width ?? 6)

		const { ofsX1, ofsY1, bWidth, bLength } = calculateBarDimensions(
			position,
			padding,
			offset,
			width,
			feedback.image.width,
			feedback.image.height,
		)

		const barColors: graphics.BarColor[] = [
			{ size: 50, color: colors.greenBright, background: colors.greenBright, backgroundOpacity: 64 },
			{ size: 25, color: colors.yellow, background: colors.yellow, backgroundOpacity: 64 },
			{ size: 25, color: colors.red, background: colors.red, backgroundOpacity: 64 },
		]

		const options: graphics.OptionsBar = {
			width: feedback.image.width,
			height: feedback.image.height,
			colors: barColors,
			barLength: bLength,
			barWidth: bWidth,
			type: position == 'left' || position == 'right' ? 'vertical' : 'horizontal',
			value: valueToPercent(value, min, max, false),
			reverse: false,
			offsetX: ofsX1,
			offsetY: ofsY1,
			opacity: 255,
		}

		instance.debug(`Feedback: ${JSON.stringify(feedback)}\n Bar Options: ${JSON.stringify(options)}`)
		return {
			imageBuffer: Buffer.from(graphics.bar(options)).toString('base64'),
		}
	},
})

export function getGraphicFeedbacks(instance: ModuleInstance): CompanionFeedbackDefinitions {
	const feedbacks: Record<string, CompanionFeedbackDefinition> = {}

	if (instance.device.outputDspLevelsCount > 0) {
		feedbacks.levelMeterDspOutput = createLevelMeterFeedback(
			instance,
			'Level Meter - DSP Output',
			instance.device.outputDspLevelsCount,
			(channelNum) => instance.device.outputDspLevels[channelNum]?.peak,
		)
	}

	if (instance.device.inputDspLevelsCount > 0) {
		feedbacks.levelMeterDspInput = createLevelMeterFeedback(
			instance,
			'Level Meter - DSP Input',
			instance.device.inputDspLevelsCount,
			(channelNum) => instance.device.inputDspLevels[channelNum]?.peak,
		)
	}

	addUnsubscribe(instance, feedbacks, 'level')

	return feedbacks
}
