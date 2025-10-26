import { test, expect } from '@playwright/test'
import { loginAs, isLoggedIn } from '../../helpers/auth'
import { HomePage, LoginPage, AdminDashboardPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'

test.describe('Login Flow', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

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

})
