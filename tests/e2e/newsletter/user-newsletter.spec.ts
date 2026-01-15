import { test, expect } from '@playwright/test'
import { UserNewsletterPage, NewsletterSubscribePage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'
import { setupPlunkMock } from '../../helpers/plunk-mock'
import { loginAs } from '../../helpers/auth'

test.describe('User Newsletter Subscription', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
		await setupPlunkMock(page)
	})

	test.describe('Modal Auto-Show', () => {
		test('new user sees newsletter modal on page load', async ({ page }) => {
			const newsletterPage = new UserNewsletterPage(page)

			// Login as viewer (has null newsletter_preference)
			await loginAs(page, 'viewer')
			await page.goto('/')
			await page.waitForLoadState('networkidle')

			// Should see the modal automatically
			await newsletterPage.expectModalVisible()
		})

		test('user can decline newsletter and modal does not reappear', async ({ page }) => {
			const newsletterPage = new UserNewsletterPage(page)

			// Login as viewer (has null newsletter_preference)
			await loginAs(page, 'viewer')
			await page.goto('/')
			await page.waitForLoadState('networkidle')

			// Should see the modal automatically
			await newsletterPage.expectModalVisible()

			// Click "No thanks" to decline
			await newsletterPage.clickDecline()

			// Modal should close
			await newsletterPage.expectModalNotVisible()

			// Refresh the page
			await page.reload()
			await page.waitForLoadState('networkidle')

			// Modal should NOT reappear (preference saved as 'declined')
			await newsletterPage.expectModalNotVisible()
		})
	})

	test.describe('Sidebar Newsletter', () => {
		test('sidebar newsletter is visible for non-logged-in users', async ({ page }) => {
			const subscribePage = new NewsletterSubscribePage(page)

			// Visit without logging in
			await page.goto('/')
			await page.waitForLoadState('networkidle')

			// Should see the sidebar newsletter form
			await subscribePage.expectFormVisible()
		})
	})
})
