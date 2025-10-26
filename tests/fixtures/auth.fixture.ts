import { test as base } from '@playwright/test'
import { loginAs } from '../helpers/auth'

/**
 * Authentication fixtures for different user roles.
 *
 * Supported roles: 'admin', 'viewer', or null (unauthenticated)
 *
 * Usage:
 * import { test } from '../fixtures/auth.fixture'
 *
 * test.describe('Admin tests', () => {
 *   test.use({ authenticatedAs: 'admin' })
 *
 *   test('can access admin dashboard', async ({ page }) => {
 *     await page.goto('/admin')
 *     // User is already logged in as admin
 *   })
 * })
 */

type AuthRole = 'admin' | 'viewer' | null

export const test = base.extend<{ authenticatedAs: AuthRole }>({
	authenticatedAs: null,

	page: async ({ page, authenticatedAs }, use) => {
		// If a role is specified, log in before the test
		if (authenticatedAs) {
			await loginAs(page, authenticatedAs)
		}

		// Run the test
		await use(page)

		// Cleanup is automatic - each test gets a fresh browser context
	}
})

export { expect } from '@playwright/test'
