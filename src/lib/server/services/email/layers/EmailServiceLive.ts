import { Config, Duration, Effect, Layer, Schedule, pipe } from 'effect'
import { EmailOptions, EmailResult, EmailSendError, EmailQueueError, QueuedEmail } from '../schemas'
import { EmailQueueService } from '../services/EmailQueue'
import { SesClientService } from '../services/SesClient'
import { EmailService } from '../services/EmailService'

/**
 * Email service layer that reads config from ConfigProvider.
 * In production, uses environment variables via default ConfigProvider.
 * In tests, provide a custom ConfigProvider via Layer.setConfigProvider.
 */
export const EmailServiceLive = Layer.effect(
	EmailService,
	Effect.gen(function* () {
		const queue = yield* EmailQueueService
		const ses = yield* SesClientService

		// Read config from ConfigProvider
		const fromEmail = yield* Config.string('AWS_SES_FROM_EMAIL')
		const rateLimitMs = yield* Config.number('AWS_SES_RATE_LIMIT_MS').pipe(Config.withDefault(100))
		const maxBatchSize = yield* Config.number('AWS_SES_MAX_BATCH_SIZE').pipe(Config.withDefault(50))
		const maxRetries = yield* Config.number('AWS_SES_MAX_RETRIES').pipe(Config.withDefault(3))

		// Create retry schedule: exponential backoff (1s, 2s, 4s, ...) with max retries
		const retrySchedule = pipe(
			Schedule.exponential(Duration.seconds(1)),
			Schedule.intersect(Schedule.recurs(maxRetries))
		)

		// Raw SES send (no retry)
		const sendViaSES = (email: typeof QueuedEmail.Type) =>
			ses.sendEmail({
				to: email.to,
				subject: email.subject,
				html: email.html,
				text: email.text,
				from: email.from,
				replyTo: email.replyTo
			})

		// Send with automatic retries using Effect's Schedule
		const sendWithRetry = (email: typeof QueuedEmail.Type) =>
			pipe(sendViaSES(email), Effect.retry(retrySchedule))

		// Internal send: queue -> process -> retry automatically -> complete or fail
		const sendInternal = (
			options: typeof EmailOptions.Type
		): Effect.Effect<typeof EmailResult.Type, EmailSendError | EmailQueueError> =>
			Effect.gen(function* () {
				const toAddresses = Array.isArray(options.to) ? options.to : [options.to]

				const queueId = yield* queue.add({
					to: toAddresses,
					subject: options.subject,
					html: options.html,
					text: options.text,
					from: options.from ?? fromEmail,
					replyTo: options.replyTo
				})

				const email = yield* queue.get(queueId)
				if (!email) {
					return new EmailResult({
						success: false,
						error: 'Failed to retrieve queued email',
						queueId
					})
				}

				yield* queue.markProcessing(queueId)

				// Effect handles all retries automatically
				const result = yield* pipe(
					sendWithRetry(email),
					Effect.map((messageId) => ({ success: true as const, messageId })),
					Effect.catchAll((err: EmailSendError) =>
						Effect.succeed({ success: false as const, error: err.message })
					)
				)

				if (result.success) {
					yield* queue.markComplete(queueId)
					return new EmailResult({ success: true, messageId: result.messageId, queueId })
				} else {
					yield* queue.markFailed(queueId, result.error)
					return new EmailResult({ success: false, error: result.error, queueId })
				}
			})

		return {
			send: sendInternal,

			sendBatch: (recipients, options) =>
				Effect.gen(function* () {
					const limited = recipients.slice(0, maxBatchSize)
					const results: Array<typeof EmailResult.Type> = []

					for (let i = 0; i < limited.length; i++) {
						if (i > 0) yield* Effect.sleep(`${rateLimitMs} millis`)
						results.push(yield* sendInternal({ ...options, to: limited[i] }))
					}

					return results
				}),

			processQueue: () =>
				Effect.gen(function* () {
					const pending = yield* queue.getPending()
					let processed = 0
					let failed = 0

					for (let i = 0; i < pending.length; i++) {
						const email = pending[i]
						if (i > 0) yield* Effect.sleep(`${rateLimitMs} millis`)

						yield* queue.markProcessing(email.id)

						const success = yield* pipe(
							sendWithRetry(email),
							Effect.map(() => true),
							Effect.catchAll(() => Effect.succeed(false))
						)

						if (success) {
							yield* queue.markComplete(email.id)
							processed++
						} else {
							yield* queue.markFailed(email.id, 'Send failed after retries')
							failed++
						}
					}

					return { processed, failed }
				}),

			getStats: () => queue.count()
		}
	})
)
