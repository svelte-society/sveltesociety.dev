import { test, expect } from '../../fixtures/auth.fixture'

test.describe('Admin Authentication', () => {
	test.use({ authenticatedAs: 'admin' })

	test('can access admin dashboard', async ({ page }) => {
		await page.goto('/admin')
		await expect(page.locator('h1')).toContainText('Dashboard')
	})

	test('can access content management', async ({ page }) => {
		await page.goto('/admin/content')
		await expect(page).toHaveURL(/\/admin\/content/)
	})

	test('can access user management', async ({ page }) => {
		await page.goto('/admin/users')
		await expect(page).toHaveURL(/\/admin\/users/)
	})
})
