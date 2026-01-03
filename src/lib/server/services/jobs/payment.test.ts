import { describe, test, expect, beforeAll, beforeEach } from 'bun:test'
import { Database } from 'bun:sqlite'
import { PaymentService, type Payment } from './payment'
import { createTestDatabase } from '../../db/test-helpers'

describe('PaymentService', () => {
	let db: Database
	let paymentService: PaymentService
	let testTierId: string

	beforeAll(() => {
		db = createTestDatabase()
	})

	beforeEach(() => {
		// Clear payments table
		db.prepare('DELETE FROM payments').run()

		// Get a tier ID for testing
		const tier = db.prepare('SELECT id FROM job_tiers LIMIT 1').get() as { id: string }
		testTierId = tier.id

		paymentService = new PaymentService(db)
	})

	describe('createPayment', () => {
		test('should create a new payment record', () => {
			const paymentData = {
				employer_email: 'employer@test.com',
				stripe_checkout_session_id: 'cs_test_123',
				amount_cents: 19900,
				tier_id: testTierId
			}

			const paymentId = paymentService.createPayment(paymentData)

			expect(paymentId).toBeDefined()
			expect(typeof paymentId).toBe('string')
		})

		test('should create payment with pending status by default', () => {
			const paymentData = {
				employer_email: 'employer@test.com',
				stripe_checkout_session_id: 'cs_test_456',
				amount_cents: 39900,
				tier_id: testTierId
			}

			const paymentId = paymentService.createPayment(paymentData)
			const payment = paymentService.getPaymentById(paymentId)

			expect(payment?.status).toBe('pending')
		})

		test('should create payment with USD currency by default', () => {
			const paymentData = {
				employer_email: 'employer@test.com',
				stripe_checkout_session_id: 'cs_test_789',
				amount_cents: 59900,
				tier_id: testTierId
			}

			const paymentId = paymentService.createPayment(paymentData)
			const payment = paymentService.getPaymentById(paymentId)

			expect(payment?.currency).toBe('usd')
		})

		test('should create payment with null user_id by default', () => {
			const paymentData = {
				employer_email: 'employer@test.com',
				stripe_checkout_session_id: 'cs_test_user',
				amount_cents: 19900,
				tier_id: testTierId
			}

			const paymentId = paymentService.createPayment(paymentData)
			const payment = paymentService.getPaymentById(paymentId)

			// Companies post without accounts, so user_id is null
			expect(payment?.user_id).toBeNull()
		})

		test('should create payment with metadata', () => {
			const metadata = { company_name: 'Test Corp', job_title: 'Senior Developer' }
			const paymentData = {
				employer_email: 'employer@test.com',
				stripe_checkout_session_id: 'cs_test_meta',
				amount_cents: 19900,
				tier_id: testTierId,
				metadata
			}

			const paymentId = paymentService.createPayment(paymentData)
			const payment = paymentService.getPaymentById(paymentId)

			expect(payment?.metadata).toEqual(metadata)
		})
	})

	describe('getPaymentById', () => {
		test('should return payment by id', () => {
			const paymentId = paymentService.createPayment({
				employer_email: 'employer@test.com',
				stripe_checkout_session_id: 'cs_test_getbyid',
				amount_cents: 19900,
				tier_id: testTierId
			})

			const payment = paymentService.getPaymentById(paymentId)

			expect(payment).toBeDefined()
			expect(payment?.id).toBe(paymentId)
			expect(payment?.employer_email).toBe('employer@test.com')
		})

		test('should return null for non-existent id', () => {
			const payment = paymentService.getPaymentById('non-existent-id')

			expect(payment).toBeNull()
		})
	})

	describe('getPaymentBySessionId', () => {
		test('should return payment by Stripe checkout session ID', () => {
			const sessionId = 'cs_test_session_lookup'
			paymentService.createPayment({
				employer_email: 'employer@test.com',
				stripe_checkout_session_id: sessionId,
				amount_cents: 39900,
				tier_id: testTierId
			})

			const payment = paymentService.getPaymentBySessionId(sessionId)

			expect(payment).toBeDefined()
			expect(payment?.stripe_checkout_session_id).toBe(sessionId)
		})

		test('should return null for non-existent session ID', () => {
			const payment = paymentService.getPaymentBySessionId('non-existent-session')

			expect(payment).toBeNull()
		})
	})

	describe('updatePaymentStatus', () => {
		test('should update payment status to succeeded', () => {
			const paymentId = paymentService.createPayment({
				employer_email: 'employer@test.com',
				stripe_checkout_session_id: 'cs_test_status_update',
				amount_cents: 19900,
				tier_id: testTierId
			})

			paymentService.updatePaymentStatus(paymentId, 'succeeded')

			const payment = paymentService.getPaymentById(paymentId)
			expect(payment?.status).toBe('succeeded')
		})

		test('should update payment status to failed', () => {
			const paymentId = paymentService.createPayment({
				employer_email: 'employer@test.com',
				stripe_checkout_session_id: 'cs_test_failed',
				amount_cents: 19900,
				tier_id: testTierId
			})

			paymentService.updatePaymentStatus(paymentId, 'failed')

			const payment = paymentService.getPaymentById(paymentId)
			expect(payment?.status).toBe('failed')
		})

		test('should set completed_at when status is succeeded', () => {
			const paymentId = paymentService.createPayment({
				employer_email: 'employer@test.com',
				stripe_checkout_session_id: 'cs_test_completed_at',
				amount_cents: 19900,
				tier_id: testTierId
			})

			paymentService.updatePaymentStatus(paymentId, 'succeeded')

			const payment = paymentService.getPaymentById(paymentId)
			expect(payment?.completed_at).toBeDefined()
		})

		test('should not set completed_at when status is failed', () => {
			const paymentId = paymentService.createPayment({
				employer_email: 'employer@test.com',
				stripe_checkout_session_id: 'cs_test_not_completed',
				amount_cents: 19900,
				tier_id: testTierId
			})

			paymentService.updatePaymentStatus(paymentId, 'failed')

			const payment = paymentService.getPaymentById(paymentId)
			expect(payment?.completed_at).toBeNull()
		})
	})

	describe('linkPaymentToContent', () => {
		test('should link payment to content ID', () => {
			// First create a real content item to link to (FK constraint)
			const contentId = db
				.prepare(
					`INSERT INTO content (title, slug, type, status, description)
				 VALUES ('Test Job', 'test-job', 'job', 'draft', 'Test description')
				 RETURNING id`
				)
				.get() as { id: string }

			const paymentId = paymentService.createPayment({
				employer_email: 'employer@test.com',
				stripe_checkout_session_id: 'cs_test_link_content',
				amount_cents: 19900,
				tier_id: testTierId
			})

			paymentService.linkPaymentToContent(paymentId, contentId.id)

			const payment = paymentService.getPaymentById(paymentId)
			expect(payment?.content_id).toBe(contentId.id)
		})
	})

	describe('updatePaymentIntentId', () => {
		test('should update stripe payment intent ID', () => {
			const paymentId = paymentService.createPayment({
				employer_email: 'employer@test.com',
				stripe_checkout_session_id: 'cs_test_intent',
				amount_cents: 19900,
				tier_id: testTierId
			})

			const paymentIntentId = 'pi_test_123'
			paymentService.updatePaymentIntentId(paymentId, paymentIntentId)

			const payment = paymentService.getPaymentById(paymentId)
			expect(payment?.stripe_payment_intent_id).toBe(paymentIntentId)
		})
	})

	describe('getPaymentsByEmail', () => {
		test('should return all payments for an email', () => {
			const email = 'repeat@customer.com'

			// Create multiple payments
			paymentService.createPayment({
				employer_email: email,
				stripe_checkout_session_id: 'cs_test_email_1',
				amount_cents: 19900,
				tier_id: testTierId
			})
			paymentService.createPayment({
				employer_email: email,
				stripe_checkout_session_id: 'cs_test_email_2',
				amount_cents: 39900,
				tier_id: testTierId
			})
			paymentService.createPayment({
				employer_email: 'other@customer.com',
				stripe_checkout_session_id: 'cs_test_email_3',
				amount_cents: 59900,
				tier_id: testTierId
			})

			const payments = paymentService.getPaymentsByEmail(email)

			expect(payments.length).toBe(2)
			expect(payments.every((p) => p.employer_email === email)).toBe(true)
		})

		test('should return empty array for email with no payments', () => {
			const payments = paymentService.getPaymentsByEmail('no-payments@test.com')

			expect(payments).toEqual([])
		})

		test('should return payments ordered by created_at desc', () => {
			const email = 'ordered@customer.com'

			paymentService.createPayment({
				employer_email: email,
				stripe_checkout_session_id: 'cs_test_order_1',
				amount_cents: 19900,
				tier_id: testTierId
			})
			paymentService.createPayment({
				employer_email: email,
				stripe_checkout_session_id: 'cs_test_order_2',
				amount_cents: 39900,
				tier_id: testTierId
			})

			const payments = paymentService.getPaymentsByEmail(email)

			// Most recent should be first
			expect(payments[0].stripe_checkout_session_id).toBe('cs_test_order_2')
		})
	})

	describe('getRecentPayments', () => {
		test('should return recent payments with limit', () => {
			// Create 5 payments
			for (let i = 0; i < 5; i++) {
				paymentService.createPayment({
					employer_email: `employer${i}@test.com`,
					stripe_checkout_session_id: `cs_test_recent_${i}`,
					amount_cents: 19900,
					tier_id: testTierId
				})
			}

			const payments = paymentService.getRecentPayments(3)

			expect(payments.length).toBe(3)
		})

		test('should return payments ordered by created_at desc', () => {
			paymentService.createPayment({
				employer_email: 'first@test.com',
				stripe_checkout_session_id: 'cs_test_recent_first',
				amount_cents: 19900,
				tier_id: testTierId
			})
			paymentService.createPayment({
				employer_email: 'second@test.com',
				stripe_checkout_session_id: 'cs_test_recent_second',
				amount_cents: 39900,
				tier_id: testTierId
			})

			const payments = paymentService.getRecentPayments(10)

			expect(payments[0].employer_email).toBe('second@test.com')
		})
	})
})
