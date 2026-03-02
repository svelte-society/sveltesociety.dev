import type { Locator } from '@playwright/test'
import { expect } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * AdminMerchPage - Page Object Model for admin merch product management
 *
 * Provides methods for:
 * - Viewing product list
 * - Searching and filtering products
 * - Creating and editing products
 * - Toggling active status
 */
export class AdminMerchPage extends BasePage {
	async goto(): Promise<void> {
		await this.page.goto('/admin/merch')
	}

	async gotoNew(): Promise<void> {
		await this.page.goto('/admin/merch/new')
	}

	async gotoEdit(id: string): Promise<void> {
		await this.page.goto(`/admin/merch/${id}`)
	}

	// List page selectors

	get heading(): Locator {
		return this.page.getByRole('heading', { name: 'Merch Products' })
	}

	get searchInput(): Locator {
		return this.page.getByTestId('admin-merch-search')
	}

	get activeFilter(): Locator {
		return this.page.getByTestId('admin-merch-active-filter')
	}

	get createProductLink(): Locator {
		return this.page.getByTestId('create-product')
	}

	get productTable(): Locator {
		return this.page.locator('table')
	}

	get productRows(): Locator {
		return this.page.locator('tbody tr')
	}

	// Actions

	async searchFor(query: string): Promise<void> {
		await this.searchInput.fill(query)
		await this.page.waitForTimeout(300)
	}

	async filterByActive(value: string): Promise<void> {
		await this.activeFilter.selectOption(value)
	}

	async clickCreateProduct(): Promise<void> {
		await this.createProductLink.click()
	}

	async clickEditProduct(title: string): Promise<void> {
		const row = this.productRows.filter({ hasText: title })
		await row.getByText('Edit').click()
	}

	async clickToggleActive(title: string): Promise<void> {
		const row = this.productRows.filter({ hasText: title })
		const toggleButton = row.getByText(/Activate|Deactivate/)
		await toggleButton.click()
	}

	// Getters

	async getProductCount(): Promise<number> {
		const noProducts = this.page.getByText('No products found')
		try {
			await noProducts.waitFor({ state: 'visible', timeout: 1000 })
			return 0
		} catch {
			return await this.productRows.count()
		}
	}

	// Assertions

	async expectPageLoaded(): Promise<void> {
		await expect(this.heading).toBeVisible()
	}

	async expectProductInList(title: string): Promise<void> {
		await expect(this.productRows.filter({ hasText: title }).first()).toBeVisible()
	}

	async expectProductNotInList(title: string): Promise<void> {
		await expect(this.productRows.filter({ hasText: title })).toHaveCount(0)
	}

	async expectProductActive(title: string): Promise<void> {
		const row = this.productRows.filter({ hasText: title })
		await expect(row.getByTestId('status-active')).toBeVisible()
	}

	async expectProductInactive(title: string): Promise<void> {
		const row = this.productRows.filter({ hasText: title })
		await expect(row.getByTestId('status-inactive')).toBeVisible()
	}

	async expectNoProducts(): Promise<void> {
		await expect(this.page.getByText('No products found')).toBeVisible()
	}
}
