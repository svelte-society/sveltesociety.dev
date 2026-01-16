import { test, expect } from '@playwright/test'
import { AdminSponsorsPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'
import { loginAs } from '../../helpers/auth'
import { TEST_SPONSORS } from '../../fixtures/test-data'

test.describe('Admin - Sponsor Management', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
		await loginAs(page, 'admin')
	})

	test('can access sponsors list page', async ({ page }) => {
		const sponsorsPage = new AdminSponsorsPage(page)
		await sponsorsPage.goto()

		await sponsorsPage.expectPageLoaded()
	})

	test('displays sponsors in table', async ({ page }) => {
		const sponsorsPage = new AdminSponsorsPage(page)
		await sponsorsPage.goto()

		await sponsorsPage.expectSponsorsDisplayed()

		const count = await sponsorsPage.getSponsorCount()
		expect(count).toBe(TEST_SPONSORS.length)
	})

	test('displays sponsor company names', async ({ page }) => {
		const sponsorsPage = new AdminSponsorsPage(page)
		await sponsorsPage.goto()

		// Check for specific sponsor names from test data
		await sponsorsPage.expectSponsorWithCompanyName('Acme Dev Tools')
		await sponsorsPage.expectSponsorWithCompanyName('CloudHost Pro')
		await sponsorsPage.expectSponsorWithCompanyName('Pending Corp')
		await sponsorsPage.expectSponsorWithCompanyName('Awaiting Inc')
	})

	test('can search sponsors by company name', async ({ page }) => {
		const sponsorsPage = new AdminSponsorsPage(page)
		await sponsorsPage.goto()

		await sponsorsPage.search('Acme')

		const names = await sponsorsPage.getCompanyNames()
		expect(names).toContain('Acme Dev Tools')
		expect(names).not.toContain('CloudHost Pro')
	})

	test('can filter sponsors by status - active', async ({ page }) => {
		const sponsorsPage = new AdminSponsorsPage(page)
		await sponsorsPage.goto()

		await sponsorsPage.filterByStatus('active')

		// Should only show active sponsors (2 in test data)
		const count = await sponsorsPage.getSponsorCount()
		expect(count).toBe(2)

		await sponsorsPage.expectSponsorWithCompanyName('Acme Dev Tools')
		await sponsorsPage.expectSponsorWithCompanyName('CloudHost Pro')
	})

	test('can filter sponsors by status - pending', async ({ page }) => {
		const sponsorsPage = new AdminSponsorsPage(page)
		await sponsorsPage.goto()

		await sponsorsPage.filterByStatus('pending')

		// Should only show pending sponsors (2 in test data)
		const count = await sponsorsPage.getSponsorCount()
		expect(count).toBe(2)

		await sponsorsPage.expectSponsorWithCompanyName('Pending Corp')
		await sponsorsPage.expectSponsorWithCompanyName('Awaiting Inc')
	})

	test('can navigate to sponsor edit page', async ({ page }) => {
		const sponsorsPage = new AdminSponsorsPage(page)
		await sponsorsPage.goto()

		await sponsorsPage.clickEdit(0)

		await expect(page).toHaveURL(/\/admin\/sponsors\//)
		await sponsorsPage.expectEditPageLoaded()
	})

	test('edit page displays sponsor details', async ({ page }) => {
		const sponsorsPage = new AdminSponsorsPage(page)
		await sponsorsPage.gotoEdit('sponsor_001')

		await sponsorsPage.expectEditPageLoaded()

		// Check form fields are populated
		await expect(sponsorsPage.companyNameInput).toHaveValue('Acme Dev Tools')
		await expect(sponsorsPage.websiteUrlInput).toHaveValue('https://acme.example.com')
	})

	test('can update sponsor details', async ({ page }) => {
		const sponsorsPage = new AdminSponsorsPage(page)
		await sponsorsPage.gotoEdit('sponsor_001')

		await sponsorsPage.updateSponsorDetails({
			tagline: 'Updated tagline for Acme'
		})

		// Page should remain on edit page with success
		await expect(page).toHaveURL(/\/admin\/sponsors\/sponsor_001/)
	})

	test('back link navigates to sponsors list', async ({ page }) => {
		const sponsorsPage = new AdminSponsorsPage(page)
		await sponsorsPage.gotoEdit('sponsor_001')

		await sponsorsPage.backLink.click()

		await expect(page).toHaveURL('/admin/sponsors')
	})
})

