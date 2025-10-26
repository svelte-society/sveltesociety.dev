import { test, expect } from '@playwright/test'
import { loginAs } from '../../helpers/auth'
import { AdminDashboardPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'

test.describe('Protected Routes - Role-Based Access Control', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('unauthenticated user is redirected from /admin', async ({ page }) => {
		const adminPage = new AdminDashboardPage(page)
		await adminPage.gotoDashboard()

		await expect(page).toHaveURL('/')
	})

	test('unauthenticated user is redirected from /admin/users', async ({ page }) => {
		await page.goto('/admin/users')

		await expect(page).toHaveURL('/')
	})

	test('member role (viewer) cannot access /admin dashboard', async ({ page }) => {
		await loginAs(page, 'viewer')

		const adminPage = new AdminDashboardPage(page)
		await adminPage.gotoDashboard()

		await expect(page).toHaveURL('/')
	})

	test('member role (viewer) cannot access /admin/users', async ({ page }) => {
		await loginAs(page, 'viewer')
		await page.goto('/admin/users')

		await expect(page).toHaveURL('/')
	})

	test('moderator role can access /admin dashboard', async ({ page }) => {
		await loginAs(page, 'admin')
		await page.goto('/')

		const adminPage = new AdminDashboardPage(page)
		await adminPage.gotoDashboard()

		await expect(page).toHaveURL('/admin')
		await adminPage.expectDashboardHeading()
	})

	test('admin role can access /admin/users (admin-only route)', async ({ page }) => {
		await loginAs(page, 'admin')

		const adminPage = new AdminDashboardPage(page)
		await adminPage.gotoUserManagement()

		await expect(page).toHaveURL('/admin/users')
	})

	test('admin role can access /admin/content', async ({ page }) => {
		await loginAs(page, 'admin')

		const adminPage = new AdminDashboardPage(page)
		await adminPage.gotoContentManagement()

		await expect(page).toHaveURL('/admin/content')
		await adminPage.expectContentManagementHeading()
	})
})
