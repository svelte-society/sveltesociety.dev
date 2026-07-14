import { test, expect } from '@playwright/test'
import { AdminMerchOrdersPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'
import { loginAs } from '../../helpers/auth'

test.describe('Admin Merch Orders', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
		await loginAs(page, 'admin')
	})

	test('shows the orders workspace', async ({ page }) => {
		const orders = new AdminMerchOrdersPage(page)
		await orders.goto()

		await orders.expectPageLoaded()
		await expect(orders.emptyState).toBeVisible()
	})

	test('links directly to orders from the admin sidebar', async ({ page }) => {
		const orders = new AdminMerchOrdersPage(page)
		await page.goto('/admin')

		await expect(orders.sidebarLink.first()).toHaveAttribute('href', '/admin/merch/orders')
		await orders.sidebarLink.first().click()
		await expect(page).toHaveURL(/\/admin\/merch\/orders$/)
	})

	for (const route of ['/admin/merch', '/admin/merch/new', '/admin/merch/merch_prod_001']) {
		test(`catalog route ${route} is removed`, async ({ page }) => {
			const response = await page.goto(route)

			expect(response?.status()).toBe(404)
			await expect(page.getByRole('heading', { name: 'Merch Products' })).not.toBeVisible()
		})
	}
})

test.describe('Admin Merch Order Access Control', () => {
	test('viewer cannot access merch orders', async ({ page }) => {
		await setupDatabaseIsolation(page)
		await loginAs(page, 'viewer')

		await page.goto('/admin/merch/orders')

		await expect(page).toHaveURL(/\/$/)
		await expect(page.getByRole('heading', { name: 'Merch Orders' })).not.toBeVisible()
	})
})
