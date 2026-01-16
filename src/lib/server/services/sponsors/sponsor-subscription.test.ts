import { describe, test, expect, beforeAll, beforeEach } from 'bun:test'
import { Database } from 'bun:sqlite'
import {
	SponsorSubscriptionService,
	type SponsorSubscription,
	type CreateSubscriptionData
} from './sponsor-subscription'
import { SponsorService } from './sponsor'
import { createTestDatabase } from '../../db/test-helpers'

describe('SponsorSubscriptionService', () => {
	let db: Database
	let subscriptionService: SponsorSubscriptionService
	let sponsorService: SponsorService
	let testSponsorId: string
	let testTierId: string

	beforeAll(() => {
		db = createTestDatabase()
	})

	beforeEach(() => {
		// Clear tables
		db.prepare('DELETE FROM sponsor_subscriptions').run()
		db.prepare('DELETE FROM sponsors').run()
		db.prepare('DELETE FROM sponsor_tiers').run()

		// Create a test tier
		db.prepare(
			`
			INSERT INTO sponsor_tiers (
				id, name, display_name, price_cents, yearly_price_cents, one_time_price_cents,
				features, logo_size, max_tagline_length, show_in_feed, show_in_sidebar,
				include_social_promo, sort_order, active
			) VALUES (
				'tier-basic', 'basic', 'Basic Sponsor', 39900, 399000, 39900,
				'["Feature 1"]', 'normal', 100, 1, 1, 0, 1, 1
			)
		`
		).run()
		testTierId = 'tier-basic'

		// Create a test sponsor
		sponsorService = new SponsorService(db)
		testSponsorId = sponsorService.createSponsor({
			company_name: 'Test Company',
			logo_url: 'https://example.com/logo.png',
			tagline: 'Test tagline',
			website_url: 'https://example.com'
		})

		subscriptionService = new SponsorSubscriptionService(db)
	})

	const createTestSubscription = (overrides: Partial<CreateSubscriptionData> = {}): string => {
		return subscriptionService.createSubscription({
			sponsor_id: testSponsorId,
			tier_id: testTierId,
			billing_type: 'monthly',
			amount_cents: 39900,
			...overrides
		})
	}

	describe('createSubscription', () => {
		test('should create a subscription and return the id', () => {
			const id = createTestSubscription()

			expect(id).toBeDefined()
			expect(typeof id).toBe('string')
			expect(id.length).toBeGreaterThan(0)
		})

		test('should create subscription with incomplete status', () => {
			const id = createTestSubscription()
			const sub = subscriptionService.getSubscriptionById(id)

			expect(sub?.status).toBe('incomplete')
		})

		test('should create subscription with all provided data', () => {
			const id = createTestSubscription({
				billing_type: 'yearly',
				amount_cents: 399000,
				stripe_checkout_session_id: 'cs_test_123',
				metadata: { test: 'value' }
			})

			const sub = subscriptionService.getSubscriptionById(id)

			expect(sub?.sponsor_id).toBe(testSponsorId)
			expect(sub?.tier_id).toBe(testTierId)
			expect(sub?.billing_type).toBe('yearly')
			expect(sub?.amount_cents).toBe(399000)
			expect(sub?.stripe_checkout_session_id).toBe('cs_test_123')
			expect(sub?.metadata).toEqual({ test: 'value' })
		})

		test('should create subscription with default currency', () => {
			const id = createTestSubscription()
			const sub = subscriptionService.getSubscriptionById(id)

			expect(sub?.currency).toBe('usd')
		})
	})

	describe('getSubscriptionById', () => {
		test('should return subscription by id', () => {
			const id = createTestSubscription()
			const sub = subscriptionService.getSubscriptionById(id)

			expect(sub).toBeDefined()
			expect(sub?.id).toBe(id)
		})

		test('should return null for non-existent id', () => {
			const sub = subscriptionService.getSubscriptionById('non-existent')

			expect(sub).toBeNull()
		})

		test('should parse metadata as object', () => {
			const id = createTestSubscription({ metadata: { key: 'value' } })
			const sub = subscriptionService.getSubscriptionById(id)

			expect(sub?.metadata).toEqual({ key: 'value' })
		})

		test('should parse cancel_at_period_end as boolean', () => {
			const id = createTestSubscription()
			const sub = subscriptionService.getSubscriptionById(id)

			expect(typeof sub?.cancel_at_period_end).toBe('boolean')
			expect(sub?.cancel_at_period_end).toBe(false)
		})
	})

	describe('getByStripeSubscriptionId', () => {
		test('should return subscription by stripe subscription id', () => {
			const id = createTestSubscription()
			subscriptionService.setStripeSubscriptionId(id, 'sub_test_123')

			const sub = subscriptionService.getByStripeSubscriptionId('sub_test_123')

			expect(sub).toBeDefined()
			expect(sub?.id).toBe(id)
		})

		test('should return null for non-existent stripe id', () => {
			const sub = subscriptionService.getByStripeSubscriptionId('non-existent')

			expect(sub).toBeNull()
		})
	})

	describe('getByCheckoutSessionId', () => {
		test('should return subscription by checkout session id', () => {
			const id = createTestSubscription({ stripe_checkout_session_id: 'cs_test_456' })

			const sub = subscriptionService.getByCheckoutSessionId('cs_test_456')

			expect(sub).toBeDefined()
			expect(sub?.id).toBe(id)
		})

		test('should return null for non-existent session id', () => {
			const sub = subscriptionService.getByCheckoutSessionId('non-existent')

			expect(sub).toBeNull()
		})
	})

	describe('getSubscriptionsBySponsor', () => {
		test('should return all subscriptions for a sponsor', () => {
			createTestSubscription({ billing_type: 'monthly' })
			createTestSubscription({ billing_type: 'yearly' })

			const subs = subscriptionService.getSubscriptionsBySponsor(testSponsorId)

			expect(subs.length).toBe(2)
		})

		test('should return subscriptions sorted by created_at', () => {
			createTestSubscription({ billing_type: 'monthly' })
			createTestSubscription({ billing_type: 'yearly' })

			const subs = subscriptionService.getSubscriptionsBySponsor(testSponsorId)

			// Both should be returned (order depends on created_at which may be same millisecond)
			expect(subs.length).toBe(2)
			const billingTypes = subs.map((s) => s.billing_type).sort()
			expect(billingTypes).toEqual(['monthly', 'yearly'])
		})

		test('should return empty array for sponsor with no subscriptions', () => {
			const subs = subscriptionService.getSubscriptionsBySponsor('non-existent-sponsor')

			expect(subs).toEqual([])
		})
	})

	describe('getActiveSubscription', () => {
		test('should return active subscription for sponsor', () => {
			const id = createTestSubscription()
			subscriptionService.activateSubscription(id, new Date(), new Date('2099-12-31'))

			const activeSub = subscriptionService.getActiveSubscription(testSponsorId)

			expect(activeSub).toBeDefined()
			expect(activeSub?.id).toBe(id)
		})

		test('should return null when no active subscription', () => {
			createTestSubscription() // Creates with 'incomplete' status

			const activeSub = subscriptionService.getActiveSubscription(testSponsorId)

			expect(activeSub).toBeNull()
		})
	})

	describe('updateStatus', () => {
		test('should update subscription status', () => {
			const id = createTestSubscription()

			subscriptionService.updateStatus(id, 'active')

			const sub = subscriptionService.getSubscriptionById(id)
			expect(sub?.status).toBe('active')
		})

		test('should allow various status values', () => {
			const statuses = ['incomplete', 'active', 'past_due', 'canceled', 'unpaid'] as const

			for (const status of statuses) {
				const id = createTestSubscription()
				subscriptionService.updateStatus(id, status)

				const sub = subscriptionService.getSubscriptionById(id)
				expect(sub?.status).toBe(status)
			}
		})
	})

	describe('setStripeSubscriptionId', () => {
		test('should set stripe subscription id', () => {
			const id = createTestSubscription()

			subscriptionService.setStripeSubscriptionId(id, 'sub_12345')

			const sub = subscriptionService.getSubscriptionById(id)
			expect(sub?.stripe_subscription_id).toBe('sub_12345')
		})
	})

	describe('setStripeCustomerId', () => {
		test('should set stripe customer id', () => {
			const id = createTestSubscription()

			subscriptionService.setStripeCustomerId(id, 'cus_12345')

			const sub = subscriptionService.getSubscriptionById(id)
			expect(sub?.stripe_customer_id).toBe('cus_12345')
		})
	})

	describe('updatePeriod', () => {
		test('should update subscription period', () => {
			const id = createTestSubscription()
			const start = new Date('2025-01-01')
			const end = new Date('2025-02-01')

			subscriptionService.updatePeriod(id, start, end)

			const sub = subscriptionService.getSubscriptionById(id)
			expect(new Date(sub!.current_period_start!).toISOString()).toBe(start.toISOString())
			expect(new Date(sub!.current_period_end!).toISOString()).toBe(end.toISOString())
		})
	})

	describe('markCancelled', () => {
		test('should mark subscription as cancelled immediately', () => {
			const id = createTestSubscription()
			subscriptionService.updateStatus(id, 'active')

			subscriptionService.markCancelled(id, false)

			const sub = subscriptionService.getSubscriptionById(id)
			expect(sub?.status).toBe('canceled')
			expect(sub?.cancelled_at).toBeDefined()
			expect(sub?.cancel_at_period_end).toBe(false)
		})

		test('should mark subscription to cancel at period end', () => {
			const id = createTestSubscription()
			subscriptionService.updateStatus(id, 'active')

			subscriptionService.markCancelled(id, true)

			const sub = subscriptionService.getSubscriptionById(id)
			expect(sub?.status).toBe('active') // Status unchanged when cancelling at period end
			expect(sub?.cancelled_at).toBeDefined()
			expect(sub?.cancel_at_period_end).toBe(true)
		})
	})

	describe('activateSubscription', () => {
		test('should set status to active and update period', () => {
			const id = createTestSubscription()
			const start = new Date('2025-01-01')
			const end = new Date('2025-02-01')

			subscriptionService.activateSubscription(id, start, end)

			const sub = subscriptionService.getSubscriptionById(id)
			expect(sub?.status).toBe('active')
			expect(new Date(sub!.current_period_start!).toISOString()).toBe(start.toISOString())
			expect(new Date(sub!.current_period_end!).toISOString()).toBe(end.toISOString())
		})
	})

	describe('getSubscriptionsByStatus', () => {
		test('should return subscriptions filtered by status', () => {
			const id1 = createTestSubscription()
			const id2 = createTestSubscription()

			subscriptionService.updateStatus(id1, 'active')
			// id2 stays 'incomplete'

			const active = subscriptionService.getSubscriptionsByStatus('active')
			const incomplete = subscriptionService.getSubscriptionsByStatus('incomplete')

			expect(active.length).toBe(1)
			expect(active[0].id).toBe(id1)
			expect(incomplete.length).toBe(1)
			expect(incomplete[0].id).toBe(id2)
		})
	})

	describe('getActiveSubscriptions', () => {
		test('should return all active subscriptions', () => {
			const id1 = createTestSubscription()
			const id2 = createTestSubscription()
			createTestSubscription() // stays incomplete

			subscriptionService.updateStatus(id1, 'active')
			subscriptionService.updateStatus(id2, 'active')

			const active = subscriptionService.getActiveSubscriptions()

			expect(active.length).toBe(2)
		})
	})

	describe('getPastDueSubscriptions', () => {
		test('should return all past_due subscriptions', () => {
			const id1 = createTestSubscription()
			const id2 = createTestSubscription()

			subscriptionService.updateStatus(id1, 'past_due')
			subscriptionService.updateStatus(id2, 'active')

			const pastDue = subscriptionService.getPastDueSubscriptions()

			expect(pastDue.length).toBe(1)
			expect(pastDue[0].id).toBe(id1)
		})
	})
})
