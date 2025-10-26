import { test, expect } from '@playwright/test'
import { HomePage, AdminDashboardPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'

test.describe('Simple Auth Check', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('unauthenticated user sees login link', async ({ page }) => {
		const homePage = new HomePage(page)
		await homePage.goto()
		await homePage.loginLink.waitFor({ state: 'visible' })
	})

	test('admin route redirects unauthenticated user', async ({ page }) => {
		const adminPage = new AdminDashboardPage(page)
		await adminPage.gotoDashboard()
		await expect(page).not.toHaveURL(/\/admin/)
	})
})
