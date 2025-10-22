import { test, expect } from '../../fixtures/auth.fixture'

test.describe('Admin Authentication', () => {
	test.use({ authenticatedAs: 'admin' })

	test('can access admin dashboard', async ({ page }) => {
		const cookies = await page.context().cookies()
		console.log('Cookies after login:', cookies)
		await page.goto('/admin')
		await expect(page.locator('h1')).toContainText('Dashboard')
	})

	test('can access content management', async ({ page }) => {
		await page.goto('/admin/content')
		expect(page.getByRole('heading', { name: 'Content Management' })).toBeVisible()
	})

	test('can access user management', async ({ page }) => {
		await page.goto('/admin/users')
		await expect(page).toHaveURL(/\/admin\/users/)
	})
})
