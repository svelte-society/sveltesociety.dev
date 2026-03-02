import type { Locator } from '@playwright/test'
import { expect } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * MerchProductPage - Page Object Model for product detail page
 *
 * Provides methods for:
 * - Viewing product details
 * - Selecting variants
 * - Adjusting quantity
 * - Adding to cart
 */
export class MerchProductPage extends BasePage {
	async goto(slug: string): Promise<void> {
		await this.page.goto(`/merch/${slug}`)
		// Wait for async product data to load and render
		await this.addToCartButton.or(this.notFoundMessage).waitFor({ state: 'visible' })
	}

	// Selectors

	get title(): Locator {
		return this.page.locator('h1').first()
	}

	get description(): Locator {
		return this.page.getByTestId('product-description')
	}

	get price(): Locator {
		return this.page.locator('.text-3xl.font-bold').last()
	}

	get addToCartButton(): Locator {
		return this.page.getByTestId('add-to-cart')
	}

	get viewCartLink(): Locator {
		return this.page.getByTestId('view-cart')
	}

	get quantityDisplay(): Locator {
		return this.page.getByTestId('quantity-display')
	}

	get quantityPlus(): Locator {
		return this.page.getByTestId('quantity-plus')
	}

	get quantityMinus(): Locator {
		return this.page.getByTestId('quantity-minus')
	}

	get breadcrumbMerchLink(): Locator {
		return this.page.locator('nav a[href="/merch"]')
	}

	get notFoundMessage(): Locator {
		return this.page.getByText('Product not found')
	}

	// Actions

	variantButton(optionName: string, value: string): Locator {
		return this.page.getByTestId(
			`variant-option-${optionName.toLowerCase()}-${value.toLowerCase()}`
		)
	}

	async selectVariant(optionName: string, value: string): Promise<void> {
		await this.variantButton(optionName, value).click()
	}

	async increaseQuantity(times: number = 1): Promise<void> {
		for (let i = 0; i < times; i++) {
			await this.quantityPlus.click()
		}
	}

	async decreaseQuantity(times: number = 1): Promise<void> {
		for (let i = 0; i < times; i++) {
			await this.quantityMinus.click()
		}
	}

	async addToCart(): Promise<void> {
		await this.addToCartButton.click()
	}

	async goToCart(): Promise<void> {
		await this.viewCartLink.click()
	}

	async goBackToMerch(): Promise<void> {
		await this.breadcrumbMerchLink.click()
	}

	// Assertions

	async expectProductLoaded(expectedTitle: string): Promise<void> {
		await expect(this.title).toHaveText(expectedTitle)
	}

	async expectAddedToCart(): Promise<void> {
		await expect(this.addToCartButton).toHaveText('Added to Cart!')
	}

	async expectQuantity(quantity: number): Promise<void> {
		await expect(this.quantityDisplay).toHaveText(String(quantity))
	}

	async expectViewCartVisible(): Promise<void> {
		await expect(this.viewCartLink).toBeVisible()
	}

	async expectVariantSelected(optionName: string, value: string): Promise<void> {
		const label = this.variantButton(optionName, value)
		const radio = label.locator('input[type="radio"]')
		await expect(radio).toBeChecked()
	}

	async expectNotFound(): Promise<void> {
		await expect(this.notFoundMessage).toBeVisible()
	}
}
