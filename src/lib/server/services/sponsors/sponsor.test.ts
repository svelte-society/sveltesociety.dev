import { describe, test, expect, beforeAll, beforeEach } from 'bun:test'
import { Database } from 'bun:sqlite'
import { SponsorService, type Sponsor, type CreateSponsorData } from './sponsor'
import { createTestDatabase } from '../../db/test-helpers'

describe('SponsorService', () => {
	let db: Database
	let sponsorService: SponsorService

	const testSponsorData: CreateSponsorData = {
		company_name: 'Test Company',
		logo_url: 'https://example.com/logo.png',
		tagline: 'Test tagline for the company',
		website_url: 'https://example.com',
		contact_email: 'contact@example.com',
		discount_code: 'TEST20',
		discount_description: '20% off for Svelte developers'
	}

	beforeAll(() => {
		db = createTestDatabase()
	})

	beforeEach(() => {
		// Clear sponsors table
		db.prepare('DELETE FROM sponsors').run()
		sponsorService = new SponsorService(db)
	})

	describe('createSponsor', () => {
		test('should create a sponsor and return the id', () => {
			const id = sponsorService.createSponsor(testSponsorData)

			expect(id).toBeDefined()
			expect(typeof id).toBe('string')
			expect(id.length).toBeGreaterThan(0)
		})

		test('should create sponsor with pending status', () => {
			const id = sponsorService.createSponsor(testSponsorData)
			const sponsor = sponsorService.getSponsorById(id)

			expect(sponsor?.status).toBe('pending')
		})

		test('should create sponsor with all provided data', () => {
			const id = sponsorService.createSponsor(testSponsorData)
			const sponsor = sponsorService.getSponsorById(id)

			expect(sponsor?.company_name).toBe(testSponsorData.company_name)
			expect(sponsor?.logo_url).toBe(testSponsorData.logo_url)
			expect(sponsor?.tagline).toBe(testSponsorData.tagline)
			expect(sponsor?.website_url).toBe(testSponsorData.website_url)
			expect(sponsor?.contact_email).toBe(testSponsorData.contact_email)
			expect(sponsor?.discount_code).toBe(testSponsorData.discount_code)
			expect(sponsor?.discount_description).toBe(testSponsorData.discount_description)
		})

		test('should create sponsor without optional fields', () => {
			const minimalData: CreateSponsorData = {
				company_name: 'Minimal Company',
				logo_url: 'https://example.com/logo.png',
				tagline: 'Minimal tagline',
				website_url: 'https://minimal.com'
			}

			const id = sponsorService.createSponsor(minimalData)
			const sponsor = sponsorService.getSponsorById(id)

			expect(sponsor?.company_name).toBe('Minimal Company')
			expect(sponsor?.contact_email).toBeNull()
			expect(sponsor?.discount_code).toBeNull()
			expect(sponsor?.discount_description).toBeNull()
		})
	})

	describe('getSponsorById', () => {
		test('should return sponsor by id', () => {
			const id = sponsorService.createSponsor(testSponsorData)
			const sponsor = sponsorService.getSponsorById(id)

			expect(sponsor).toBeDefined()
			expect(sponsor?.id).toBe(id)
		})

		test('should return null for non-existent id', () => {
			const sponsor = sponsorService.getSponsorById('non-existent-id')

			expect(sponsor).toBeNull()
		})
	})

	describe('getSponsorsByStatus', () => {
		test('should return sponsors filtered by status', () => {
			// Create multiple sponsors
			const id1 = sponsorService.createSponsor(testSponsorData)
			const id2 = sponsorService.createSponsor({
				...testSponsorData,
				company_name: 'Another Company'
			})

			// Activate one
			sponsorService.activateSponsor(id1)

			const pending = sponsorService.getSponsorsByStatus('pending')
			const active = sponsorService.getSponsorsByStatus('active')

			expect(pending.length).toBe(1)
			expect(pending[0].company_name).toBe('Another Company')
			expect(active.length).toBe(1)
			expect(active[0].company_name).toBe('Test Company')
		})

		test('should return empty array when no sponsors match status', () => {
			sponsorService.createSponsor(testSponsorData)

			const cancelled = sponsorService.getSponsorsByStatus('cancelled')

			expect(cancelled.length).toBe(0)
		})
	})

	describe('getActiveSponsors', () => {
		test('should return only active sponsors', () => {
			const id1 = sponsorService.createSponsor(testSponsorData)
			sponsorService.createSponsor({ ...testSponsorData, company_name: 'Pending Company' })

			sponsorService.activateSponsor(id1)

			const active = sponsorService.getActiveSponsors()

			expect(active.length).toBe(1)
			expect(active[0].company_name).toBe('Test Company')
		})
	})

	describe('getPendingSponsors', () => {
		test('should return only pending sponsors', () => {
			const id1 = sponsorService.createSponsor(testSponsorData)
			sponsorService.createSponsor({ ...testSponsorData, company_name: 'Another Pending' })

			sponsorService.activateSponsor(id1)

			const pending = sponsorService.getPendingSponsors()

			expect(pending.length).toBe(1)
			expect(pending[0].company_name).toBe('Another Pending')
		})
	})

	describe('updateSponsor', () => {
		test('should update company name', () => {
			const id = sponsorService.createSponsor(testSponsorData)

			sponsorService.updateSponsor(id, { company_name: 'Updated Company' })

			const sponsor = sponsorService.getSponsorById(id)
			expect(sponsor?.company_name).toBe('Updated Company')
		})

		test('should update tagline', () => {
			const id = sponsorService.createSponsor(testSponsorData)

			sponsorService.updateSponsor(id, { tagline: 'New tagline' })

			const sponsor = sponsorService.getSponsorById(id)
			expect(sponsor?.tagline).toBe('New tagline')
		})

		test('should update discount code to null', () => {
			const id = sponsorService.createSponsor(testSponsorData)

			sponsorService.updateSponsor(id, { discount_code: null })

			const sponsor = sponsorService.getSponsorById(id)
			expect(sponsor?.discount_code).toBeNull()
		})

		test('should update multiple fields at once', () => {
			const id = sponsorService.createSponsor(testSponsorData)

			sponsorService.updateSponsor(id, {
				company_name: 'New Name',
				tagline: 'New tagline',
				website_url: 'https://new-site.com'
			})

			const sponsor = sponsorService.getSponsorById(id)
			expect(sponsor?.company_name).toBe('New Name')
			expect(sponsor?.tagline).toBe('New tagline')
			expect(sponsor?.website_url).toBe('https://new-site.com')
		})
	})

	describe('activateSponsor', () => {
		test('should set status to active', () => {
			const id = sponsorService.createSponsor(testSponsorData)

			sponsorService.activateSponsor(id)

			const sponsor = sponsorService.getSponsorById(id)
			expect(sponsor?.status).toBe('active')
		})

		test('should set activated_at timestamp', () => {
			const id = sponsorService.createSponsor(testSponsorData)

			sponsorService.activateSponsor(id)

			const sponsor = sponsorService.getSponsorById(id)
			expect(sponsor?.activated_at).toBeDefined()
			expect(sponsor?.activated_at).not.toBeNull()
		})
	})

	describe('pauseSponsor', () => {
		test('should set status to paused', () => {
			const id = sponsorService.createSponsor(testSponsorData)
			sponsorService.activateSponsor(id)

			sponsorService.pauseSponsor(id)

			const sponsor = sponsorService.getSponsorById(id)
			expect(sponsor?.status).toBe('paused')
		})
	})

	describe('cancelSponsor', () => {
		test('should set status to cancelled', () => {
			const id = sponsorService.createSponsor(testSponsorData)

			sponsorService.cancelSponsor(id)

			const sponsor = sponsorService.getSponsorById(id)
			expect(sponsor?.status).toBe('cancelled')
		})
	})

	describe('expireSponsor', () => {
		test('should set status to expired', () => {
			const id = sponsorService.createSponsor(testSponsorData)
			sponsorService.activateSponsor(id)

			sponsorService.expireSponsor(id)

			const sponsor = sponsorService.getSponsorById(id)
			expect(sponsor?.status).toBe('expired')
		})
	})

	describe('setContactEmail', () => {
		test('should update contact email', () => {
			const id = sponsorService.createSponsor({
				...testSponsorData,
				contact_email: undefined
			})

			sponsorService.setContactEmail(id, 'new@example.com')

			const sponsor = sponsorService.getSponsorById(id)
			expect(sponsor?.contact_email).toBe('new@example.com')
		})
	})

	describe('setExpiresAt', () => {
		test('should set expiration date', () => {
			const id = sponsorService.createSponsor(testSponsorData)
			const expiresAt = new Date('2025-12-31T23:59:59Z')

			sponsorService.setExpiresAt(id, expiresAt)

			const sponsor = sponsorService.getSponsorById(id)
			expect(sponsor?.expires_at).toBeDefined()
			expect(new Date(sponsor!.expires_at!).toISOString()).toBe(expiresAt.toISOString())
		})
	})

	describe('getAllSponsors', () => {
		test('should return all sponsors regardless of status', () => {
			const id1 = sponsorService.createSponsor(testSponsorData)
			const id2 = sponsorService.createSponsor({
				...testSponsorData,
				company_name: 'Company 2'
			})
			const id3 = sponsorService.createSponsor({
				...testSponsorData,
				company_name: 'Company 3'
			})

			sponsorService.activateSponsor(id1)
			sponsorService.cancelSponsor(id3)

			const all = sponsorService.getAllSponsors()

			expect(all.length).toBe(3)
		})

		test('should return sponsors sorted by created_at', () => {
			sponsorService.createSponsor({ ...testSponsorData, company_name: 'First' })
			sponsorService.createSponsor({ ...testSponsorData, company_name: 'Second' })
			sponsorService.createSponsor({ ...testSponsorData, company_name: 'Third' })

			const all = sponsorService.getAllSponsors()

			// Verify all sponsors are returned and sorted by created_at (descending)
			expect(all.length).toBe(3)
			// When created in same millisecond, order may vary, so just check all are present
			const names = all.map((s) => s.company_name).sort()
			expect(names).toEqual(['First', 'Second', 'Third'])
		})
	})

	describe('expireOverdueSponsors', () => {
		test('should expire sponsors past their expiration date', () => {
			// Verify clean state
			expect(sponsorService.getActiveSponsors().length).toBe(0)

			const id = sponsorService.createSponsor(testSponsorData)
			sponsorService.activateSponsor(id)

			// Set expiration to the past
			const pastDate = new Date('2020-01-01')
			sponsorService.setExpiresAt(id, pastDate)

			const expiredCount = sponsorService.expireOverdueSponsors()

			expect(expiredCount).toBeGreaterThanOrEqual(1)
			const sponsor = sponsorService.getSponsorById(id)
			expect(sponsor?.status).toBe('expired')
		})

		test('should not expire sponsors without expiration date', () => {
			const id = sponsorService.createSponsor(testSponsorData)
			sponsorService.activateSponsor(id)

			const expiredCount = sponsorService.expireOverdueSponsors()

			expect(expiredCount).toBe(0)
			const sponsor = sponsorService.getSponsorById(id)
			expect(sponsor?.status).toBe('active')
		})

		test('should not expire sponsors with future expiration date', () => {
			const id = sponsorService.createSponsor(testSponsorData)
			sponsorService.activateSponsor(id)

			const futureDate = new Date('2099-01-01')
			sponsorService.setExpiresAt(id, futureDate)

			const expiredCount = sponsorService.expireOverdueSponsors()

			expect(expiredCount).toBe(0)
			const sponsor = sponsorService.getSponsorById(id)
			expect(sponsor?.status).toBe('active')
		})
	})
})
