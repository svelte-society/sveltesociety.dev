import { test, expect } from '../../fixtures/auth.fixture'

test.describe('Viewer Authentication', () => {
	test.use({ authenticatedAs: 'viewer' })

	test('can view homepage when logged in', async ({ page }) => {
		await page.goto('/')
		// Should see their profile link instead of login
		await expect(page.locator('a[href="/login"]')).not.toBeVisible()
	})

	test('cannot access admin routes', async ({ page }) => {
		await page.goto('/admin')
		await expect(page).not.toHaveURL(/\/admin/)
	})

	test('can access submit page when logged in', async ({ page }) => {
		await page.goto('/submit')
		// All logged-in users can submit content
		await expect(page.locator('h1')).toContainText('Submit')
	})
})
