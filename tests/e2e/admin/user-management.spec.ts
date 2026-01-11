import { test, expect } from '@playwright/test'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'
import { UserManagementPage } from '../../pages'
import { loginAs } from '../../helpers/auth'

test.describe('Admin - User Management', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
		await loginAs(page, 'admin')
	})

	test('can view users list', async ({ page }) => {
		const userManagementPage = new UserManagementPage(page)
		await userManagementPage.gotoUsersList()

		const userCount = await userManagementPage.getUserCount()
		expect(userCount).toBeGreaterThan(0)

		await userManagementPage.expectUserInList('test_admin')
		await userManagementPage.expectUserInList('test_contributor')
		await userManagementPage.expectUserInList('test_viewer')
	})

	test('user table displays role information', async ({ page }) => {
		const userManagementPage = new UserManagementPage(page)
		await userManagementPage.gotoUsersList()

		const userCount = await userManagementPage.getUserCount()
		expect(userCount).toBe(3)

		const firstRole = await userManagementPage.getRoleByRow(0)
		expect(firstRole.length).toBeGreaterThan(0)
	})

	test('can navigate to user details page', async ({ page }) => {
		const userManagementPage = new UserManagementPage(page)
		await userManagementPage.gotoUsersList()

		await userManagementPage.clickEditForRow(0)

		await expect(page).toHaveURL(/\/admin\/users\/test_/)
		await expect(page.getByRole('heading', { name: /user details/i })).toBeVisible()
	})

	test('can access user details page with role editing', async ({ page }) => {
		const userManagementPage = new UserManagementPage(page)
		await userManagementPage.gotoUsersList()
		await userManagementPage.clickEditForRow(0)

		await expect(userManagementPage.usernameInput).toBeVisible()
		await expect(userManagementPage.emailInput).toBeVisible()
		await expect(userManagementPage.roleSelect).toBeVisible()
		await expect(userManagementPage.updateButton).toBeVisible()
	})
})
