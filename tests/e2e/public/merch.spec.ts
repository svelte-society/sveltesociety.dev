import { test, expect } from '@playwright/test'
import { MerchStorePage, MerchProductPage, MerchCartPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'
import { loginAs } from '../../helpers/auth'

test.describe('Merch Store Listing', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('can view merch store page', async ({ page }) => {
		const merchPage = new MerchStorePage(page)
		await merchPage.goto()

		await merchPage.expectPageLoaded()
		await merchPage.expectProductsDisplayed()
	})

	test('only shows active products', async ({ page }) => {
		const merchPage = new MerchStorePage(page)
		await merchPage.goto()

		// Active products should be visible
		await merchPage.expectProductWithTitle('Svelte Society T-Shirt')
		await merchPage.expectProductWithTitle('Svelte Sticker Pack')

		// Should show exactly 2 active products (hoodie is inactive)
		await merchPage.expectProductCount(2)
	})

	test('can search products', async ({ page }) => {
		const merchPage = new MerchStorePage(page)
		await merchPage.goto()

		await merchPage.searchFor('sticker')

		await merchPage.expectProductWithTitle('Svelte Sticker Pack')
		await merchPage.expectProductCount(1)
	})

	test('search with no results shows empty state', async ({ page }) => {
		const merchPage = new MerchStorePage(page)
		await merchPage.goto()

		await merchPage.searchFor('nonexistent product xyz')

		await merchPage.expectNoProducts()
	})

	test('can navigate to product detail', async ({ page }) => {
		const merchPage = new MerchStorePage(page)
		await merchPage.goto()

		await merchPage.clickProductByTitle('Svelte Society T-Shirt')

		await expect(page).toHaveURL(/\/merch\/svelte-society-t-shirt/)
	})

	test('displays product prices', async ({ page }) => {
		const merchPage = new MerchStorePage(page)
		await merchPage.goto()

		// Products should show price information
		const cards = merchPage.productCards
		const firstCard = cards.first()
		await expect(firstCard).toContainText('€')
	})

	test('displays in stock / out of stock badges', async ({ page }) => {
		const merchPage = new MerchStorePage(page)
		await merchPage.goto()

		// T-shirt has variants in stock
		await merchPage.expectInStockBadge('Svelte Society T-Shirt')
		// Sticker pack has variants in stock
		await merchPage.expectInStockBadge('Svelte Sticker Pack')
	})
})

test.describe('Merch Product Detail', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('can view product detail page', async ({ page }) => {
		const productPage = new MerchProductPage(page)
		await productPage.goto('svelte-society-t-shirt')

		await productPage.expectProductLoaded('Svelte Society T-Shirt')
	})

	test('displays product description', async ({ page }) => {
		const productPage = new MerchProductPage(page)
		await productPage.goto('svelte-society-t-shirt')

		await expect(productPage.description).toContainText('Official Svelte Society t-shirt')
	})

	test('displays variant options', async ({ page }) => {
		const productPage = new MerchProductPage(page)
		await productPage.goto('svelte-society-t-shirt')

		// Size options
		await expect(productPage.variantButton('Size', 'S')).toBeVisible()
		await expect(productPage.variantButton('Size', 'M')).toBeVisible()
		await expect(productPage.variantButton('Size', 'L')).toBeVisible()
		await expect(productPage.variantButton('Size', 'XL')).toBeVisible()

		// Color options
		await expect(productPage.variantButton('Color', 'Black')).toBeVisible()
		await expect(productPage.variantButton('Color', 'White')).toBeVisible()
	})

	test('can select variant options', async ({ page }) => {
		const productPage = new MerchProductPage(page)
		await productPage.goto('svelte-society-t-shirt')

		await productPage.selectVariant('Size', 'L')
		await productPage.expectVariantSelected('Size', 'L')

		await productPage.selectVariant('Color', 'White')
		await productPage.expectVariantSelected('Color', 'White')
	})

	test('can adjust quantity', async ({ page }) => {
		const productPage = new MerchProductPage(page)
		await productPage.goto('svelte-society-t-shirt')

		await productPage.expectQuantity(1)

		await productPage.increaseQuantity(2)
		await productPage.expectQuantity(3)

		await productPage.decreaseQuantity(1)
		await productPage.expectQuantity(2)
	})

	test('quantity cannot go below 1', async ({ page }) => {
		const productPage = new MerchProductPage(page)
		await productPage.goto('svelte-society-t-shirt')

		await productPage.expectQuantity(1)
		await productPage.decreaseQuantity(3) // Try to go below 1
		await productPage.expectQuantity(1)
	})

	test('shows breadcrumb navigation', async ({ page }) => {
		const productPage = new MerchProductPage(page)
		await productPage.goto('svelte-society-t-shirt')

		await expect(productPage.breadcrumbMerchLink).toBeVisible()
	})

	test('can navigate back to merch listing', async ({ page }) => {
		const productPage = new MerchProductPage(page)
		await productPage.goto('svelte-society-t-shirt')

		await productPage.goBackToMerch()
		await expect(page).toHaveURL(/\/merch$/)
	})

	test('shows 404 for nonexistent product', async ({ page }) => {
		const productPage = new MerchProductPage(page)
		await productPage.goto('nonexistent-product')

		await productPage.expectNotFound()
	})

	test('can add item to cart', async ({ page }) => {
		await loginAs(page, 'viewer')

		const productPage = new MerchProductPage(page)
		await productPage.goto('svelte-sticker-pack')

		await productPage.selectVariant('Type', 'Matte')

		await productPage.addToCart()
		await productPage.expectAddedToCart()
	})

	test('shows view cart link after adding item', async ({ page }) => {
		await loginAs(page, 'viewer')

		const productPage = new MerchProductPage(page)
		await productPage.goto('svelte-sticker-pack')

		await productPage.selectVariant('Type', 'Glossy')
		await productPage.addToCart()

		await productPage.expectViewCartVisible()
	})

	test('add to cart redirects to login when not authenticated', async ({ page }) => {
		const productPage = new MerchProductPage(page)
		await productPage.goto('svelte-sticker-pack')

		await productPage.selectVariant('Type', 'Matte')

		await productPage.addToCart()

		// Should redirect to login page
		await expect(page).toHaveURL(/\/login/)
	})
})

