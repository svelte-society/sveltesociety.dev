import type { Page, Locator } from '@playwright/test'

/**
 * BasePage - Base class for all Page Object Models
 *
 * Provides common functionality that all pages share:
 * - Navigation helpers
 * - Common selectors (header, footer, navigation)
 * - Waiting strategies
 * - Common assertions
 *
 * All page classes should extend this base class.
 *
 * @example
 * export class HomePage extends BasePage {
 *   async searchFor(query: string) {
 *     // HomePage-specific implementation
 *   }
 * }
 */
export class BasePage {
	constructor(protected page: Page) {}

	/**
	 * Navigate to a specific path
	 * @param path - URL path to navigate to (e.g., '/admin', '/recipes')
	 */
	async goto(path: string): Promise<void> {
		await this.page.goto(path)
	}

	/**
	 * Get the current page title
	 * @returns Page title
	 */
	async getPageTitle(): Promise<string> {
		return await this.page.title()
	}

	/**
	 * Get the current URL
	 * @returns Current page URL
	 */
	getCurrentUrl(): string {
		return this.page.url()
	}

	// Common selectors accessible to all pages

	/**
	 * Header navigation element
	 */
	protected get header(): Locator {
		return this.page.locator('header')
	}

	/**
	 * Footer element
	 */
	protected get footer(): Locator {
		return this.page.locator('footer')
	}

	/**
	 * Main navigation menu
	 */
	protected get nav(): Locator {
		return this.page.locator('nav')
	}

	/**
	 * Login link in navigation
	 */
	get loginLink(): Locator {
		return this.page.locator('a[href="/login"]')
	}

	/**
	 * User profile dropdown/menu (visible when authenticated)
	 */
	protected get userMenu(): Locator {
		return this.page.locator('[data-testid="user-menu"]')
	}

	// Common actions

	/**
	 * Check if user is logged in by looking for login link
	 * @returns true if login link is NOT visible (user is logged in)
	 */
	async isLoggedIn(): Promise<boolean> {
		try {
			await this.loginLink.waitFor({ state: 'visible', timeout: 1000 })
			return false
		} catch {
			return true
		}
	}

	/**
	 * Click the login link
	 */
	async clickLogin(): Promise<void> {
		await this.loginLink.click()
	}

	/**
	 * Navigate to home page
	 */
	async goHome(): Promise<void> {
		await this.page.locator('a[href="/"]').first().click()
	}

	/**
	 * Reload the current page
	 */
	async reload(): Promise<void> {
		await this.page.reload()
	}
}
