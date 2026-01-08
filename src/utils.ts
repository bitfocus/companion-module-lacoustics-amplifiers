export function isKeyOf<T extends object>(obj: T, key: PropertyKey): key is keyof T {
	return key in obj
}

export function intRangeLimiter(value: string, min: number, max: number): number {
	const num = parseInt(value, 10)
	if (isNaN(num)) return min
	return Math.min(Math.max(num, min), max)
}
export function floatRangeLimiter(value: string, min: number, max: number): number {
	const num = parseFloat(value)
	if (isNaN(num)) return min
	return Math.min(Math.max(num, min), max)
}
