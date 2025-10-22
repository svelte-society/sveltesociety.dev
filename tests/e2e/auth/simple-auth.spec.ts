import { test, expect } from '@playwright/test'
import { HomePage, AdminDashboardPage } from '../../pages'

test.describe('Simple Auth Check', () => {
	test('unauthenticated user sees login link', async ({ page }) => {
		const homePage = new HomePage(page)
		await homePage.goto()
		await homePage.loginLink.waitFor({ state: 'visible' })
	})

	test('admin route redirects unauthenticated user', async ({ page }) => {
		const adminPage = new AdminDashboardPage(page)
		await adminPage.gotoDashboard()
		// Should be redirected away from /admin
		await expect(page).not.toHaveURL(/\/admin/)
	})
})
