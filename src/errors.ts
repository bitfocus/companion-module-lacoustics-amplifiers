import { createModuleLogger, InstanceStatus } from '@companion-module/base'
import { ZodError } from 'zod'
import axios, { AxiosError } from 'axios'
import type ModuleInstance from './main.js'

/**
 * What went wrong, for a caller deciding whether retrying could ever help
 * - `auth` the credentials are wrong, so every attempt fails the same way
 * - `invalidData` the device answered, but not with something this module understands
 * - `transport` the request did not get an answer
 * - `unknown` anything else
 */
export type ErrorKind = 'auth' | 'invalidData' | 'transport' | 'unknown'

export interface HandleErrorOptions {
	/** Log invalid data as a one line summary, for a failure whose detail has already been logged in full */
	terse?: boolean
}

export function handleError(err: unknown, instance: ModuleInstance, options: HandleErrorOptions = {}): ErrorKind {
	if (axios.isAxiosError(err)) {
		return handleAxiosError(err, instance)
	} else if (err instanceof ZodError) {
		handleZodError(err, instance, options.terse ?? false)
		return 'invalidData'
	} else {
		handleUnknownError(err, instance)
		return 'unknown'
	}
}

function handleAxiosError(err: AxiosError, instance: ModuleInstance): ErrorKind {
	instance.debug(err)
	const logger = createModuleLogger('Axios Error Handler')
	if (err.response) {
		// Server responded with error status (4xx, 5xx)
		return handleHttpError(err, instance)
	} else if (err.request) {
		// Request sent but no response received (network/timeout issues)
		handleNetworkError(err, instance)
		return 'transport'
	} else {
		// Error during request setup
		instance.statusManager.updateStatus(InstanceStatus.UnknownError)
		logger.error(`Request setup error: ${err.message}`)
		return 'unknown'
	}
}

function handleHttpError(err: AxiosError, instance: ModuleInstance): ErrorKind {
	const status = err.response?.status
	const logger = createModuleLogger('HTTP Error Handler')
	// Set status based on HTTP response code
	if (status && status >= 500) {
		instance.statusManager.updateStatus(InstanceStatus.UnknownError)
		logger.error(`Server error ${status}: ${err.message}`)
	} else if (status === 401 || status === 403) {
		instance.statusManager.updateStatus(InstanceStatus.AuthenticationFailure)
		logger.error(`Authentication error ${status}: Check credentials`)
		return 'auth'
	} else if (status === 404) {
		instance.statusManager.updateStatus(InstanceStatus.UnknownWarning)
		logger.error(`Not found ${status}: Endpoint may have changed`)
	} else if (status === 429) {
		instance.statusManager.updateStatus(InstanceStatus.UnknownWarning)
		logger.error(`Rate limited ${status}: Too many requests`)
	} else {
		instance.statusManager.updateStatus(InstanceStatus.UnknownWarning)
		logger.error(`HTTP ${status}: ${err.message}`)
	}

	// Log response data if useful
	if (err.response?.data && typeof err.response.data === 'string') {
		logger.error(`Response: ${err.response.data}`)
	}

	return 'transport'
}

