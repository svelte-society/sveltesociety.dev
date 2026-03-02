import type { Locator } from '@playwright/test'
import { expect } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * MerchStorePage - Page Object Model for the public merch store listing
 *
 * Provides methods for:
 * - Viewing product listings
 * - Searching products
 * - Sorting and filtering
 * - Navigating to product details
 */
export class MerchStorePage extends BasePage {
	async goto(): Promise<void> {
		await this.page.goto('/merch')
	}

	// Selectors

	get searchInput(): Locator {
		return this.page.getByTestId('merch-search')
	}

	get sortSelect(): Locator {
		return this.page.getByTestId('merch-sort')
	}

	get inStockCheckbox(): Locator {
		return this.page.getByTestId('merch-in-stock')
	}

	get productGrid(): Locator {
		return this.page.getByTestId('merch-grid')
	}

	get productCards(): Locator {
		return this.page.getByTestId('merch-card')
	}

	get heading(): Locator {
		return this.page.getByRole('heading', { name: 'Merch Store' })
	}

	// Actions

	async searchFor(query: string): Promise<void> {
		await this.searchInput.fill(query)
		// Wait for reactive update
		await this.page.waitForTimeout(300)
	}

	async sortBy(value: string): Promise<void> {
		await this.sortSelect.selectOption(value)
	}

	async toggleInStockOnly(): Promise<void> {
		await this.inStockCheckbox.click()
	}

	async clickProduct(index: number): Promise<void> {
		await this.productCards.nth(index).click()
	}

	async clickProductByTitle(title: string): Promise<void> {
		await this.productCards.filter({ hasText: title }).first().click()
	}

	// Getters

	async getProductCount(): Promise<number> {
		return await this.productCards.count()
	}

	async getProductTitles(): Promise<string[]> {
		const count = await this.productCards.count()
		if (count === 0) return []
		const titles: string[] = []
		for (let i = 0; i < count; i++) {
			const h2 = this.productCards.nth(i).locator('h2')
			titles.push((await h2.textContent()) || '')
		}
		return titles.map((t) => t.trim())
	}

	// Assertions

	async expectPageLoaded(): Promise<void> {
		await expect(this.heading).toBeVisible()
	}

	async expectProductsDisplayed(): Promise<void> {
		const count = await this.getProductCount()
		expect(count).toBeGreaterThan(0)
	}

	async expectProductWithTitle(title: string): Promise<void> {
		await expect(this.productCards.filter({ hasText: title }).first()).toBeVisible()
	}

	async expectNoProducts(): Promise<void> {
		await expect(this.page.getByText('No products found')).toBeVisible()
	}

	async expectProductCount(count: number): Promise<void> {
		await expect(this.productCards).toHaveCount(count)
	}

	async expectInStockBadge(title: string): Promise<void> {
		const card = this.productCards.filter({ hasText: title }).first()
		await expect(card.getByText('In Stock')).toBeVisible()
	}

	async expectOutOfStockBadge(title: string): Promise<void> {
		const card = this.productCards.filter({ hasText: title }).first()
		await expect(card.getByText('Out of Stock')).toBeVisible()
	}
}
