import { describe, expect, test } from 'bun:test'
import { Effect, Layer, Ref } from 'effect'
import {
	EmailService,
	EmailQueueService,
	EmailQueueLive,
	KeyValueStoreTest,
	SesClientTest,
	makeSesClientTest,
	makeSesClientFailing,
	EmailServiceLive,
	TestConfigLayer,
	makeTestConfigProvider,
	testConfig,
	type RecordedEmail
} from './index'

describe('EmailService', () => {
	// Base test layer with all mocks and default test config
	const makeTestLayer = (configOverrides?: Parameters<typeof makeTestConfigProvider>[0]) =>
		EmailServiceLive.pipe(
			Layer.provide(SesClientTest),
			Layer.provide(EmailQueueLive),
			Layer.provide(KeyValueStoreTest),
			Layer.provide(
				configOverrides
					? Layer.setConfigProvider(makeTestConfigProvider(configOverrides))
					: TestConfigLayer
			)
		)

	const runWithService = <A, E>(effect: Effect.Effect<A, E, EmailService>) =>
		Effect.runPromise(effect.pipe(Effect.provide(makeTestLayer())))

	describe('send', () => {
		test('sends email successfully', async () => {
			const result = await runWithService(
				Effect.gen(function* () {
					const service = yield* EmailService
					return yield* service.send({
						to: 'user@example.com',
						subject: 'Test',
						html: '<p>Hello</p>',
						text: 'Hello'
					})
				})
			)

			expect(result.success).toBe(true)
			expect(result.messageId).toBeDefined()
			expect(result.queueId).toBeDefined()
		})

		test('sends email with array recipients', async () => {
			const result = await runWithService(
				Effect.gen(function* () {
					const service = yield* EmailService
					return yield* service.send({
						to: ['user1@example.com', 'user2@example.com'],
						subject: 'Test',
						html: '<p>Hello</p>',
						text: 'Hello'
					})
				})
			)

			expect(result.success).toBe(true)
		})

		test('uses default from address from config', async () => {
			const ref = Ref.unsafeMake<RecordedEmail[]>([])

			const layer = EmailServiceLive.pipe(
				Layer.provide(makeSesClientTest(ref)),
				Layer.provide(EmailQueueLive),
				Layer.provide(KeyValueStoreTest),
				Layer.provide(TestConfigLayer)
			)

			await Effect.runPromise(
				Effect.gen(function* () {
					const service = yield* EmailService
					yield* service.send({
						to: 'user@example.com',
						subject: 'Test',
						html: '<p>Hello</p>',
						text: 'Hello'
					})
				}).pipe(Effect.provide(layer))
			)

			const sent = Ref.get(ref).pipe(Effect.runSync)
			expect(sent[0].from).toBe(testConfig.fromEmail)
		})

		test('allows overriding from address', async () => {
			const ref = Ref.unsafeMake<RecordedEmail[]>([])

			const layer = EmailServiceLive.pipe(
				Layer.provide(makeSesClientTest(ref)),
				Layer.provide(EmailQueueLive),
				Layer.provide(KeyValueStoreTest),
				Layer.provide(TestConfigLayer)
			)

			await Effect.runPromise(
				Effect.gen(function* () {
					const service = yield* EmailService
					yield* service.send({
						to: 'user@example.com',
						subject: 'Test',
						html: '<p>Hello</p>',
						text: 'Hello',
						from: 'custom@example.com'
					})
				}).pipe(Effect.provide(layer))
			)

			const sent = Ref.get(ref).pipe(Effect.runSync)
			expect(sent[0].from).toBe('custom@example.com')
		})

		test('records email correctly with makeSesClientTest', async () => {
			const ref = Ref.unsafeMake<RecordedEmail[]>([])

			const layer = EmailServiceLive.pipe(
				Layer.provide(makeSesClientTest(ref)),
				Layer.provide(EmailQueueLive),
				Layer.provide(KeyValueStoreTest),
				Layer.provide(TestConfigLayer)
			)

			await Effect.runPromise(
				Effect.gen(function* () {
					const service = yield* EmailService
					yield* service.send({
						to: 'user@example.com',
						subject: 'Important Message',
						html: '<p>Hello World</p>',
						text: 'Hello World',
						replyTo: 'reply@example.com'
					})
				}).pipe(Effect.provide(layer))
			)

			const sent = Ref.get(ref).pipe(Effect.runSync)
			expect(sent).toHaveLength(1)
			expect(sent[0].to).toContain('user@example.com')
			expect(sent[0].subject).toBe('Important Message')
			expect(sent[0].html).toBe('<p>Hello World</p>')
			expect(sent[0].text).toBe('Hello World')
			expect(sent[0].replyTo).toBe('reply@example.com')
		})

		test('returns failure when SES fails', async () => {
			const layer = EmailServiceLive.pipe(
				Layer.provide(makeSesClientFailing('SES rate limit exceeded')),
				Layer.provide(EmailQueueLive),
				Layer.provide(KeyValueStoreTest),
				Layer.provide(Layer.setConfigProvider(makeTestConfigProvider({ maxRetries: 0 })))
			)

			const result = await Effect.runPromise(
				Effect.gen(function* () {
					const service = yield* EmailService
					return yield* service.send({
						to: 'user@example.com',
						subject: 'Test',
						html: '<p>Hello</p>',
						text: 'Hello'
					})
				}).pipe(Effect.provide(layer))
			)

			expect(result.success).toBe(false)
			expect(result.error).toBe('SES rate limit exceeded')
		})
	})

	describe('sendBatch', () => {
		test('sends to multiple recipients', async () => {
			const ref = Ref.unsafeMake<RecordedEmail[]>([])

			const layer = EmailServiceLive.pipe(
				Layer.provide(makeSesClientTest(ref)),
				Layer.provide(EmailQueueLive),
				Layer.provide(KeyValueStoreTest),
				Layer.provide(TestConfigLayer)
			)

			const results = await Effect.runPromise(
				Effect.gen(function* () {
					const service = yield* EmailService
					return yield* service.sendBatch(
						['user1@example.com', 'user2@example.com', 'user3@example.com'],
						{
							subject: 'Batch Email',
							html: '<p>Hello</p>',
							text: 'Hello'
						}
					)
				}).pipe(Effect.provide(layer))
			)

			expect(results).toHaveLength(3)
			expect(results.every((r) => r.success)).toBe(true)

			const sent = Ref.get(ref).pipe(Effect.runSync)
			expect(sent).toHaveLength(3)
			expect(sent.map((e) => e.to[0]).sort()).toEqual([
				'user1@example.com',
				'user2@example.com',
				'user3@example.com'
			])
		})

		test('respects maxBatchSize limit', async () => {
			const ref = Ref.unsafeMake<RecordedEmail[]>([])

			const layer = EmailServiceLive.pipe(
				Layer.provide(makeSesClientTest(ref)),
				Layer.provide(EmailQueueLive),
				Layer.provide(KeyValueStoreTest),
				Layer.provide(Layer.setConfigProvider(makeTestConfigProvider({ maxBatchSize: 2 })))
			)

			const results = await Effect.runPromise(
				Effect.gen(function* () {
					const service = yield* EmailService
					return yield* service.sendBatch(
						['user1@example.com', 'user2@example.com', 'user3@example.com', 'user4@example.com'],
						{
							subject: 'Batch Email',
							html: '<p>Hello</p>',
							text: 'Hello'
						}
					)
				}).pipe(Effect.provide(layer))
			)

			// Should only send to first 2
			expect(results).toHaveLength(2)

			const sent = Ref.get(ref).pipe(Effect.runSync)
			expect(sent).toHaveLength(2)
		})

		test('handles partial failures', async () => {
			const ref = Ref.unsafeMake<RecordedEmail[]>([])

			// Fail after 2 successful sends
			const layer = EmailServiceLive.pipe(
				Layer.provide(makeSesClientTest(ref, { failAfter: 2 })),
				Layer.provide(EmailQueueLive),
				Layer.provide(KeyValueStoreTest),
				Layer.provide(Layer.setConfigProvider(makeTestConfigProvider({ maxRetries: 0 })))
			)

			const results = await Effect.runPromise(
				Effect.gen(function* () {
					const service = yield* EmailService
					return yield* service.sendBatch(
						['user1@example.com', 'user2@example.com', 'user3@example.com'],
						{
							subject: 'Batch Email',
							html: '<p>Hello</p>',
							text: 'Hello'
						}
					)
				}).pipe(Effect.provide(layer))
			)

			expect(results).toHaveLength(3)
			expect(results[0].success).toBe(true)
			expect(results[1].success).toBe(true)
			expect(results[2].success).toBe(false)
		})
	})

	describe('processQueue', () => {
		test('processes pending emails', async () => {
			const ref = Ref.unsafeMake<RecordedEmail[]>([])

			const layer = EmailServiceLive.pipe(
				Layer.provide(makeSesClientTest(ref)),
				Layer.provide(EmailQueueLive),
				Layer.provide(KeyValueStoreTest),
				Layer.provide(TestConfigLayer)
			)

			const result = await Effect.runPromise(
				Effect.gen(function* () {
					const queue = yield* EmailQueueService
					const service = yield* EmailService

					// Manually add emails to queue without sending
					yield* queue.add({
						to: ['user1@example.com'],
						subject: 'Queued 1',
						html: '<p>1</p>',
						text: '1',
						from: 'sender@example.com'
					})
					yield* queue.add({
						to: ['user2@example.com'],
						subject: 'Queued 2',
						html: '<p>2</p>',
						text: '2',
						from: 'sender@example.com'
					})

					return yield* service.processQueue()
				}).pipe(
					Effect.provide(
						layer.pipe(Layer.provideMerge(EmailQueueLive.pipe(Layer.provide(KeyValueStoreTest))))
					)
				)
			)

			expect(result.processed).toBe(2)
			expect(result.failed).toBe(0)
		})

		test('returns zeros for empty queue', async () => {
			const result = await runWithService(
				Effect.gen(function* () {
					const service = yield* EmailService
					return yield* service.processQueue()
				})
			)

			expect(result.processed).toBe(0)
			expect(result.failed).toBe(0)
		})
	})

	describe('getStats', () => {
		test('returns queue statistics', async () => {
			const layer = EmailServiceLive.pipe(
				Layer.provide(makeSesClientFailing('Always fails')),
				Layer.provide(EmailQueueLive),
				Layer.provide(KeyValueStoreTest),
				Layer.provide(Layer.setConfigProvider(makeTestConfigProvider({ maxRetries: 0 })))
			)

			const result = await Effect.runPromise(
				Effect.gen(function* () {
					const service = yield* EmailService
					const queue = yield* EmailQueueService

					// Add some emails directly to queue
					yield* queue.add({
						to: ['pending@example.com'],
						subject: 'Pending',
						html: '<p>Pending</p>',
						text: 'Pending',
						from: 'sender@example.com'
					})

					// Send one (will fail)
					yield* service.send({
						to: 'failed@example.com',
						subject: 'Will Fail',
						html: '<p>Fail</p>',
						text: 'Fail'
					})

					return yield* service.getStats()
				}).pipe(
					Effect.provide(
						layer.pipe(Layer.provideMerge(EmailQueueLive.pipe(Layer.provide(KeyValueStoreTest))))
					)
				)
			)

			expect(result.pending).toBe(1)
			expect(result.failed).toBe(1)
		})
	})

	describe('retry behavior', () => {
		test('retries on failure with exponential backoff', async () => {
			let attemptCount = 0

			// Custom SES that fails first 2 times, succeeds on 3rd
			const { SesClientService } = await import('./services/SesClient')
			const { EmailSendError } = await import('./schemas')

			const customSes = Layer.effect(
				SesClientService,
				Effect.succeed({
					sendEmail: (params: {
						readonly to: ReadonlyArray<string>
						readonly subject: string
						readonly html: string
						readonly text: string
						readonly from: string
						readonly replyTo?: string
					}) =>
						Effect.gen(function* () {
							attemptCount++
							if (attemptCount < 3) {
								return yield* Effect.fail(
									new EmailSendError({
										message: `Attempt ${attemptCount} failed`
									})
								)
							}
							return 'success-after-retries'
						})
				})
			)

			const layer = EmailServiceLive.pipe(
				Layer.provide(customSes),
				Layer.provide(EmailQueueLive),
				Layer.provide(KeyValueStoreTest),
				Layer.provide(Layer.setConfigProvider(makeTestConfigProvider({ maxRetries: 3 })))
			)

			const result = await Effect.runPromise(
				Effect.gen(function* () {
					const service = yield* EmailService
					return yield* service.send({
						to: 'user@example.com',
						subject: 'Test',
						html: '<p>Hello</p>',
						text: 'Hello'
					})
				}).pipe(Effect.provide(layer))
			)

			expect(result.success).toBe(true)
			expect(attemptCount).toBe(3)
		})
	})
})
