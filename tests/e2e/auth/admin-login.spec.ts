import { test, expect } from '../../fixtures/auth.fixture'
import { AdminDashboardPage } from '../../pages'

test.describe('Admin Authentication', () => {
	test.use({ authenticatedAs: 'admin' })

	test('can access admin dashboard', async ({ page }) => {
		const adminPage = new AdminDashboardPage(page)
		await adminPage.gotoDashboard()
		await adminPage.expectDashboardHeading()
	})

	test('can access content management', async ({ page }) => {
		const adminPage = new AdminDashboardPage(page)
		await adminPage.gotoContentManagement()
		await adminPage.expectContentManagementHeading()
	})

	test('can access user management', async ({ page }) => {
		const adminPage = new AdminDashboardPage(page)
		await adminPage.gotoUserManagement()
		await expect(page).toHaveURL(/\/admin\/users/)
	})
})
