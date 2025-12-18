import { describe, test, expect, beforeEach, afterEach } from 'bun:test'
import { EmailQueue, type NewEmail } from './queue'
import { rmSync, mkdirSync } from 'fs'

describe('EmailQueue', () => {
	let queue: EmailQueue
	const testDbPath = '.data/test-email-queue'

	const sampleEmail: NewEmail = {
		to: ['test@example.com'],
		subject: 'Test Subject',
		html: '<p>Test HTML</p>',
		text: 'Test text',
		from: 'sender@example.com'
	}

	beforeEach(() => {
		// Ensure clean state
		rmSync(testDbPath, { recursive: true, force: true })
		mkdirSync(testDbPath, { recursive: true })
		queue = new EmailQueue(testDbPath)
	})

	afterEach(() => {
		queue.close()
		rmSync(testDbPath, { recursive: true, force: true })
	})

	describe('add', () => {
		test('adds email to queue with pending status', () => {
			const id = queue.add(sampleEmail)
			const email = queue.get(id)

			expect(email).toBeDefined()
			expect(email?.status).toBe('pending')
		})

		test('generates unique id', () => {
			const id1 = queue.add(sampleEmail)
			const id2 = queue.add(sampleEmail)

			expect(id1).toBeDefined()
			expect(id2).toBeDefined()
			expect(id1).not.toBe(id2)
		})

		test('sets createdAt timestamp', () => {
			const beforeAdd = Date.now()
			const id = queue.add(sampleEmail)
			const afterAdd = Date.now()

			const email = queue.get(id)

			expect(email?.createdAt).toBeGreaterThanOrEqual(beforeAdd)
			expect(email?.createdAt).toBeLessThanOrEqual(afterAdd)
		})

		test('initializes retryCount to 0', () => {
			const id = queue.add(sampleEmail)
			const email = queue.get(id)

			expect(email?.retryCount).toBe(0)
		})

		test('preserves all email fields', () => {
			const emailWithReplyTo: NewEmail = {
				...sampleEmail,
				replyTo: 'reply@example.com'
			}
			const id = queue.add(emailWithReplyTo)
			const email = queue.get(id)

			expect(email?.to).toEqual(['test@example.com'])
			expect(email?.subject).toBe('Test Subject')
			expect(email?.html).toBe('<p>Test HTML</p>')
			expect(email?.text).toBe('Test text')
			expect(email?.from).toBe('sender@example.com')
			expect(email?.replyTo).toBe('reply@example.com')
		})
	})

	describe('get', () => {
		test('returns email by id', () => {
			const id = queue.add(sampleEmail)
			const email = queue.get(id)

			expect(email).toBeDefined()
			expect(email?.id).toBe(id)
		})

		test('returns undefined for non-existent id', () => {
			const email = queue.get('non-existent-id')

			expect(email).toBeUndefined()
		})
	})

	describe('getPending', () => {
		test('returns all pending emails', () => {
			queue.add(sampleEmail)
			queue.add(sampleEmail)
			queue.add(sampleEmail)

			const pending = queue.getPending()

			expect(pending.length).toBe(3)
			expect(pending.every((e) => e.status === 'pending')).toBe(true)
		})

		test('respects limit parameter', () => {
			queue.add(sampleEmail)
			queue.add(sampleEmail)
			queue.add(sampleEmail)

			const pending = queue.getPending(2)

			expect(pending.length).toBe(2)
		})

		test('orders by createdAt (FIFO)', async () => {
			const id1 = queue.add({ ...sampleEmail, subject: 'First' })
			// Small delay to ensure different timestamps
			await new Promise((r) => setTimeout(r, 10))
			const id2 = queue.add({ ...sampleEmail, subject: 'Second' })
			await new Promise((r) => setTimeout(r, 10))
			const id3 = queue.add({ ...sampleEmail, subject: 'Third' })

			const pending = queue.getPending()

			expect(pending[0].id).toBe(id1)
			expect(pending[1].id).toBe(id2)
			expect(pending[2].id).toBe(id3)
		})

		test('excludes non-pending emails', () => {
			const id1 = queue.add(sampleEmail)
			const id2 = queue.add(sampleEmail)

			queue.markProcessing(id1)
			queue.markFailed(id2, 'error')

			const pending = queue.getPending()

			expect(pending.length).toBe(0)
		})
	})

	describe('getFailed', () => {
		test('returns all failed emails', () => {
			const id1 = queue.add(sampleEmail)
			const id2 = queue.add(sampleEmail)

			queue.markFailed(id1, 'error 1')
			queue.markFailed(id2, 'error 2')

			const failed = queue.getFailed()

			expect(failed.length).toBe(2)
			expect(failed.every((e) => e.status === 'failed')).toBe(true)
		})

		test('excludes pending and processing emails', () => {
			const id1 = queue.add(sampleEmail)
			const id2 = queue.add(sampleEmail)
			const id3 = queue.add(sampleEmail)

			queue.markProcessing(id2)
			queue.markFailed(id3, 'error')

			const failed = queue.getFailed()

			expect(failed.length).toBe(1)
			expect(failed[0].id).toBe(id3)
		})
	})

	describe('getRetryable', () => {
		test('returns failed emails past nextRetryAt', async () => {
			const id = queue.add(sampleEmail)
			queue.markFailed(id, 'error')

			// Wait for backoff period to pass (1s for first retry)
			await new Promise((r) => setTimeout(r, 1100))

			const retryable = queue.getRetryable()

			expect(retryable.length).toBe(1)
			expect(retryable[0].id).toBe(id)
		})

		test('excludes emails not yet ready for retry', () => {
			const id = queue.add(sampleEmail)
			queue.markFailed(id, 'error')

			// Check immediately - should not be retryable yet
			const retryable = queue.getRetryable()

			expect(retryable.length).toBe(0)
		})
	})

	describe('markProcessing', () => {
		test('updates status to processing', () => {
			const id = queue.add(sampleEmail)
			queue.markProcessing(id)

			const email = queue.get(id)

			expect(email?.status).toBe('processing')
		})

		test('preserves other fields', () => {
			const id = queue.add(sampleEmail)
			const originalEmail = queue.get(id)
			queue.markProcessing(id)

			const email = queue.get(id)

			expect(email?.createdAt).toBe(originalEmail?.createdAt)
			expect(email?.retryCount).toBe(originalEmail?.retryCount)
			expect(email?.subject).toBe(originalEmail?.subject)
		})
	})

	describe('markComplete', () => {
		test('removes email from queue', () => {
			const id = queue.add(sampleEmail)
			queue.markComplete(id)

			const email = queue.get(id)

			expect(email).toBeUndefined()
		})
	})

	describe('markFailed', () => {
		test('updates status to failed', () => {
			const id = queue.add(sampleEmail)
			queue.markFailed(id, 'test error')

			const email = queue.get(id)

			expect(email?.status).toBe('failed')
		})

		test('increments retryCount', () => {
			const id = queue.add(sampleEmail)

			queue.markFailed(id, 'error 1')
			expect(queue.get(id)?.retryCount).toBe(1)

			queue.markFailed(id, 'error 2')
			expect(queue.get(id)?.retryCount).toBe(2)

			queue.markFailed(id, 'error 3')
			expect(queue.get(id)?.retryCount).toBe(3)
		})

		test('stores lastError', () => {
			const id = queue.add(sampleEmail)
			queue.markFailed(id, 'Specific error message')

			const email = queue.get(id)

			expect(email?.lastError).toBe('Specific error message')
		})

		test('calculates nextRetryAt with exponential backoff', () => {
			const id = queue.add(sampleEmail)
			const beforeFail = Date.now()

			// First failure: 1s backoff (2^0 * 1000)
			queue.markFailed(id, 'error')
			const afterFirstFail = Date.now()
			let email = queue.get(id)

			expect(email?.nextRetryAt).toBeGreaterThanOrEqual(beforeFail + 1000)
			expect(email?.nextRetryAt).toBeLessThanOrEqual(afterFirstFail + 1000)

			// Second failure: 2s backoff (2^1 * 1000)
			const beforeSecondFail = Date.now()
			queue.markFailed(id, 'error')
			const afterSecondFail = Date.now()
			email = queue.get(id)

			expect(email?.nextRetryAt).toBeGreaterThanOrEqual(beforeSecondFail + 2000)
			expect(email?.nextRetryAt).toBeLessThanOrEqual(afterSecondFail + 2000)

			// Third failure: 4s backoff (2^2 * 1000)
			const beforeThirdFail = Date.now()
			queue.markFailed(id, 'error')
			const afterThirdFail = Date.now()
			email = queue.get(id)

			expect(email?.nextRetryAt).toBeGreaterThanOrEqual(beforeThirdFail + 4000)
			expect(email?.nextRetryAt).toBeLessThanOrEqual(afterThirdFail + 4000)
		})
	})
})
