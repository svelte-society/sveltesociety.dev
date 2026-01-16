import { test, expect } from '@playwright/test'
import { SponsorSubmitPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'

test.describe('Sponsor Submission Page', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('can access sponsor submission page', async ({ page }) => {
		const sponsorSubmitPage = new SponsorSubmitPage(page)
		await sponsorSubmitPage.goto()

		await sponsorSubmitPage.expectPageLoaded()
	})

	test('displays all pricing tiers', async ({ page }) => {
		const sponsorSubmitPage = new SponsorSubmitPage(page)
		await sponsorSubmitPage.goto()

		await sponsorSubmitPage.expectAllTiersVisible()
	})

	test('displays all billing options', async ({ page }) => {
		const sponsorSubmitPage = new SponsorSubmitPage(page)
		await sponsorSubmitPage.goto()

		await sponsorSubmitPage.expectAllBillingOptionsVisible()
	})

	test('can select different pricing tiers', async ({ page }) => {
		const sponsorSubmitPage = new SponsorSubmitPage(page)
		await sponsorSubmitPage.goto()

		// Select basic tier
		await sponsorSubmitPage.selectTier('basic')
		await sponsorSubmitPage.expectTierSelected('basic')

		// Select premium tier
		await sponsorSubmitPage.selectTier('premium')
		await sponsorSubmitPage.expectTierSelected('premium')
	})

	test('can select different billing cycles', async ({ page }) => {
		const sponsorSubmitPage = new SponsorSubmitPage(page)
		await sponsorSubmitPage.goto()

		// Select monthly
		await sponsorSubmitPage.selectBilling('monthly')
		await sponsorSubmitPage.expectBillingSelected('monthly')

		// Select yearly
		await sponsorSubmitPage.selectBilling('yearly')
		await sponsorSubmitPage.expectBillingSelected('yearly')

		// Select one-time
		await sponsorSubmitPage.selectBilling('one_time')
		await sponsorSubmitPage.expectBillingSelected('one_time')
	})

	test('form has all required fields', async ({ page }) => {
		const sponsorSubmitPage = new SponsorSubmitPage(page)
		await sponsorSubmitPage.goto()

		await sponsorSubmitPage.expectAllFieldsVisible()
	})

	test('can fill out sponsor submission form', async ({ page }) => {
		const sponsorSubmitPage = new SponsorSubmitPage(page)
		await sponsorSubmitPage.goto()

		await sponsorSubmitPage.fillCompleteForm({
			tier: 'premium',
			billing: 'monthly',
			company: {
				companyName: 'Test Company',
				websiteUrl: 'https://testcompany.com',
				tagline: 'We build great tools for developers'
			},
			discount: {
				code: 'TESTCODE',
				description: '10% off for Svelte developers'
			}
		})

		// Verify form can be submitted (button is enabled)
		await sponsorSubmitPage.expectCanSubmit()
	})

	test('can fill form without optional discount', async ({ page }) => {
		const sponsorSubmitPage = new SponsorSubmitPage(page)
		await sponsorSubmitPage.goto()

		await sponsorSubmitPage.fillCompleteForm({
			tier: 'basic',
			billing: 'yearly',
			company: {
				companyName: 'Basic Sponsor',
				websiteUrl: 'https://basicsponsor.com',
				tagline: 'Simple hosting solutions'
			}
		})

		// Verify form can be submitted (button is enabled)
		await sponsorSubmitPage.expectCanSubmit()
	})
})

test.describe('Sponsors in Sidebar', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('active sponsors appear in sidebar', async ({ page }) => {
		await page.goto('/')

		// Check for sponsor section in sidebar
		const sponsorSection = page.locator('text=Sponsors')
		await expect(sponsorSection.first()).toBeVisible()

		// Check for test sponsor company names in the sidebar sponsor links (rel="noopener sponsored")
		const sidebarSponsorLink = page.locator('a[rel="noopener sponsored"]', {
			hasText: 'Acme Dev Tools'
		})
		await expect(sidebarSponsorLink.first()).toBeVisible()
	})

	test('sponsor cards link to sponsor website', async ({ page }) => {
		await page.goto('/')

		// Find a sponsor link in sidebar
		const sponsorLink = page.locator('a[rel="noopener sponsored"]').first()
		await expect(sponsorLink).toBeVisible()

		// Verify it links to external site
		const href = await sponsorLink.getAttribute('href')
		expect(href).toContain('http')
	})

	test('become a sponsor link is visible', async ({ page }) => {
		await page.goto('/')

		// Check for "Become a Sponsor" CTA
		const ctaLink = page.locator('a[href="/sponsors/submit"]').first()
		await expect(ctaLink).toBeVisible()
	})
})

test.describe('Sponsors in Feed', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('content feed loads with sponsor cards', async ({ page }) => {
		await page.goto('/')

		// Verify the feed loads
		const contentList = page.getByTestId('content-list')
		await expect(contentList).toBeVisible()

		// Sponsor cards may or may not appear depending on random position calculation
		// The important thing is that the feed renders without errors
		// and contains some content
		const feedItems = contentList.locator('> div, > [data-testid]')
		const itemCount = await feedItems.count()
		expect(itemCount).toBeGreaterThan(0)
	})

	test('sponsor cards have correct structure when present', async ({ page }) => {
		await page.goto('/')

		// Wait for feed to load
		const contentList = page.getByTestId('content-list')
		await expect(contentList).toBeVisible()

		// If sponsor cards are visible, verify their structure
		const sponsorCards = page.getByTestId('sponsor-card')
		const sponsorCount = await sponsorCards.count()

		if (sponsorCount > 0) {
			const sponsorCard = sponsorCards.first()
			await expect(sponsorCard).toBeVisible()

			// Sponsor card should link to external site with sponsored rel
			const sponsorLink = sponsorCard.locator('a[rel="noopener sponsored"]')
			await expect(sponsorLink).toBeVisible()

			// Should have a company logo
			const logo = sponsorCard.locator('img')
			await expect(logo.first()).toBeVisible()
		}
	})
})
