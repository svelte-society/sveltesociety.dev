import { describe, test, expect, beforeAll, beforeEach } from 'bun:test'
import { Database } from 'bun:sqlite'
import { SponsorTierService, type SponsorTier } from './sponsor-tier'
import { createTestDatabase } from '../../db/test-helpers'

describe('SponsorTierService', () => {
	let db: Database
	let sponsorTierService: SponsorTierService

	beforeAll(() => {
		// Create in-memory database with all migrations applied
		db = createTestDatabase()
	})

	beforeEach(() => {
		// Clear and re-seed sponsor_tiers table
		db.prepare('DELETE FROM sponsor_tiers').run()

		// Insert test tiers (matching migration seed data)
		const testTiers = [
			{
				name: 'basic',
				display_name: 'Basic Sponsor',
				price_cents: 39900,
				yearly_price_cents: 399000,
				one_time_price_cents: 39900,
				features: JSON.stringify([
					'Logo in feed cards',
					'Logo in sidebar',
					'Company tagline',
					'Website link',
					'Optional discount code'
				]),
				logo_size: 'normal',
				max_tagline_length: 100,
				show_in_feed: 1,
				show_in_sidebar: 1,
				include_social_promo: 0,
				sort_order: 1,
				active: 1
			},
			{
				name: 'premium',
				display_name: 'Premium Sponsor',
				price_cents: 79900,
				yearly_price_cents: 799000,
				one_time_price_cents: 79900,
				features: JSON.stringify([
					'2x larger logo',
					'Logo in feed cards',
					'Logo in sidebar',
					'Extended tagline (200 chars)',
					'Website link',
					'Optional discount code',
					'Social media promotion'
				]),
				logo_size: 'large',
				max_tagline_length: 200,
				show_in_feed: 1,
				show_in_sidebar: 1,
				include_social_promo: 1,
				sort_order: 2,
				active: 1
			}
		]

		const insertStmt = db.prepare(`
			INSERT INTO sponsor_tiers (
				name, display_name, price_cents, yearly_price_cents, one_time_price_cents,
				features, logo_size, max_tagline_length, show_in_feed, show_in_sidebar,
				include_social_promo, sort_order, active
			) VALUES (
				$name, $display_name, $price_cents, $yearly_price_cents, $one_time_price_cents,
				$features, $logo_size, $max_tagline_length, $show_in_feed, $show_in_sidebar,
				$include_social_promo, $sort_order, $active
			)
		`)

		testTiers.forEach((tier) => insertStmt.run(tier))

		sponsorTierService = new SponsorTierService(db)
	})

	describe('getActiveTiers', () => {
		test('should return all active tiers sorted by sort_order', () => {
			const tiers = sponsorTierService.getActiveTiers()

			expect(tiers.length).toBe(2)
			expect(tiers[0].name).toBe('basic')
			expect(tiers[1].name).toBe('premium')
		})

		test('should return tiers with parsed features array', () => {
			const tiers = sponsorTierService.getActiveTiers()

			expect(Array.isArray(tiers[0].features)).toBe(true)
			expect(tiers[0].features).toContain('Logo in feed cards')
			expect(tiers[1].features).toContain('Social media promotion')
		})

		test('should not return inactive tiers', () => {
			// Deactivate the premium tier
			db.prepare('UPDATE sponsor_tiers SET active = 0 WHERE name = $name').run({ name: 'premium' })

			const tiers = sponsorTierService.getActiveTiers()

			expect(tiers.length).toBe(1)
			expect(tiers[0].name).toBe('basic')
		})

		test('should include correct pricing information', () => {
			const tiers = sponsorTierService.getActiveTiers()

			expect(tiers[0].price_cents).toBe(39900) // $399/mo
			expect(tiers[0].yearly_price_cents).toBe(399000) // $3990/yr
			expect(tiers[1].price_cents).toBe(79900) // $799/mo
			expect(tiers[1].yearly_price_cents).toBe(799000) // $7990/yr
		})

		test('should include display options', () => {
			const tiers = sponsorTierService.getActiveTiers()

			expect(tiers[0].logo_size).toBe('normal')
			expect(tiers[0].max_tagline_length).toBe(100)
			expect(tiers[0].show_in_feed).toBe(true)
			expect(tiers[0].show_in_sidebar).toBe(true)
			expect(tiers[0].include_social_promo).toBe(false)

			expect(tiers[1].logo_size).toBe('large')
			expect(tiers[1].max_tagline_length).toBe(200)
			expect(tiers[1].include_social_promo).toBe(true)
		})
	})

	describe('getTierById', () => {
		test('should return tier by id', () => {
			const tiers = sponsorTierService.getActiveTiers()
			const tier = sponsorTierService.getTierById(tiers[0].id)

			expect(tier).toBeDefined()
			expect(tier?.name).toBe('basic')
		})

		test('should return null for non-existent id', () => {
			const tier = sponsorTierService.getTierById('non-existent-id')

			expect(tier).toBeNull()
		})

		test('should parse features as array', () => {
			const tiers = sponsorTierService.getActiveTiers()
			const tier = sponsorTierService.getTierById(tiers[1].id)

			expect(Array.isArray(tier?.features)).toBe(true)
			expect(tier?.features).toContain('2x larger logo')
		})
	})

	describe('getTierByName', () => {
		test('should return tier by name', () => {
			const tier = sponsorTierService.getTierByName('premium')

			expect(tier).toBeDefined()
			expect(tier?.display_name).toBe('Premium Sponsor')
			expect(tier?.price_cents).toBe(79900)
		})

		test('should return null for non-existent name', () => {
			const tier = sponsorTierService.getTierByName('non-existent')

			expect(tier).toBeNull()
		})

		test('should work for all tier names', () => {
			const basic = sponsorTierService.getTierByName('basic')
			const premium = sponsorTierService.getTierByName('premium')

			expect(basic?.name).toBe('basic')
			expect(premium?.name).toBe('premium')
		})
	})

	describe('updateStripePriceIds', () => {
		test('should update monthly stripe price id', () => {
			const tiers = sponsorTierService.getActiveTiers()
			const tierId = tiers[0].id
			const monthlyPriceId = 'price_monthly_1234'

			sponsorTierService.updateStripePriceIds(tierId, { monthly: monthlyPriceId })

			const updatedTier = sponsorTierService.getTierById(tierId)
			expect(updatedTier?.stripe_monthly_price_id).toBe(monthlyPriceId)
		})

		test('should update yearly stripe price id', () => {
			const tiers = sponsorTierService.getActiveTiers()
			const tierId = tiers[0].id
			const yearlyPriceId = 'price_yearly_5678'

			sponsorTierService.updateStripePriceIds(tierId, { yearly: yearlyPriceId })

			const updatedTier = sponsorTierService.getTierById(tierId)
			expect(updatedTier?.stripe_yearly_price_id).toBe(yearlyPriceId)
		})

		test('should update onetime stripe price id', () => {
			const tiers = sponsorTierService.getActiveTiers()
			const tierId = tiers[0].id
			const onetimePriceId = 'price_onetime_9012'

			sponsorTierService.updateStripePriceIds(tierId, { onetime: onetimePriceId })

			const updatedTier = sponsorTierService.getTierById(tierId)
			expect(updatedTier?.stripe_onetime_price_id).toBe(onetimePriceId)
		})

		test('should update multiple price ids at once', () => {
			const tiers = sponsorTierService.getActiveTiers()
			const tierId = tiers[0].id

			sponsorTierService.updateStripePriceIds(tierId, {
				monthly: 'price_monthly',
				yearly: 'price_yearly',
				onetime: 'price_onetime'
			})

			const updatedTier = sponsorTierService.getTierById(tierId)
			expect(updatedTier?.stripe_monthly_price_id).toBe('price_monthly')
			expect(updatedTier?.stripe_yearly_price_id).toBe('price_yearly')
			expect(updatedTier?.stripe_onetime_price_id).toBe('price_onetime')
		})
	})

	describe('getPriceForBillingType', () => {
		test('should return monthly price', () => {
			const tier = sponsorTierService.getTierByName('basic')!
			const price = sponsorTierService.getPriceForBillingType(tier, 'monthly')

			expect(price).toBe(39900)
		})

		test('should return yearly price', () => {
			const tier = sponsorTierService.getTierByName('basic')!
			const price = sponsorTierService.getPriceForBillingType(tier, 'yearly')

			expect(price).toBe(399000)
		})

		test('should return one-time price', () => {
			const tier = sponsorTierService.getTierByName('basic')!
			const price = sponsorTierService.getPriceForBillingType(tier, 'one_time')

			expect(price).toBe(39900)
		})

		test('should work for premium tier', () => {
			const tier = sponsorTierService.getTierByName('premium')!

			expect(sponsorTierService.getPriceForBillingType(tier, 'monthly')).toBe(79900)
			expect(sponsorTierService.getPriceForBillingType(tier, 'yearly')).toBe(799000)
			expect(sponsorTierService.getPriceForBillingType(tier, 'one_time')).toBe(79900)
		})
	})
})
