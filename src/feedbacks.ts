import type ModuleInstance from './main.js'
import { FeedbackSchemaAvdecc, getAvdeccFeedbacks } from './feedbacks/avdecc.js'
import { FeedbackSchemaClock, getClockFeedbacks } from './feedbacks/clock.js'
import { FeedbackSchemaControl, getControlFeedbacks } from './feedbacks/control.js'
import { getGraphicFeedbacks } from './feedbacks/graphics.js'
import { FeedbackSchemaLevels, getLevelFeedbacks } from './feedbacks/level.js'
import { FeedbackSchemaPower, getPowerFeedbacks } from './feedbacks/power.js'
import { FeedbackSchemaPtp, getPtpFeedbacks } from './feedbacks/ptp.js'

export type FeedbackSchema = Partial<
	FeedbackSchemaAvdecc &
		FeedbackSchemaClock &
		FeedbackSchemaControl &
		FeedbackSchemaLevels &
		FeedbackSchemaPower &
		FeedbackSchemaPtp
>

export function UpdateFeedbacks(self: ModuleInstance): void {
	const feedbacks = {
		...getAvdeccFeedbacks(self),
		...getClockFeedbacks(self),
		...getControlFeedbacks(self),
		...getGraphicFeedbacks(self),
		...getLevelFeedbacks(self),
		...getPowerFeedbacks(self),
		...getPtpFeedbacks(self),
	}
	self.setFeedbackDefinitions(feedbacks)
}
