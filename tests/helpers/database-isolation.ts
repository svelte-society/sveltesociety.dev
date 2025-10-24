import type { Page, BrowserContext } from '@playwright/test'
import path from 'path'

/**
 * Sets up database isolation for a test file by setting a cookie
 * that tells the server to use a dedicated database copy.
 *
 * This should be called in a beforeEach hook to ensure the cookie
 * is set for every test in the suite.
 *
 * @param page - Playwright page object
 * @param testFileName - Name of the test file (e.g., 'content-detail', 'browse-content')
 *
 * @example
 * test.beforeEach(async ({ page }) => {
 *   await setupDatabaseIsolation(page, getTestFileIdentifier(__filename))
 * })
 */
export async function setupDatabaseIsolation(page: Page, testFileName: string): Promise<void> {
	await page.context().addCookies([
		{
			name: 'test_db',
			value: testFileName,
			domain: 'localhost',
			path: '/',
			httpOnly: false,
			secure: false,
			sameSite: 'Lax'
		}
	])
}

/**
 * Sets up database isolation at the context level (recommended).
 * This ensures all pages in the context use the same isolated database.
 *
 * @param context - Playwright browser context
 * @param testFileName - Name of the test file (e.g., 'content-detail', 'browse-content')
 *
 * @example
 * test.use({
 *   storageState: async ({ browser }, use) => {
 *     const context = await browser.newContext()
 *     await setupDatabaseIsolationForContext(context, 'content-detail')
 *     // ... rest of test
 *   }
 * })
 */
export async function setupDatabaseIsolationForContext(
	context: BrowserContext,
	testFileName: string
): Promise<void> {
	await context.addCookies([
		{
			name: 'test_db',
			value: testFileName,
			domain: 'localhost',
			path: '/',
			httpOnly: false,
			secure: false,
			sameSite: 'Lax'
		}
	])
}

/**
 * Extracts a test file identifier from the file path.
 * Used to automatically generate database names from test file paths.
 *
 * @param filePath - Full path to the test file
 * @returns A sanitized identifier (e.g., 'content-detail', 'admin-moderation')
 *
 * @example
 * const id = getTestFileIdentifier(__filename)
 * // Returns: 'content-detail' for 'tests/e2e/public/content-detail.spec.ts'
 */
export function getTestFileIdentifier(filePath: string): string {
	const basename = path.basename(filePath, '.spec.ts')
	const dir = path.basename(path.dirname(filePath))

	// For admin tests, prefix with 'admin-'
	if (filePath.includes('/e2e/admin/')) {
		return `admin-${basename}`
	}

	// For content tests (submit), prefix with 'content-'
	if (filePath.includes('/e2e/content/')) {
		return `content-${basename}`
	}

	// For auth tests, prefix with 'auth-'
	if (filePath.includes('/e2e/auth/')) {
		return `auth-${basename}`
	}

	// For public tests, use basename only
	if (filePath.includes('/e2e/public/')) {
		return basename
	}

	// Default: use directory-basename
	return `${dir}-${basename}`
}
