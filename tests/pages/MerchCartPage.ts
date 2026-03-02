import type { Locator } from '@playwright/test'
import { expect } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * MerchCartPage - Page Object Model for the shopping cart page
 *
 * Provides methods for:
 * - Viewing cart items
 * - Adjusting quantities
 * - Removing items
 * - Checking out
 */
export class MerchCartPage extends BasePage {
	async goto(): Promise<void> {
		await this.page.goto('/merch/cart')
	}

	// Selectors

	get heading(): Locator {
		return this.page.getByRole('heading', { name: 'Shopping Cart' })
	}

	get cartItems(): Locator {
		return this.page.getByTestId('cart-item')
	}

	get cartTotal(): Locator {
		return this.page.getByTestId('cart-total')
	}

	get checkoutButton(): Locator {
		return this.page.getByTestId('checkout-button')
	}

	get cartError(): Locator {
		return this.page.getByTestId('cart-error')
	}

	get emptyCartMessage(): Locator {
		return this.page.getByText('Your cart is empty')
	}

	get browseMerchLink(): Locator {
		return this.page.getByRole('link', { name: 'Browse Merch' })
	}

	get removeButtons(): Locator {
		return this.page.getByTestId('cart-remove')
	}

	// Actions

	async removeItem(index: number): Promise<void> {
		const countBefore = await this.cartItems.count()
		await this.removeButtons.nth(index).click()
		// Wait for the item to be removed (count decreases or empty state shows)
		if (countBefore > 1) {
			await expect(this.cartItems).toHaveCount(countBefore - 1)
		} else {
			await expect(this.emptyCartMessage).toBeVisible()
		}
	}

	async clickCheckout(): Promise<void> {
		await this.checkoutButton.click()
	}

	// Getters

	async getCartItemCount(): Promise<number> {
		return await this.cartItems.count()
	}

	async getTotalText(): Promise<string> {
		return (await this.cartTotal.textContent()) || ''
	}

	// Assertions

	async expectPageLoaded(): Promise<void> {
		await expect(this.heading).toBeVisible()
	}

	async expectCartEmpty(): Promise<void> {
		await expect(this.emptyCartMessage).toBeVisible()
	}

	async expectCartNotEmpty(): Promise<void> {
		await expect(this.cartItems.first()).toBeVisible()
	}

	async expectItemCount(count: number): Promise<void> {
		await expect(this.cartItems).toHaveCount(count)
	}

	async expectCheckoutAvailable(): Promise<void> {
		await expect(this.checkoutButton).toBeVisible()
		await expect(this.checkoutButton).toBeEnabled()
	}

	async expectCartError(): Promise<void> {
		await expect(this.cartError).toBeVisible()
	}
}
