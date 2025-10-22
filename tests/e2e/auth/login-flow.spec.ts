import { test, expect } from '@playwright/test'
import { loginAs, isLoggedIn } from '../../helpers/auth'

test.describe('Login Flow', () => {
	test('unauthenticated user sees login link', async ({ page }) => {
		await page.goto('/')
		await expect(page.locator('a[href="/login"]')).toBeVisible()
		const loggedIn = await isLoggedIn(page)
		expect(loggedIn).toBe(false)
	})

	test('clicking login navigates to login page', async ({ page }) => {
		await page.goto('/')
		await page.locator('a[href="/login"]').click()
		await expect(page).toHaveURL(/\/login/)
	})

	test('login page shows GitHub OAuth button', async ({ page }) => {
		await page.goto('/login')
		const githubButton = page.locator('a[href*="/auth/github"]')
		await expect(githubButton).toBeVisible()
	})

	test('can authenticate as admin', async ({ page }) => {
		await loginAs(page, 'admin')
		await page.goto('/')

		const loginLink = page.locator('a[href="/login"]')
		await expect(loginLink).not.toBeVisible()

		const loggedIn = await isLoggedIn(page)
		expect(loggedIn).toBe(true)
	})

	test('can authenticate as viewer', async ({ page }) => {
		await loginAs(page, 'viewer')
		await page.goto('/')

		const loginLink = page.locator('a[href="/login"]')
		await expect(loginLink).not.toBeVisible()

		const loggedIn = await isLoggedIn(page)
		expect(loggedIn).toBe(true)
	})

	test('authenticated user sees user menu', async ({ page }) => {
		await loginAs(page, 'admin')
		await page.goto('/')

		const userMenu = page.getByTestId('user-menu-trigger')
		await expect(userMenu).toBeVisible()
	})

	// Note: Logout tests removed because they delete sessions from the shared test database,
	// causing other tests to fail. Logout functionality is tested manually.
	// See: docs/PRD_PLAYWRIGHT_E2E_TESTING.md Phase 4a notes
})
