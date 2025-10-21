import type { Page } from '@playwright/test'
import { TEST_USERS } from '../fixtures/test-data'

/**
 * Authentication helpers for E2E tests.
 *
 * These helpers bypass GitHub OAuth by setting session cookies directly.
 * This allows tests to run without external API dependencies.
 */

/**
 * Logs in a user by setting their session cookie directly.
 * Bypasses GitHub OAuth flow for faster, more reliable tests.
 *
 * @param page - Playwright page object
 * @param role - User role ('admin' or 'viewer')
 * @example
 * await loginAs(page, 'admin')
 * await page.goto('/admin')
 */
export async function loginAs(page: Page, role: 'admin' | 'viewer'): Promise<void> {
	const user = TEST_USERS[role]

	// Set the session cookie (cookie name is 'session_id', value is the session_token)
	await page.context().addCookies([
		{
			name: 'session_id',
			value: user.sessionToken,
			domain: 'localhost',
			path: '/',
			httpOnly: true,
			sameSite: 'Lax',
			expires: Math.floor(Date.now() / 1000) + 86400 // 24 hours from now
		}
	])
}

/**
 * Logs out the current user by clearing the session cookie.
 *
 * @param page - Playwright page object
 * @example
 * await logout(page)
 */
export async function logout(page: Page): Promise<void> {
	await page.context().clearCookies()
}

/**
 * Checks if a user is currently logged in by looking for the session cookie.
 *
 * @param page - Playwright page object
 * @returns true if logged in, false otherwise
 * @example
 * const loggedIn = await isLoggedIn(page)
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
	const cookies = await page.context().cookies()
	return cookies.some(cookie => cookie.name === 'session_id')
}
