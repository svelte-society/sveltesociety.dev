import type { Locator } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * HomePage - Page Object Model for the home page
 *
 * Represents the main landing page of the Svelte Society platform.
 * Provides methods for interacting with the homepage, including:
 * - Navigation to content types (recipes, videos, libraries, etc.)
 * - Search functionality
 * - Featured content interactions
 *
 * @example
 * const homePage = new HomePage(page)
 * await homePage.goto()
 * await homePage.expectHomeLoaded()
 * await homePage.navigateToRecipes()
 */
export class HomePage extends BasePage {
	/**
	 * Navigate to the homepage
	 */
	async goto(): Promise<void> {
		await super.goto('/')
	}

	// Selectors specific to HomePage

	/**
	 * Main "Home" navigation link
	 */
	get homeLink(): Locator {
		return this.page.getByRole('link', { name: 'Home' })
	}

	/**
	 * Search input field
	 */
	get searchInput(): Locator {
		return this.page.locator('input[type="search"]')
	}

	/**
	 * Recipes navigation link
	 */
	get recipesLink(): Locator {
		return this.page.getByRole('link', { name: /recipes/i })
	}

	/**
	 * Videos navigation link
	 */
	get videosLink(): Locator {
		return this.page.getByRole('link', { name: /videos/i })
	}

	/**
	 * Libraries navigation link
	 */
	get librariesLink(): Locator {
		return this.page.getByRole('link', { name: /libraries/i })
	}

	/**
	 * Events navigation link
	 */
	get eventsLink(): Locator {
		return this.page.getByRole('link', { name: /events/i })
	}

	/**
	 * Submit content link
	 */
	get submitLink(): Locator {
		return this.page.getByRole('link', { name: /submit/i })
	}

	// Actions

	/**
	 * Perform a search for content
	 * @param query - Search query string
	 */
	async search(query: string): Promise<void> {
		await this.searchInput.fill(query)
		await this.searchInput.press('Enter')
		await this.waitForLoad()
	}

	/**
	 * Navigate to recipes page
	 */
	async navigateToRecipes(): Promise<void> {
		await this.recipesLink.click()
		await this.waitForLoad()
	}

	/**
	 * Navigate to videos page
	 */
	async navigateToVideos(): Promise<void> {
		await this.videosLink.click()
		await this.waitForLoad()
	}

	/**
	 * Navigate to libraries page
	 */
	async navigateToLibraries(): Promise<void> {
		await this.librariesLink.click()
		await this.waitForLoad()
	}

	/**
	 * Navigate to events page
	 */
	async navigateToEvents(): Promise<void> {
		await this.eventsLink.click()
		await this.waitForLoad()
	}

	/**
	 * Navigate to submit page
	 */
	async navigateToSubmit(): Promise<void> {
		await this.submitLink.click()
		await this.waitForLoad()
	}

	/**
	 * Navigate to a specific content type
	 * @param type - Content type to navigate to
	 */
	async navigateToContentType(
		type: 'recipe' | 'video' | 'library' | 'announcement' | 'collection' | 'events'
	): Promise<void> {
		switch (type) {
			case 'recipe':
				await this.navigateToRecipes()
				break
			case 'video':
				await this.navigateToVideos()
				break
			case 'library':
				await this.navigateToLibraries()
				break
			case 'events':
				await this.navigateToEvents()
				break
			default:
				// For announcement and collection, navigate directly via URL
				await this.goto(`/${type}`)
		}
	}

	// Assertions

	/**
	 * Verify that the homepage has loaded successfully
	 * Checks that the "Home" link is visible in navigation
	 */
	async expectHomeLoaded(): Promise<void> {
		await this.homeLink.waitFor({ state: 'visible' })
	}

	/**
	 * Check if search functionality is available
	 * @returns true if search input is visible
	 */
	async hasSearch(): Promise<boolean> {
		try {
			await this.searchInput.waitFor({ state: 'visible', timeout: 1000 })
			return true
		} catch {
			return false
		}
	}
}