function handleNetworkError(err: AxiosError, instance: ModuleInstance): void {
	const code = err.code
	const logger = createModuleLogger('Network Error Handler')
	switch (code) {
		case 'ECONNREFUSED':
			instance.statusManager.updateStatus(InstanceStatus.ConnectionFailure)
			logger.error('Connection refused: Device may be offline or unreachable')
			break

		case 'ETIMEDOUT':
		case 'ECONNABORTED':
			instance.statusManager.updateStatus(InstanceStatus.ConnectionFailure)
			logger.error(`Request timed out: Device not responding (${code})`)
			break

		case 'ENOTFOUND':
		case 'EAI_AGAIN':
			instance.statusManager.updateStatus(InstanceStatus.ConnectionFailure)
			logger.error(`DNS resolution failed: Cannot find device hostname (${code})`)
			break

		case 'ENETUNREACH':
		case 'EHOSTUNREACH':
			instance.statusManager.updateStatus(InstanceStatus.ConnectionFailure)
			logger.error(`Network unreachable: Check network connectivity (${code})`)
			break

		case 'ECONNRESET':
			instance.statusManager.updateStatus(InstanceStatus.ConnectionFailure)
			logger.error('Connection reset: Device closed connection unexpectedly')
			break

		case 'EPIPE':
			instance.statusManager.updateStatus(InstanceStatus.ConnectionFailure)
			logger.error('Broken pipe: Connection lost during transmission')
			break

		case 'ECANCELED':
			// Request was cancelled (e.g., by AbortController)
			logger.warn('Request cancelled')
			// Don't change status for cancellations
			break

		case 'ERR_NETWORK':
			// Generic network error (often seen in browsers)
			instance.statusManager.updateStatus(InstanceStatus.ConnectionFailure)
			logger.error('Network error: Check device connection')
			break

		case 'ERR_BAD_REQUEST':
			// Request was malformed
			instance.statusManager.updateStatus(InstanceStatus.UnknownError)
			logger.error(`Bad request: ${err.message}`)
			break

		case 'ERR_BAD_RESPONSE':
			// Response was malformed
			instance.statusManager.updateStatus(InstanceStatus.UnknownWarning)
			logger.error(`Invalid response from device: ${err.message}`)
			break

		default:
			// Unknown network error
			instance.statusManager.updateStatus(InstanceStatus.ConnectionFailure)
			logger.error(`Network error${code ? ` (${code})` : ''}: ${err.message}`)
			break
	}

	// Additional context
	if (err.config?.url) {
		logger.debug(`Failed URL: ${err.config.url}`)
	}
}

const MAX_ISSUE_INPUT_LENGTH = 200

/**
 * Render a rejected value for the log, truncated since it can be a whole domain object
 * @param {unknown} input The value the schema rejected
 * @returns {string} The value as JSON, cut to MAX_ISSUE_INPUT_LENGTH characters
 */
function formatIssueInput(input: unknown): string {
	const text = JSON.stringify(input) ?? String(input)
	return text.length > MAX_ISSUE_INPUT_LENGTH ? `${text.slice(0, MAX_ISSUE_INPUT_LENGTH)}…` : text
}

function handleZodError(err: ZodError, instance: ModuleInstance, terse: boolean): void {
	const logger = createModuleLogger('Zod Error Handler')
	// The request itself succeeded and already reported Ok, so without this a response the module cannot use stays green
	instance.statusManager.updateStatus(InstanceStatus.UnknownWarning, 'Invalid data returned by device')
	logger.debug(JSON.stringify(err))

	// A device that keeps answering with data this module cannot parse would otherwise reprint the whole list on
	// every retry, for as long as it is connected
	if (terse) {
		logger.warn(
			`Invalid data returned: ${err.issues.length} issue${err.issues.length === 1 ? '' : 's'}, detail logged on the first attempt`,
		)
		return
	}

	// Format Zod errors more readably. The rejected value goes in too: debug lines never reach Companion's main log,
	// which is the one users send, so without it a report says what was wrong but not what the device sent
	const formattedErrors = err.issues
		.map((issue) => {
			const value = issue.input === undefined ? '' : ` (value: ${formatIssueInput(issue.input)})`
			return `${issue.path.join('.')}: ${issue.message}${value}`
		})
		.join('\n  ')

	logger.warn(`Invalid data returned:\n  ${formattedErrors}`)
}

function handleUnknownError(err: unknown, instance: ModuleInstance): void {
	const logger = createModuleLogger('Unknown Error Handler')
	instance.statusManager.updateStatus(InstanceStatus.UnknownError)

	// Safely stringify unknown errors
	const errorMessage = err instanceof Error ? err.message : String(err)

	logger.error(`Unknown error: ${errorMessage}`)

	// Log stack trace if available
	if (err instanceof Error && err.stack) {
		logger.debug(err.stack)
	}
}