test.describe('Merch Cart', () => {
	// Cart tests involve multiple page navigations and server round-trips;
	// allow one retry to handle timing under full suite concurrency
	test.describe.configure({ retries: 1 })

	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('shows empty cart for user with no items', async ({ page }) => {
		// Use contributor who has no pre-seeded cart items
		await loginAs(page, 'contributor')

		const cartPage = new MerchCartPage(page)
		await cartPage.goto()

		await cartPage.expectPageLoaded()
		await cartPage.expectCartEmpty()
	})

	test('shows browse merch link when cart is empty', async ({ page }) => {
		await loginAs(page, 'contributor')

		const cartPage = new MerchCartPage(page)
		await cartPage.goto()

		await expect(cartPage.browseMerchLink).toBeVisible()
	})

	test('can add items and see them in cart', async ({ page }) => {
		await loginAs(page, 'contributor')

		// Add an item from product page
		const productPage = new MerchProductPage(page)
		await productPage.goto('svelte-sticker-pack')

		await productPage.selectVariant('Type', 'Matte')
		await productPage.addToCart()
		// Wait for server round-trip to complete (View Cart link appears after cart summary refreshes)
		await productPage.expectViewCartVisible()

		// Navigate to cart
		const cartPage = new MerchCartPage(page)
		await cartPage.goto()

		await cartPage.expectCartNotEmpty()
	})

	test('displays cart total', async ({ page }) => {
		await loginAs(page, 'contributor')

		// Add item to cart first
		const productPage = new MerchProductPage(page)
		await productPage.goto('svelte-sticker-pack')

		await productPage.selectVariant('Type', 'Matte')
		await productPage.addToCart()
		await productPage.expectViewCartVisible()

		// Check cart
		const cartPage = new MerchCartPage(page)
		await cartPage.goto()

		await expect(cartPage.cartTotal).toBeVisible()
		const total = await cartPage.getTotalText()
		expect(total).toContain('€')
	})

	test('can remove items from cart', async ({ page }) => {
		await loginAs(page, 'contributor')

		// Add item first
		const productPage = new MerchProductPage(page)
		await productPage.goto('svelte-sticker-pack')

		await productPage.selectVariant('Type', 'Glossy')
		await productPage.addToCart()
		await productPage.expectViewCartVisible()

		// Go to cart and remove all items until empty
		const cartPage = new MerchCartPage(page)
		await cartPage.goto()

		await cartPage.expectCartNotEmpty()
		// Remove items one at a time (removeItem waits for each removal to complete)
		const count = await cartPage.getCartItemCount()
		for (let i = 0; i < count; i++) {
			await cartPage.removeItem(0)
		}
		await cartPage.expectCartEmpty()
	})

	test('checkout button is available with items in cart', async ({ page }) => {
		await loginAs(page, 'contributor')

		// Add item first
		const productPage = new MerchProductPage(page)
		await productPage.goto('svelte-sticker-pack')

		await productPage.selectVariant('Type', 'Matte')
		await productPage.addToCart()
		await productPage.expectViewCartVisible()

		const cartPage = new MerchCartPage(page)
		await cartPage.goto()

		await cartPage.expectCheckoutAvailable()
	})
})

test.describe('Merch Navigation', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('merch link appears in sidebar navigation', async ({ page }) => {
		await page.goto('/')
		const merchLink = page.getByRole('link', { name: 'Merch' })
		await expect(merchLink.first()).toBeVisible()
	})

	test('can navigate to merch from sidebar', async ({ page }) => {
		await page.goto('/')
		const merchLink = page.getByRole('link', { name: 'Merch' })
		await merchLink.first().click()
		await expect(page).toHaveURL(/\/merch/)
	})
})
