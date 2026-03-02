import { test, expect } from '@playwright/test'
import { AdminMerchPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'
import { loginAs } from '../../helpers/auth'

test.describe('Admin Merch Product List', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
		await loginAs(page, 'admin')
	})

	test('can view merch products page', async ({ page }) => {
		const adminMerch = new AdminMerchPage(page)
		await adminMerch.goto()

		await adminMerch.expectPageLoaded()
	})

	test('displays all products including inactive', async ({ page }) => {
		const adminMerch = new AdminMerchPage(page)
		await adminMerch.goto()

		// Admin should see all products (active + inactive)
		await adminMerch.expectProductInList('Svelte Society T-Shirt')
		await adminMerch.expectProductInList('Svelte Sticker Pack')
		await adminMerch.expectProductInList('Svelte Hoodie (Inactive)')
	})

	test('shows active/inactive status badges', async ({ page }) => {
		const adminMerch = new AdminMerchPage(page)
		await adminMerch.goto()

		await adminMerch.expectProductActive('Svelte Society T-Shirt')
		await adminMerch.expectProductActive('Svelte Sticker Pack')
		await adminMerch.expectProductInactive('Svelte Hoodie (Inactive)')
	})

	test('can search products', async ({ page }) => {
		const adminMerch = new AdminMerchPage(page)
		await adminMerch.goto()

		await adminMerch.searchFor('sticker')
		await adminMerch.expectProductInList('Svelte Sticker Pack')
	})

	test('can filter by active status', async ({ page }) => {
		const adminMerch = new AdminMerchPage(page)
		await adminMerch.goto()

		await adminMerch.filterByActive('true')

		// Should show only active products
		await adminMerch.expectProductInList('Svelte Society T-Shirt')
		await adminMerch.expectProductInList('Svelte Sticker Pack')
	})

	test('can filter by inactive status', async ({ page }) => {
		const adminMerch = new AdminMerchPage(page)
		await adminMerch.goto()

		await adminMerch.filterByActive('false')

		// Should show only inactive products
		await adminMerch.expectProductInList('Svelte Hoodie (Inactive)')
	})

	test('has create product link', async ({ page }) => {
		const adminMerch = new AdminMerchPage(page)
		await adminMerch.goto()

		await expect(adminMerch.createProductLink).toBeVisible()
		await expect(adminMerch.createProductLink).toHaveAttribute('href', '/admin/merch/new')
	})

	test('can navigate to create product page', async ({ page }) => {
		const adminMerch = new AdminMerchPage(page)
		await adminMerch.goto()

		await adminMerch.clickCreateProduct()
		await expect(page).toHaveURL(/\/admin\/merch\/new/)
	})

	test('can navigate to edit product page', async ({ page }) => {
		const adminMerch = new AdminMerchPage(page)
		await adminMerch.goto()

		await adminMerch.clickEditProduct('Svelte Society T-Shirt')
		await expect(page).toHaveURL(/\/admin\/merch\/merch_prod_001/)
	})

	test('displays variant counts', async ({ page }) => {
		const adminMerch = new AdminMerchPage(page)
		await adminMerch.goto()

		// T-shirt has 6 variants in test data
		const tshirtRow = adminMerch.productRows.filter({ hasText: 'Svelte Society T-Shirt' })
		await expect(tshirtRow).toContainText('6')

		// Sticker pack has 2 variants
		const stickerRow = adminMerch.productRows.filter({ hasText: 'Svelte Sticker Pack' })
		await expect(stickerRow).toContainText('2')
	})
})

test.describe('Admin Merch Access Control', () => {
	test('contributor (moderator) can access admin merch page', async ({ page }) => {
		await setupDatabaseIsolation(page)
		await loginAs(page, 'contributor')

		await page.goto('/admin/merch')

		// Moderators are authorized by checkAdminAuth
		const heading = page.getByRole('heading', { name: 'Merch Products' })
		await expect(heading).toBeVisible()
	})

	test('viewer cannot access admin merch page', async ({ page }) => {
		await setupDatabaseIsolation(page)
		await loginAs(page, 'viewer')

		await page.goto('/admin/merch')

		// Should not show the merch page content
		const heading = page.getByRole('heading', { name: 'Merch Products' })
		await expect(heading).not.toBeVisible()
	})
})

test.describe('Admin Merch in Sidebar', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
		await loginAs(page, 'admin')
	})

	test('merch link appears in admin sidebar', async ({ page }) => {
		await page.goto('/admin')

		const merchLink = page.getByRole('link', { name: 'Merch' })
		await expect(merchLink.first()).toBeVisible()
	})

	test('can navigate to merch from admin sidebar', async ({ page }) => {
		await page.goto('/admin')

		const merchLink = page.getByRole('link', { name: 'Merch' })
		await merchLink.first().click()
		await expect(page).toHaveURL(/\/admin\/merch/)
	})
})
