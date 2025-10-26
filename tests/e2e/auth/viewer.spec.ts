import { test, expect } from '../../fixtures/auth.fixture'
import { HomePage, AdminDashboardPage, SubmitPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'

test.describe('Viewer Authentication', () => {
	test.use({ authenticatedAs: 'viewer' })

	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('can view homepage when logged in', async ({ page }) => {
		const homePage = new HomePage(page)
		await homePage.goto()
		await expect(homePage.loginLink).not.toBeVisible()
	})

	test('cannot access admin routes', async ({ page }) => {
		const adminPage = new AdminDashboardPage(page)
		await adminPage.gotoDashboard()
		await expect(page).not.toHaveURL(/\/admin/)
	})

	test('can access submit page when logged in', async ({ page }) => {
		const submitPage = new SubmitPage(page)
		await submitPage.goto()
		await expect(submitPage.submitHeading).toContainText('Submit')
	})
})
