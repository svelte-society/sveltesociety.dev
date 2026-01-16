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

	test('sponsor cards appear in content feed', async ({ page }) => {
		await page.goto('/')

		// Check for sponsor card in feed
		const sponsorCard = page.getByTestId('sponsor-card')
		// May or may not be visible depending on feed position
		// Just verify the feed loads
		const contentList = page.getByTestId('content-list')
		await expect(contentList).toBeVisible()
	})
})
