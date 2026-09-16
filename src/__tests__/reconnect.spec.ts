import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { BackoffScheduler } from '../reconnect.js'

const options = { initialDelayMs: 100, maxDelayMs: 1000 }

describe('BackoffScheduler', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('runs the callback once the delay has elapsed', () => {
		const callback = vi.fn()
		const scheduler = new BackoffScheduler(callback, options)

		expect(scheduler.schedule()).toBe(100)
		expect(scheduler.pending).toBe(true)
		vi.advanceTimersByTime(99)
		expect(callback).not.toHaveBeenCalled()
		vi.advanceTimersByTime(1)
		expect(callback).toHaveBeenCalledTimes(1)
		expect(scheduler.pending).toBe(false)
	})

	it('doubles the delay with each attempt, up to the ceiling', () => {
		const scheduler = new BackoffScheduler(vi.fn(), options)

		const delays: (number | undefined)[] = []
		for (let i = 0; i < 6; i++) {
			delays.push(scheduler.schedule())
			vi.runAllTimers()
		}

		expect(delays).toEqual([100, 200, 400, 800, 1000, 1000])
		expect(scheduler.attempts).toBe(6)
	})

	it('coalesces schedule() calls while an attempt is pending', () => {
		// A dropped connection reports error, then close, then rejects in-flight requests
		const callback = vi.fn()
		const scheduler = new BackoffScheduler(callback, options)

		expect(scheduler.schedule()).toBe(100)
		expect(scheduler.schedule()).toBeUndefined()
		expect(scheduler.schedule()).toBeUndefined()
		vi.runAllTimers()

		expect(callback).toHaveBeenCalledTimes(1)
		expect(scheduler.attempts).toBe(1)
	})

	it('cancel() drops the pending attempt but keeps the backoff', () => {
		const callback = vi.fn()
		const scheduler = new BackoffScheduler(callback, options)

		scheduler.schedule()
		scheduler.cancel()
		vi.runAllTimers()

		expect(callback).not.toHaveBeenCalled()
		expect(scheduler.schedule()).toBe(200)
	})

	it('reset() drops the pending attempt and starts over from the initial delay', () => {
		const callback = vi.fn()
		const scheduler = new BackoffScheduler(callback, options)

		scheduler.schedule()
		vi.runAllTimers()
		scheduler.schedule()
		scheduler.reset()
		vi.runAllTimers()

		expect(callback).toHaveBeenCalledTimes(1)
		expect(scheduler.attempts).toBe(0)
		expect(scheduler.schedule()).toBe(100)
	})

	it('drops the pending attempt and refuses new ones once its signal aborts', () => {
		const callback = vi.fn()
		const controller = new AbortController()
		const scheduler = new BackoffScheduler(callback, options, controller.signal)

		scheduler.schedule()
		controller.abort()
		vi.runAllTimers()

		expect(callback).not.toHaveBeenCalled()
		expect(scheduler.schedule()).toBeUndefined()
		expect(scheduler.pending).toBe(false)
	})
})
