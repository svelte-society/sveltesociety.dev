import { ConfigProvider, Effect, Layer, ManagedRuntime } from 'effect'
import { EmailService } from './services/EmailService'
import { EmailServiceLive } from './layers/EmailServiceLive'
import { SesClientLive } from './layers/SesClientLive'
import { SesClientConsole } from './layers/SesClientConsole'
import { EmailQueueLive } from './layers/EmailQueueLive'
import { KeyValueStoreLive } from './layers/KeyValueStoreLive'
import { KeyValueStoreConfigLive } from './layers/KeyValueStoreConfigLive'
import type { EmailOptions, EmailResult } from './schemas'

/**
 * Check if we're in development mode.
 * In dev mode, emails are logged to console instead of sent via SES.
 */
const isDevMode = process.env.NODE_ENV !== 'production'

/**
 * Default config for development mode (no AWS credentials required).
 */
const DevConfigLayer = Layer.setConfigProvider(
	ConfigProvider.fromMap(
		new Map([
			['AWS_SES_FROM_EMAIL', 'dev@localhost'],
			['AWS_SES_RATE_LIMIT_MS', '0'],
			['AWS_SES_MAX_BATCH_SIZE', '50'],
			['AWS_SES_MAX_RETRIES', '3']
		])
	)
)

/**
 * Production layer: Uses real AWS SES, reads config from environment.
 */
const EmailProductionLayer = EmailServiceLive.pipe(
	Layer.provide(SesClientLive),
	Layer.provide(EmailQueueLive),
	Layer.provide(KeyValueStoreLive),
	Layer.provide(KeyValueStoreConfigLive)
)

/**
 * Development layer: Logs to console, uses default config.
 */
const EmailDevelopmentLayer = EmailServiceLive.pipe(
	Layer.provide(SesClientConsole),
	Layer.provide(EmailQueueLive),
	Layer.provide(KeyValueStoreLive),
	Layer.provide(KeyValueStoreConfigLive),
	Layer.provide(DevConfigLayer)
)

/**
 * Email service runtime - lazily initialized on first use.
 * Manages the lifecycle of all email service dependencies (LMDB, SES client).
 *
 * In development (NODE_ENV !== 'production'):
 * - Emails are logged to console, not sent
 * - No AWS credentials required
 *
 * In production (NODE_ENV === 'production'):
 * Required environment variables:
 * - AWS_SES_REGION
 * - AWS_SES_ACCESS_KEY
 * - AWS_SES_SECRET_KEY
 * - AWS_SES_FROM_EMAIL
 *
 * Optional (with defaults):
 * - AWS_SES_RATE_LIMIT_MS (default: 100)
 * - AWS_SES_MAX_BATCH_SIZE (default: 50)
 * - AWS_SES_MAX_RETRIES (default: 3)
 */
const emailRuntime = ManagedRuntime.make(
	isDevMode ? EmailDevelopmentLayer : EmailProductionLayer
)

if (isDevMode) {
	console.log('📧 Email service running in DEVELOPMENT mode (emails will be logged, not sent)')
}

/**
 * Email client interface for use in SvelteKit route handlers.
 * Wraps Effect operations in simple async functions.
 */
export interface EmailClient {
	/**
	 * Send a single email.
	 */
	send(options: typeof EmailOptions.Type): Promise<typeof EmailResult.Type>

	/**
	 * Send batch emails to multiple recipients.
	 */
	sendBatch(
		recipients: ReadonlyArray<string>,
		options: Omit<typeof EmailOptions.Type, 'to'>
	): Promise<ReadonlyArray<typeof EmailResult.Type>>

	/**
	 * Process pending emails in the queue.
	 */
	processQueue(): Promise<{ processed: number; failed: number }>

	/**
	 * Get queue statistics.
	 */
	getStats(): Promise<{ pending: number; failed: number }>

	/**
	 * Whether the email service is in development mode.
	 */
	readonly isDevMode: boolean
}

/**
 * Create an email client that uses the shared runtime.
 * Call this once in attach_services and attach to event.locals.
 */
export const createEmailClient = (): EmailClient => ({
	isDevMode,

	send: (options) =>
		emailRuntime.runPromise(
			Effect.gen(function* () {
				const service = yield* EmailService
				return yield* service.send(options)
			})
		),

	sendBatch: (recipients, options) =>
		emailRuntime.runPromise(
			Effect.gen(function* () {
				const service = yield* EmailService
				return yield* service.sendBatch(recipients, options)
			})
		),

	processQueue: () =>
		emailRuntime.runPromise(
			Effect.gen(function* () {
				const service = yield* EmailService
				return yield* service.processQueue()
			})
		),

	getStats: () =>
		emailRuntime.runPromise(
			Effect.gen(function* () {
				const service = yield* EmailService
				return yield* service.getStats()
			})
		)
})

/**
 * Dispose the email runtime (close LMDB, cleanup resources).
 * Call this during graceful shutdown.
 */
export const disposeEmailRuntime = () => emailRuntime.dispose()
