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
			url: 'http://localhost:4173/',
			httpOnly: true,
			sameSite: 'Lax',
			expires: -1
		}
	])

	// Verify the cookie was set correctly to catch silent failures early
	const cookies = await page.context().cookies('http://localhost:4173/')
	const sessionCookie = cookies.find((c) => c.name === 'session_id')

	if (!sessionCookie || sessionCookie.value !== user.sessionToken) {
		throw new Error(
			`Failed to set session cookie for ${role}. ` +
				`Expected token: ${user.sessionToken}, got: ${sessionCookie?.value || 'none'}`
		)
	}
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
	return cookies.some((cookie) => cookie.name === 'session_id')
}