test.describe('Admin - Sponsor Status Management', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
		await loginAs(page, 'admin')
	})

	test('pending sponsor shows activate button', async ({ page }) => {
		const sponsorsPage = new AdminSponsorsPage(page)
		await sponsorsPage.goto()

		// Filter to pending sponsors
		await sponsorsPage.filterByStatus('pending')

		// Should see activate button
		await expect(sponsorsPage.activateButton(0)).toBeVisible()
	})

	test('active sponsor shows pause button', async ({ page }) => {
		const sponsorsPage = new AdminSponsorsPage(page)
		await sponsorsPage.goto()

		// Filter to active sponsors
		await sponsorsPage.filterByStatus('active')

		// Should see pause button
		await expect(sponsorsPage.pauseButton(0)).toBeVisible()
	})

	test('can activate pending sponsor from list', async ({ page }) => {
		const sponsorsPage = new AdminSponsorsPage(page)
		await sponsorsPage.goto()

		// Filter to pending sponsors
		await sponsorsPage.filterByStatus('pending')

		// Get initial pending count
		const initialCount = await sponsorsPage.getSponsorCount()

		// Activate the sponsor
		await sponsorsPage.clickActivate(0)

		// Wait for page update
		await page.waitForTimeout(500)

		// Should now have fewer pending sponsors
		const newCount = await sponsorsPage.getSponsorCount()
		expect(newCount).toBeLessThan(initialCount)
	})

	test('can activate pending sponsor from edit page', async ({ page }) => {
		const sponsorsPage = new AdminSponsorsPage(page)
		await sponsorsPage.gotoEdit('sponsor_004') // Awaiting Inc (separate from list test)

		// Should see activate button on edit page
		await expect(sponsorsPage.activateSponsorButton).toBeVisible()

		// Click activate
		await sponsorsPage.activateSponsorButton.click()

		// Page should refresh and no longer show activate button
		await expect(sponsorsPage.activateSponsorButton).not.toBeVisible()
	})

	test('can pause active sponsor from edit page', async ({ page }) => {
		const sponsorsPage = new AdminSponsorsPage(page)
		await sponsorsPage.gotoEdit('sponsor_001') // Acme Dev Tools (active)

		// Should see pause button on edit page
		await expect(sponsorsPage.pauseSponsorButton).toBeVisible()

		// Click pause
		await sponsorsPage.pauseSponsorButton.click()

		// Page should refresh and show reactivate button instead
		await expect(sponsorsPage.reactivateSponsorButton).toBeVisible()
	})

	test('can cancel sponsor from edit page', async ({ page }) => {
		const sponsorsPage = new AdminSponsorsPage(page)
		await sponsorsPage.gotoEdit('sponsor_001') // Acme Dev Tools (active)

		// Should see cancel button on edit page
		await expect(sponsorsPage.cancelSponsorButton).toBeVisible()

		// Click cancel
		await sponsorsPage.cancelSponsorButton.click()

		// Page should refresh and no longer show cancel button (cancelled status)
		await expect(sponsorsPage.cancelSponsorButton).not.toBeVisible()
	})
})

test.describe('Admin - Sponsor Access Control', () => {
	test('non-admin cannot access sponsors page', async ({ page }) => {
		await setupDatabaseIsolation(page)
		await loginAs(page, 'viewer')

		await page.goto('/admin/sponsors')

		// Should be redirected or see error
		await expect(page).not.toHaveURL('/admin/sponsors')
	})
})
