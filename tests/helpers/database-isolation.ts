import type { Page, BrowserContext } from '@playwright/test'
import path from 'path'
import { randomBytes } from 'node:crypto'

const visitorIsolation = new WeakMap<BrowserContext, Promise<void>>()

export function createTestVisitorIp(): string {
	return `2001:db8:${randomBytes(12).toString('hex').match(/.{4}/g)!.join(':')}`
}

function setupVisitorIsolation(context: BrowserContext): Promise<void> {
	let setup = visitorIsolation.get(context)
	if (!setup) {
		// Each browser context represents a separate visitor, even though all E2E
		// traffic reaches the server through localhost. Use a valid documentation IP.
		const ip = createTestVisitorIp()
		setup = context.route(
			(url) => ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname),
			async (route) => {
				await route.fallback({
					headers: { ...(await route.request().allHeaders()), 'cf-connecting-ip': ip }
				})
			}
		)
		visitorIsolation.set(context, setup)
	}
	return setup
}

/**
 * Sets up database isolation for a test file by setting a cookie
 * that tells the server to use a dedicated database copy. Each browser context
 * also gets a distinct localhost visitor IP so parallel tests do not share
 * the production per-client rate limit.
 *
 * This should be called in a beforeEach hook to ensure the cookie
 * is set for every test in the suite.
 *
 * @param page - Playwright page object
 * @param testFileName - Optional name override. If not provided, automatically derives from caller's file path
 *
 * @example
 * // Automatic - derives name from file path
 * test.beforeEach(async ({ page }) => {
 *   await setupDatabaseIsolation(page)
 * })
 *
 * @example
 * // Manual override
 * test.beforeEach(async ({ page }) => {
 *   await setupDatabaseIsolation(page, 'my-custom-name')
 * })
 */
export async function setupDatabaseIsolation(page: Page, testFileName?: string): Promise<void> {
	// If no testFileName provided, try to derive it from the caller's file path
	if (!testFileName) {
		testFileName = getCallerTestFileIdentifier()
	}

	await setupVisitorIsolation(page.context())

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
 * Gets the test file identifier from the calling test file's path.
 * Uses Error stack trace to determine the caller.
 *
 * @returns Test file identifier (e.g., 'content-detail', 'admin-moderation')
 */
function getCallerTestFileIdentifier(): string {
	// Create an error to capture the stack trace
	const stack = new Error().stack
	if (!stack) {
		throw new Error('Unable to determine caller file path from stack trace')
	}

	// Parse the stack to find the calling file
	// Stack format: "at <function> (<file>:<line>:<col>)"
	const lines = stack.split('\n')

	// Find the first line that references a .spec.ts file (the test file)
	for (const line of lines) {
		const match = line.match(/\((.+\.spec\.ts):\d+:\d+\)/)
		if (match) {
			const filePath = match[1]
			return getTestFileIdentifier(filePath)
		}

		// Handle case where function is not wrapped in parentheses
		const match2 = line.match(/at (.+\.spec\.ts):\d+:\d+/)
		if (match2) {
			const filePath = match2[1]
			return getTestFileIdentifier(filePath)
		}
	}

	throw new Error(
		'Unable to find .spec.ts file in stack trace. Please provide testFileName manually.'
	)
}

/**
 * Extracts a test file identifier from the file path.
 * Uses the full relative path from tests/e2e with slashes replaced by hyphens.
 *
 * @param filePath - Full path to the test file
 * @returns A path-based identifier (e.g., 'public-content-detail', 'admin-moderation')
 *
 * @example
 * const id = getTestFileIdentifier('/path/to/tests/e2e/public/content-detail.spec.ts')
 * // Returns: 'public-content-detail'
 *
 * const id = getTestFileIdentifier('/path/to/tests/e2e/admin/moderation.spec.ts')
 * // Returns: 'admin-moderation'
 */
export function getTestFileIdentifier(filePath: string): string {
	// Normalize the path to use forward slashes
	const normalized = filePath.replace(/\\/g, '/')

	// Extract just the e2e path portion (e.g., 'public/content-detail.spec.ts')
	const e2eMatch = normalized.match(/tests\/e2e\/(.+\.spec\.ts)/)
	const relativePath = e2eMatch ? e2eMatch[1] : path.basename(filePath)

	// Remove .spec.ts extension and replace slashes with hyphens
	// e.g., 'public/content-detail.spec.ts' → 'public-content-detail'
	// e.g., 'admin/moderation.spec.ts' → 'admin-moderation'
	return relativePath.replace(/\.spec\.ts$/, '').replace(/\//g, '-')
}
