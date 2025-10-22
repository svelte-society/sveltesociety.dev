import { test, expect } from '@playwright/test'
import { loginAs, isLoggedIn } from '../../helpers/auth'
import { HomePage, LoginPage, AdminDashboardPage } from '../../pages'

test.describe('Login Flow', () => {
	test('unauthenticated user sees login link', async ({ page }) => {
		const homePage = new HomePage(page)
		await homePage.goto()
		await expect(homePage.loginLink).toBeVisible()

		const loggedIn = await isLoggedIn(page)
		expect(loggedIn).toBe(false)
	})

	test('clicking login navigates to login page', async ({ page }) => {
		const homePage = new HomePage(page)
		await homePage.goto()
		await homePage.loginLink.click()
		await expect(page).toHaveURL(/\/login/)
	})

	test('login page shows GitHub OAuth button', async ({ page }) => {
		const loginPage = new LoginPage(page)
		await loginPage.goto()
		await loginPage.expectGithubButtonVisible()
	})

	test('can authenticate as admin', async ({ page }) => {
		await loginAs(page, 'admin')

		const homePage = new HomePage(page)
		await homePage.goto()
		await expect(homePage.loginLink).not.toBeVisible()

		const loggedIn = await isLoggedIn(page)
		expect(loggedIn).toBe(true)
	})

	test('can authenticate as viewer', async ({ page }) => {
		await loginAs(page, 'viewer')

		const homePage = new HomePage(page)
		await homePage.goto()
		await expect(homePage.loginLink).not.toBeVisible()

		const loggedIn = await isLoggedIn(page)
		expect(loggedIn).toBe(true)
	})

	test('authenticated user sees user menu', async ({ page }) => {
		await loginAs(page, 'admin')

		const homePage = new HomePage(page)
		await homePage.goto()

		const adminPage = new AdminDashboardPage(page)
		await adminPage.expectUserMenuVisible()
	})

	// Note: Logout tests removed because they delete sessions from the shared test database,
	// causing other tests to fail. Logout functionality is tested manually.
	// See: docs/PRD_PLAYWRIGHT_E2E_TESTING.md Phase 4a notes
})
