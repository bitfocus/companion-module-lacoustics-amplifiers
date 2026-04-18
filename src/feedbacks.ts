import type ModuleInstance from './main.js'
import { getAvdeccFeedbacks } from './feedbacks/avdecc.js'
import { getClockFeedbacks } from './feedbacks/clock.js'
import { getControlFeedbacks } from './feedbacks/control.js'
import { getGraphicFeedbacks } from './feedbacks/graphics.js'
import { getLevelFeedbacks } from './feedbacks/level.js'
import { getPowerFeedbacks } from './feedbacks/power.js'
import { getPtpFeedbacks } from './feedbacks/ptp.js'

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
