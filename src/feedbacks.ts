import type { ModuleInstance } from './main.js'
import { getControlFeedbacks } from './feedbacks/control.js'
import { getLevelFeedbacks } from './feedbacks/level.js'
import { getPowerFeedbacks } from './feedbacks/power.js'

export function UpdateFeedbacks(self: ModuleInstance): void {
	const feedbacks = {
		...getControlFeedbacks(self),
		...getLevelFeedbacks(self),
		...getPowerFeedbacks(self),
	}
	self.setFeedbackDefinitions(feedbacks)
}
