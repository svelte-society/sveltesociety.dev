import { test, expect } from '../../fixtures/auth.fixture'
import { AdminDashboardPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'

test.describe('Admin Authentication', () => {
	test.use({ authenticatedAs: 'admin' })

	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page, 'auth-admin-login')
	})

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
