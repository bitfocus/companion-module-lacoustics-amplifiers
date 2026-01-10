import {
	type CompanionFeedbackDefinition,
	type CompanionFeedbackDefinitions,
	type CompanionInputFieldTextInput,
	type CompanionInputFieldNumber,
	type CompanionInputFieldDropdown,
	Regex,
} from '@companion-module/base'
import type { ModuleInstance } from '../main.js'
//import { ChannelOption } from '../options.js'
import { colors } from './consts.js'
//import { intRangeLimiter } from '../utils.js'
import { graphics } from 'companion-module-utils'

const value = {
	type: 'textinput',
	id: 'value',
	label: 'Value',
	default: '-20',
	useVariables: { local: true },
	regex: Regex.SOMETHING,
} as const satisfies CompanionInputFieldTextInput

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
	required: true,
} as const satisfies CompanionInputFieldNumber

const offsetOption = {
	type: 'number',
	label: 'Offset',
	id: 'offset',
	description: 'Distance from edge of button, axial orientation',
	min: 0,
	max: 20,
	default: 5,
	required: true,
} as const satisfies CompanionInputFieldNumber

const valueToPercent = (value: number, min = 0, max = 100, invert = false): number => {
	if (typeof value == 'string') value = Number.parseFloat(value)
	const percent = ((value - min) / (max - min)) * 100
	const result = Number.isNaN(percent) || percent < 0 ? 0 : Math.round(percent)
	return invert ? 100 - result : result
}

export function getGraphicFeedbacks(instance: ModuleInstance): CompanionFeedbackDefinitions {
	const feedbacks: Record<string, CompanionFeedbackDefinition> = {}
	feedbacks.levelMeter = {
		name: 'Level Meter',
		description: 'Level Meter',
		type: 'advanced',
		options: [
			value,
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
			},
			{
				type: 'number',
				label: 'Maximum Value',
				id: 'max',
				default: 0,
				description: 'Value greater than or equal to this will result in fullscale metering',
				min: -0xffff,
				max: 0xffff,
			},
			{
				type: 'number',
				label: 'Minimum Value',
				id: 'min',
				default: -100,
				description: 'Value less than or equal to this will result in no metering',
				min: -0xffff,
				max: 0xffff,
			},
			{
				type: 'checkbox',
				label: 'Invert Meter',
				id: 'invertMeter',
				default: false,
			},
			{
				type: 'checkbox',
				label: 'Invert Value',
				id: 'invertValue',
				default: false,
			},
			{
				type: 'checkbox',
				label: 'Custom Color',
				id: 'customColor',
				default: false,
			},
			{
				type: 'colorpicker',
				label: 'Color',
				id: 'color',
				default: 0xffffff,
				enableAlpha: false,
				returnType: 'number',
				isVisibleExpression: '!!$(options:customColor)',
			},
		],
		callback: async (feedback, _context) => {
			if (!('image' in feedback) || feedback.image === undefined) {
				instance.log('warn', `Feedback ${feedback.id} does not support images}`)
				return {}
			}
			const opt = feedback.options
			const min = Number(opt.min)
			const max = Number(opt.max)
			const value = Number.parseFloat(opt.value?.toString() ?? '0')
			if (min >= max) {
				instance.log('warn', `Invalid min/max choices for level-meter.\n${JSON.stringify(opt)}`)
				return {}
			}
			const position = opt.position?.toString() ?? 'right'
			const padding = Number(opt.padding)
			let ofsX1 = 0
			let ofsX2 = 0
			let ofsY1 = 0
			let ofsY2 = 0
			let bWidth = 0
			let bLength = 0
			switch (position) {
				case 'left':
					ofsX1 = padding
					ofsY1 = Number(opt.offset)
					bWidth = Number(opt.width ?? 6)
					bLength = feedback?.image.height - ofsY1 * 2
					ofsX2 = ofsX1 + bWidth + 1
					ofsY2 = ofsY1
					break
				case 'right':
					ofsY1 = Number(opt.offset)
					bWidth = Number(opt.width ?? 6)
					bLength = feedback.image.height - ofsY1 * 2
					ofsX2 = feedback.image.width - bWidth - padding
					ofsX1 = ofsX2
					ofsY2 = ofsY1
					break
				case 'top':
					ofsX1 = Number(opt.offset)
					ofsY1 = padding
					bWidth = Number(opt.width ?? 7)
					bLength = feedback.image.width - ofsX1 * 2
					ofsX2 = ofsX1
					ofsY2 = ofsY1 + bWidth + 1
					break
				case 'bottom':
					ofsX1 = Number(opt.offset)
					bWidth = Number(opt.width ?? 7)
					ofsY2 = feedback.image.height - bWidth - padding
					bLength = feedback.image.width - ofsX1 * 2
					ofsX2 = ofsX1
					ofsY1 = ofsY2
			}

			const barColors: graphics.BarColor[] = opt.customColor
				? [
						{
							size: 100,
							color: Number(opt.color ?? colors.white),
							background: Number(opt.color ?? colors.black),
							backgroundOpacity: 64,
						},
					]
				: [
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
				value: valueToPercent(value, min, max, Boolean(opt.invertValue)),
				reverse: Boolean(opt.invertMeter),
				offsetX: ofsX1,
				offsetY: ofsY1,
				opacity: 255,
			}
			instance.debug(`Feedback: ${JSON.stringify(feedback)}\n Bar Options: ${JSON.stringify(options)}`)
			return {
				imageBuffer: graphics.bar(options),
			}
		},
	}
	return feedbacks
}
