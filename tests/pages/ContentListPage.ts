import type { Locator } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * ContentListPage - Page Object Model for content browsing pages
 *
 * Represents pages that display lists of content (recipes, videos, libraries, etc.)
 * Accessible at routes like /recipe, /video, /library, etc.
 *
 * Provides methods for:
 * - Browsing content by type
 * - Filtering content
 * - Navigating through pagination
 * - Interacting with content cards
 *
 * @example
 * const contentList = new ContentListPage(page)
 * await contentList.goto('recipe')
 * const count = await contentList.getContentCount()
 */
export class ContentListPage extends BasePage {
	/**
	 * Navigate to a specific content type listing page
	 * @param type - Content type to browse (recipe, video, library, etc.)
	 */
	async goto(type: 'recipe' | 'video' | 'library' | 'announcement' | 'collection'): Promise<void> {
		await this.page.goto(`/${type}`)
	}

	// Selectors

	/**
	 * All content cards on the page
	 */
	get contentCards(): Locator {
		return this.page.getByTestId('content-card')
	}

	/**
	 * Content card at a specific index
	 * @param index - Zero-based index of the content card
	 */
	contentCard(index: number): Locator {
		return this.contentCards.nth(index)
	}

	/**
	 * "No content found" message
	 */
	get noContentMessage(): Locator {
		return this.page.getByTestId('no-content-message')
	}

	/**
	 * Filter form/controls
	 */
	get filters(): Locator {
		return this.page.locator('form, [role="search"]').first()
	}

	/**
	 * Pagination controls
	 */
	get pagination(): Locator {
		return this.page.locator('[aria-label*="pagination"], nav').last()
	}

	/**
	 * Next page button in pagination
	 */
	get nextPageButton(): Locator {
		return this.page.locator('a[aria-label="Next page"], a:has-text("Next")')
	}

	/**
	 * Previous page button in pagination
	 */
	get prevPageButton(): Locator {
		return this.page.locator('a[aria-label="Previous page"], a:has-text("Previous")')
	}

	/**
	 * Category/tag filter dropdown or input
	 */
	get categoryFilter(): Locator {
		return this.page.locator('select[name="category"], input[name="category"]')
	}

	/**
	 * Sort dropdown
	 */
	get sortDropdown(): Locator {
		return this.page.locator('select[name="sort"]')
	}

	// Actions

	/**
	 * Click on a content card by index
	 * @param index - Zero-based index of the card to click
	 */
	async clickContentCard(index: number): Promise<void> {
		await this.contentCard(index).click()
	}

	/**
	 * Filter content by category/tag
	 * @param category - Category or tag to filter by
	 */
	async filterByCategory(category: string): Promise<void> {
		const filter = this.categoryFilter
		const tagName = await filter.evaluate((el) => el.tagName.toLowerCase())

		if (tagName === 'select') {
			await filter.selectOption(category)
		} else {
			await filter.fill(category)
			await this.page.keyboard.press('Enter')
		}
	}

	/**
	 * Sort content
	 * @param sortOption - Sort option (latest, oldest, popular)
	 */
	async sortBy(sortOption: 'latest' | 'oldest' | 'popular'): Promise<void> {
		await this.sortDropdown.selectOption(sortOption)
	}

	/**
	 * Navigate to next page of results
	 */
	async goToNextPage(): Promise<void> {
		await this.nextPageButton.click()
	}

	/**
	 * Navigate to previous page of results
	 */
	async goToPreviousPage(): Promise<void> {
		await this.prevPageButton.click()
	}

	// Getters

	/**
	 * Get the number of content cards displayed
	 * @returns Count of content cards
	 */
	async getContentCount(): Promise<number> {
		return await this.contentCards.count()
	}

	/**
	 * Get all content titles displayed on the page
	 * @returns Array of content titles
	 */
	async getContentTitles(): Promise<string[]> {
		const cards = await this.contentCards.all()
		const titles: string[] = []

		for (const card of cards) {
			const titleElement = card.getByTestId('content-title')
			const titleText = await titleElement.textContent()
			if (titleText) {
				titles.push(titleText.trim())
			}
		}

		return titles
	}

	/**
	 * Check if pagination is visible
	 * @returns true if pagination controls are visible
	 */
	async hasPagination(): Promise<boolean> {
		try {
			await this.pagination.waitFor({ state: 'visible', timeout: 1000 })
			return true
		} catch {
			return false
		}
	}

	/**
	 * Check if filters are available
	 * @returns true if filter controls are visible
	 */
	async hasFilters(): Promise<boolean> {
		try {
			await this.filters.waitFor({ state: 'visible', timeout: 1000 })
			return true
		} catch {
			return false
		}
	}

	/**
	 * Check if "no content" message is displayed
	 * @returns true if no content message is visible
	 */
	async isEmptyState(): Promise<boolean> {
		try {
			await this.noContentMessage.waitFor({ state: 'visible', timeout: 1000 })
			return true
		} catch {
			return false
		}
	}

	// Assertions

	/**
	 * Verify that content is displayed
	 */
	async expectContentDisplayed(): Promise<void> {
		const count = await this.getContentCount()
		if (count === 0) {
			throw new Error('Expected content to be displayed, but found 0 content cards')
		}
	}

	/**
	 * Verify specific content exists by title
	 * @param title - Title to search for
	 */
	async expectContentWithTitle(title: string): Promise<void> {
		const titles = await this.getContentTitles()
		if (!titles.some((t) => t.includes(title))) {
			throw new Error(`Expected to find content with title containing "${title}", but found: ${titles.join(', ')}`)
		}
	}
}
