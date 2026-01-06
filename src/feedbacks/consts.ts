import { combineRgb } from '@companion-module/base'

export const colors = {
	red: combineRgb(255, 0, 0),
	black: combineRgb(0, 0, 0),
	amber: combineRgb(255, 191, 0),
}

export const styles = {
	blackOnRed: {
		bgcolor: colors.red,
		color: colors.black,
	},
	blackOnAmber: {
		bgcolor: colors.amber,
		color: colors.black,
	},
}
