import { createModuleLogger, InstanceStatus } from '@companion-module/base'
import { ZodError } from 'zod'
import axios, { AxiosError } from 'axios'
import type ModuleInstance from './main.js'

export function handleError(err: unknown, instance: ModuleInstance): void {
	if (axios.isAxiosError(err)) {
		handleAxiosError(err, instance)
	} else if (err instanceof ZodError) {
		handleZodError(err)
	} else {
		handleUnknownError(err, instance)
	}
}

function handleAxiosError(err: AxiosError, instance: ModuleInstance): void {
	instance.debug(err)
	const logger = createModuleLogger('Axios Error Handler')
	if (err.response) {
		// Server responded with error status (4xx, 5xx)
		handleHttpError(err, instance)
	} else if (err.request) {
		// Request sent but no response received (network/timeout issues)
		handleNetworkError(err, instance)
	} else {
		// Error during request setup
		instance.statusManager.updateStatus(InstanceStatus.UnknownError)
		logger.error(`Request setup error: ${err.message}`)
	}
}

function handleHttpError(err: AxiosError, instance: ModuleInstance): void {
	const status = err.response?.status
	const logger = createModuleLogger('HTTP Error Handler')
	// Set status based on HTTP response code
	if (status && status >= 500) {
		instance.statusManager.updateStatus(InstanceStatus.UnknownError)
		logger.error(`Server error ${status}: ${err.message}`)
	} else if (status === 401 || status === 403) {
		instance.statusManager.updateStatus(InstanceStatus.AuthenticationFailure)
		logger.error(`Authentication error ${status}: Check credentials`)
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

function handleZodError(err: ZodError): void {
	const logger = createModuleLogger('Zod Error Handler')
	logger.debug(JSON.stringify(err))

	// Format Zod errors more readably
	const formattedErrors = err.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('\n  ')

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
