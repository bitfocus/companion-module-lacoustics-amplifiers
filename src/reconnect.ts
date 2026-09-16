export interface BackoffOptions {
	/** Delay before the first attempt. */
	readonly initialDelayMs: number
	/** Ceiling the doubling delay stops at. */
	readonly maxDelayMs: number
}

/**
 * Retrying the initial device query after it fails. An amp powering up with the
 * rack answers within the first few attempts, while a host that is switched off,
 * or an address typed wrong, backs off to one attempt every 5 minutes rather
 * than querying and logging forever.
 */
export const RECONNECT_BACKOFF: BackoffOptions = { initialDelayMs: 10_000, maxDelayMs: 300_000 }

/**
 * Runs a callback after a delay that doubles with each attempt, up to a
 * ceiling, until `reset()` starts it over.
 *
 * Only one attempt is ever pending: `schedule()` while one is waiting is a
 * no-op, so a failure reported from more than one place cannot stack up
 * attempts.
 *
 * Copied from companion-module-generic-oca, along with its tests.
 */
export class BackoffScheduler {
	private attemptCount = 0
	private timer: NodeJS.Timeout | undefined

	constructor(
		private readonly callback: () => void,
		private readonly options: BackoffOptions,
		private readonly signal?: AbortSignal,
	) {
		signal?.addEventListener('abort', () => this.cancel(), { once: true })
	}

	/** Attempts scheduled since construction or the last `reset()`. */
	public get attempts(): number {
		return this.attemptCount
	}

	public get pending(): boolean {
		return this.timer !== undefined
	}

	/**
	 * Schedule the next attempt.
	 *
	 * @returns The delay used, or `undefined` when nothing was scheduled because
	 * an attempt is already pending or the signal has aborted.
	 */
	public schedule(): number | undefined {
		if (this.signal?.aborted || this.timer !== undefined) return undefined
		const delay = Math.min(this.options.initialDelayMs * 2 ** this.attemptCount, this.options.maxDelayMs)
		this.attemptCount++
		this.timer = setTimeout(() => {
			this.timer = undefined
			this.callback()
		}, delay)
		return delay
	}

	/** Drop the pending attempt, if any, keeping the backoff where it is. */
	public cancel(): void {
		clearTimeout(this.timer)
		this.timer = undefined
	}

	/** Drop the pending attempt, if any, and start the backoff over from the initial delay. */
	public reset(): void {
		this.cancel()
		this.attemptCount = 0
	}
}
