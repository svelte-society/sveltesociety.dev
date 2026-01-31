import { describe, test, expect, beforeAll, beforeEach } from 'bun:test'
import { Database } from 'bun:sqlite'
import { JobTierService, type JobTier } from './job-tier'
import { createTestDatabase } from '../../db/test-helpers'

describe('JobTierService', () => {
	let db: Database
	let jobTierService: JobTierService

	beforeAll(() => {
		// Create in-memory database with all migrations applied
		db = createTestDatabase()
	})

	beforeEach(() => {
		// Clear and re-seed job_tiers table
		db.prepare('DELETE FROM job_tiers').run()

		// Insert test tiers (matching migration seed data)
		const testTiers = [
			{
				name: 'basic',
				display_name: 'Basic',
				price_cents: 19900,
				duration_days: 30,
				features: JSON.stringify(['30-day listing', 'Standard visibility']),
				sort_order: 1,
				active: 1
			},
			{
				name: 'featured',
				display_name: 'Featured',
				price_cents: 39900,
				duration_days: 45,
				features: JSON.stringify([
					'45-day listing',
					'Featured badge',
					'Higher search ranking',
					'Social media promotion'
				]),
				sort_order: 2,
				active: 1
			},
			{
				name: 'premium',
				display_name: 'Premium',
				price_cents: 59900,
				duration_days: 60,
				features: JSON.stringify([
					'60-day listing',
					'Premium badge',
					'Top search ranking',
					'Social media promotion',
					'Newsletter feature'
				]),
				sort_order: 3,
				active: 1
			}
		]

		const insertStmt = db.prepare(`
			INSERT INTO job_tiers (name, display_name, price_cents, duration_days, features, sort_order, active)
			VALUES ($name, $display_name, $price_cents, $duration_days, $features, $sort_order, $active)
		`)

		testTiers.forEach((tier) => insertStmt.run(tier))

		jobTierService = new JobTierService(db)
	})

	describe('getActiveTiers', () => {
		test('should return all active tiers sorted by sort_order', () => {
			const tiers = jobTierService.getActiveTiers()

			expect(tiers.length).toBe(3)
			expect(tiers[0].name).toBe('basic')
			expect(tiers[1].name).toBe('featured')
			expect(tiers[2].name).toBe('premium')
		})

		test('should return tiers with parsed features array', () => {
			const tiers = jobTierService.getActiveTiers()

			expect(Array.isArray(tiers[0].features)).toBe(true)
			expect(tiers[0].features).toContain('30-day listing')
			expect(tiers[2].features).toContain('Newsletter feature')
		})

		test('should not return inactive tiers', () => {
			// Deactivate the premium tier
			db.prepare('UPDATE job_tiers SET active = 0 WHERE name = $name').run({ name: 'premium' })

			const tiers = jobTierService.getActiveTiers()

			expect(tiers.length).toBe(2)
			expect(tiers.map((t) => t.name)).not.toContain('premium')
		})

		test('should include correct pricing information', () => {
			const tiers = jobTierService.getActiveTiers()

			expect(tiers[0].price_cents).toBe(19900) // $199
			expect(tiers[1].price_cents).toBe(39900) // $399
			expect(tiers[2].price_cents).toBe(59900) // $599
		})

		test('should include duration days', () => {
			const tiers = jobTierService.getActiveTiers()

			expect(tiers[0].duration_days).toBe(30)
			expect(tiers[1].duration_days).toBe(45)
			expect(tiers[2].duration_days).toBe(60)
		})
	})

	describe('getTierById', () => {
		test('should return tier by id', () => {
			const tiers = jobTierService.getActiveTiers()
			const tier = jobTierService.getTierById(tiers[0].id)

			expect(tier).toBeDefined()
			expect(tier?.name).toBe('basic')
		})

		test('should return null for non-existent id', () => {
			const tier = jobTierService.getTierById('non-existent-id')

			expect(tier).toBeNull()
		})

		test('should parse features as array', () => {
			const tiers = jobTierService.getActiveTiers()
			const tier = jobTierService.getTierById(tiers[1].id)

			expect(Array.isArray(tier?.features)).toBe(true)
			expect(tier?.features).toContain('Featured badge')
		})
	})

	describe('getTierByName', () => {
		test('should return tier by name', () => {
			const tier = jobTierService.getTierByName('featured')

			expect(tier).toBeDefined()
			expect(tier?.display_name).toBe('Featured')
			expect(tier?.price_cents).toBe(39900)
		})

		test('should return null for non-existent name', () => {
			const tier = jobTierService.getTierByName('non-existent')

			expect(tier).toBeNull()
		})

		test('should work for all tier names', () => {
			const basic = jobTierService.getTierByName('basic')
			const featured = jobTierService.getTierByName('featured')
			const premium = jobTierService.getTierByName('premium')

			expect(basic?.name).toBe('basic')
			expect(featured?.name).toBe('featured')
			expect(premium?.name).toBe('premium')
		})
	})

	describe('updateStripePriceId', () => {
		test('should update stripe_price_id for a tier', () => {
			const tiers = jobTierService.getActiveTiers()
			const tierId = tiers[0].id
			const stripePriceId = 'price_1234567890'

			jobTierService.updateStripePriceId(tierId, stripePriceId)

			const updatedTier = jobTierService.getTierById(tierId)
			expect(updatedTier?.stripe_price_id).toBe(stripePriceId)
		})

		test('should not affect other tier fields', () => {
			const tiers = jobTierService.getActiveTiers()
			const tierId = tiers[0].id
			const originalTier = jobTierService.getTierById(tierId)

			jobTierService.updateStripePriceId(tierId, 'price_test')

			const updatedTier = jobTierService.getTierById(tierId)
			expect(updatedTier?.name).toBe(originalTier?.name)
			expect(updatedTier?.price_cents).toBe(originalTier?.price_cents)
			expect(updatedTier?.duration_days).toBe(originalTier?.duration_days)
		})
	})

	describe('calculateExpirationDate', () => {
		test('should calculate correct expiration date for basic tier', () => {
			const tier = jobTierService.getTierByName('basic')
			const now = new Date('2025-01-01T00:00:00Z')

			const expirationDate = jobTierService.calculateExpirationDate(tier!.id, now)

			expect(expirationDate.toISOString()).toBe('2025-01-31T00:00:00.000Z')
		})

		test('should calculate correct expiration date for featured tier', () => {
			const tier = jobTierService.getTierByName('featured')
			const now = new Date('2025-01-01T00:00:00Z')

			const expirationDate = jobTierService.calculateExpirationDate(tier!.id, now)

			expect(expirationDate.toISOString()).toBe('2025-02-15T00:00:00.000Z')
		})

		test('should calculate correct expiration date for premium tier', () => {
			const tier = jobTierService.getTierByName('premium')
			const now = new Date('2025-01-01T00:00:00Z')

			const expirationDate = jobTierService.calculateExpirationDate(tier!.id, now)

			expect(expirationDate.toISOString()).toBe('2025-03-02T00:00:00.000Z')
		})

		test('should throw error for non-existent tier', () => {
			expect(() => {
				jobTierService.calculateExpirationDate('non-existent-id')
			}).toThrow('Tier not found')
		})
	})
})
