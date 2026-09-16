/*
 * Capture what the module logs. Both InstanceBase.log and createModuleLogger
 * write through global.COMPANION_LOGGER, the sink Companion's host installs, so
 * installing one here sees exactly what the host would receive.
 */

type LogSink = (source: string | undefined, level: string, message: string) => void

export interface LogLine {
	source: string | undefined
	level: string
	message: string
}

const sinkHolder = globalThis as { COMPANION_LOGGER?: LogSink }

/** Start capturing log lines, into the array returned */
export function captureLogs(): LogLine[] {
	const lines: LogLine[] = []
	sinkHolder.COMPANION_LOGGER = (source, level, message) => {
		lines.push({ source, level, message })
	}
	return lines
}

/** Stop capturing, restoring the default console sink */
export function releaseLogs(): void {
	delete sinkHolder.COMPANION_LOGGER
}
