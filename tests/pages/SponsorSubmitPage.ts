import type { Locator } from '@playwright/test'
import { expect } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * SponsorSubmitPage - Page Object Model for the sponsor submission form
 *
 * Represents the sponsor submission page at /sponsors/submit which allows
 * companies to become sponsors of Svelte Society.
 *
 * Provides methods for:
 * - Selecting pricing tiers
 * - Selecting billing cycle
 * - Filling company information
 * - Form validation
 *
 * Note: This page doesn't require authentication - companies sponsor
 * by paying via Stripe checkout.
 *
 * @example
 * const sponsorSubmitPage = new SponsorSubmitPage(page)
 * await sponsorSubmitPage.goto()
 * await sponsorSubmitPage.selectTier('premium')
 * await sponsorSubmitPage.fillCompanyInfo({...})
 */
export class SponsorSubmitPage extends BasePage {
	/**
	 * Navigate to the sponsor submission page
	 */
	async goto(): Promise<void> {
		await this.page.goto('/sponsors/submit')
	}

	// Tier Selection Selectors

	/**
	 * Pricing tiers container
	 */
	get pricingTiers(): Locator {
		return this.page.getByTestId('pricing-tiers')
	}

	/**
	 * Get specific tier button by name
	 * @param tierName - 'basic' or 'premium'
	 */
	tierButton(tierName: 'basic' | 'premium'): Locator {
		return this.page.getByTestId(`tier-${tierName}`)
	}

	// Billing Cycle Selectors

	/**
	 * Get billing cycle button by type
	 * @param billingType - 'monthly', 'yearly', or 'one_time'
	 */
	billingButton(billingType: 'monthly' | 'yearly' | 'one_time'): Locator {
		return this.page.getByTestId(`billing-${billingType}`)
	}

	// Company Information Selectors

	/**
	 * Company name input
	 */
	get companyNameInput(): Locator {
		return this.page.getByTestId('company-name-input')
	}

	/**
	 * Website URL input
	 */
	get websiteUrlInput(): Locator {
		return this.page.getByTestId('website-url-input')
	}

	/**
	 * Company logo upload input
	 */
	get logoInput(): Locator {
		return this.page.getByTestId('logo-input')
	}

	/**
	 * Tagline textarea
	 */
	get taglineInput(): Locator {
		return this.page.getByTestId('tagline-input')
	}

	// Optional Discount Selectors

	/**
	 * Discount code input
	 */
	get discountCodeInput(): Locator {
		return this.page.getByTestId('discount-code-input')
	}

	/**
	 * Discount description input
	 */
	get discountDescriptionInput(): Locator {
		return this.page.getByTestId('discount-description-input')
	}

	// Submit Button

	/**
	 * Submit/Continue to payment button
	 */
	get submitButton(): Locator {
		return this.page.getByTestId('submit-sponsor-button')
	}

	// Actions

	/**
	 * Select a pricing tier
	 * @param tierName - 'basic' or 'premium'
	 */
	async selectTier(tierName: 'basic' | 'premium'): Promise<void> {
		await this.tierButton(tierName).click()
	}

	/**
	 * Select a billing cycle
	 * @param billingType - 'monthly', 'yearly', or 'one_time'
	 */
	async selectBilling(billingType: 'monthly' | 'yearly' | 'one_time'): Promise<void> {
		await this.billingButton(billingType).click()
	}

	/**
	 * Fill company information section
	 */
	async fillCompanyInfo(data: {
		companyName: string
		websiteUrl: string
		tagline: string
	}): Promise<void> {
		await this.companyNameInput.fill(data.companyName)
		await this.websiteUrlInput.fill(data.websiteUrl)
		await this.taglineInput.fill(data.tagline)
	}

	/**
	 * Fill optional discount section
	 */
	async fillDiscount(data: { code: string; description: string }): Promise<void> {
		await this.discountCodeInput.fill(data.code)
		await this.discountDescriptionInput.fill(data.description)
	}

	/**
	 * Click submit/continue to payment button
	 */
	async clickSubmit(): Promise<void> {
		await this.submitButton.click()
	}

	/**
	 * Fill entire sponsor submission form
	 */
	async fillCompleteForm(data: {
		tier: 'basic' | 'premium'
		billing: 'monthly' | 'yearly' | 'one_time'
		company: {
			companyName: string
			websiteUrl: string
			tagline: string
		}
		discount?: {
			code: string
			description: string
		}
	}): Promise<void> {
		await this.selectTier(data.tier)
		await this.selectBilling(data.billing)
		await this.fillCompanyInfo(data.company)
		if (data.discount) {
			await this.fillDiscount(data.discount)
		}
	}

	// Assertions

	/**
	 * Verify page loaded correctly
	 */
	async expectPageLoaded(): Promise<void> {
		await expect(this.page).toHaveTitle(/Become a Sponsor/)
		await expect(this.pricingTiers).toBeVisible()
		await expect(this.submitButton).toBeVisible()
	}

	/**
	 * Verify all pricing tiers are displayed
	 */
	async expectAllTiersVisible(): Promise<void> {
		await expect(this.tierButton('basic')).toBeVisible()
		await expect(this.tierButton('premium')).toBeVisible()
	}

	/**
	 * Verify a specific tier is selected
	 * @param tierName - Expected selected tier
	 */
	async expectTierSelected(tierName: 'basic' | 'premium'): Promise<void> {
		const tierButton = this.tierButton(tierName)
		// Selected tier has specific styling with orange border
		await expect(tierButton).toHaveClass(/border-orange-500/)
	}

	/**
	 * Verify a specific billing cycle is selected
	 * @param billingType - Expected selected billing type
	 */
	async expectBillingSelected(billingType: 'monthly' | 'yearly' | 'one_time'): Promise<void> {
		const billingButton = this.billingButton(billingType)
		// Selected billing has specific styling with orange border
		await expect(billingButton).toHaveClass(/border-orange-500/)
	}

	/**
	 * Verify all billing options are visible
	 */
	async expectAllBillingOptionsVisible(): Promise<void> {
		await expect(this.billingButton('monthly')).toBeVisible()
		await expect(this.billingButton('yearly')).toBeVisible()
		await expect(this.billingButton('one_time')).toBeVisible()
	}

	/**
	 * Verify all form fields are visible
	 */
	async expectAllFieldsVisible(): Promise<void> {
		await expect(this.companyNameInput).toBeVisible()
		await expect(this.websiteUrlInput).toBeVisible()
		await expect(this.taglineInput).toBeVisible()
		await expect(this.discountCodeInput).toBeVisible()
		await expect(this.discountDescriptionInput).toBeVisible()
	}

	/**
	 * Verify form can be submitted (button is enabled)
	 */
	async expectCanSubmit(): Promise<void> {
		await expect(this.submitButton).toBeEnabled()
	}
}
