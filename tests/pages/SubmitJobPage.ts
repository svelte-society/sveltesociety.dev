import type { Locator } from '@playwright/test'
import { expect } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * SubmitJobPage - Page Object Model for the job submission form
 *
 * Represents the job submission page at /jobs/submit which allows
 * companies to post job listings.
 *
 * Provides methods for:
 * - Selecting pricing tiers
 * - Filling company information
 * - Filling job details
 * - Form validation
 *
 * Note: This page doesn't require authentication - companies post
 * jobs by paying via Stripe checkout.
 *
 * @example
 * const submitJobPage = new SubmitJobPage(page)
 * await submitJobPage.goto()
 * await submitJobPage.selectTier('featured')
 * await submitJobPage.fillCompanyInfo({...})
 */
export class SubmitJobPage extends BasePage {
	/**
	 * Navigate to the job submission page
	 */
	async goto(): Promise<void> {
		await this.page.goto('/jobs/submit')
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
	 * @param tierName - 'basic', 'featured', or 'premium'
	 */
	tierButton(tierName: 'basic' | 'featured' | 'premium'): Locator {
		return this.page.getByTestId(`tier-${tierName}`)
	}

	// Company Information Selectors

	/**
	 * Company name input
	 */
	get companyNameInput(): Locator {
		return this.page.getByTestId('company-name-input')
	}

	/**
	 * Employer email input
	 */
	get employerEmailInput(): Locator {
		return this.page.getByTestId('employer-email-input')
	}

	/**
	 * Company website input
	 */
	get companyWebsiteInput(): Locator {
		return this.page.getByTestId('company-website-input')
	}

	/**
	 * Company logo upload input
	 */
	get companyLogoInput(): Locator {
		return this.page.getByTestId('company-logo-input')
	}

	// Job Details Selectors

	/**
	 * Job title input
	 */
	get jobTitleInput(): Locator {
		return this.page.getByTestId('job-title-input')
	}

	/**
	 * Job description (short) textarea
	 */
	get jobDescriptionInput(): Locator {
		return this.page.getByTestId('job-description-input')
	}

	/**
	 * Job body (full description) textarea
	 */
	get jobBodyInput(): Locator {
		return this.page.getByTestId('job-body-input')
	}

	/**
	 * Position type select
	 */
	get positionTypeSelect(): Locator {
		return this.page.getByTestId('position-type-select')
	}

	/**
	 * Seniority level select
	 */
	get seniorityLevelSelect(): Locator {
		return this.page.getByTestId('seniority-level-select')
	}

	// Location Selectors

	/**
	 * Remote status select
	 */
	get remoteStatusSelect(): Locator {
		return this.page.getByTestId('remote-status-select')
	}

	/**
	 * Office location input
	 */
	get locationInput(): Locator {
		return this.page.getByTestId('location-input')
	}

	/**
	 * Remote restrictions input
	 */
	get remoteRestrictionsInput(): Locator {
		return this.page.getByTestId('remote-restrictions-input')
	}

	// Salary Selectors

	/**
	 * Minimum salary input
	 */
	get salaryMinInput(): Locator {
		return this.page.getByTestId('salary-min-input')
	}

	/**
	 * Maximum salary input
	 */
	get salaryMaxInput(): Locator {
		return this.page.getByTestId('salary-max-input')
	}

	/**
	 * Salary currency select
	 */
	get salaryCurrencySelect(): Locator {
		return this.page.getByTestId('salary-currency-select')
	}

	// Submit Button

	/**
	 * Submit/Continue to payment button
	 */
	get submitButton(): Locator {
		return this.page.getByTestId('submit-job-button')
	}

	// Actions

	/**
	 * Select a pricing tier
	 * @param tierName - 'basic', 'featured', or 'premium'
	 */
	async selectTier(tierName: 'basic' | 'featured' | 'premium'): Promise<void> {
		await this.tierButton(tierName).click()
	}

	/**
	 * Fill company information section
	 */
	async fillCompanyInfo(data: {
		companyName: string
		employerEmail: string
		companyWebsite?: string
	}): Promise<void> {
		await this.companyNameInput.fill(data.companyName)
		await this.employerEmailInput.fill(data.employerEmail)
		if (data.companyWebsite) {
			await this.companyWebsiteInput.fill(data.companyWebsite)
		}
	}

	/**
	 * Fill job details section
	 */
	async fillJobDetails(data: {
		title: string
		description: string
		body?: string
		positionType: string
		seniorityLevel: string
	}): Promise<void> {
		await this.jobTitleInput.fill(data.title)
		await this.jobDescriptionInput.fill(data.description)
		if (data.body) {
			await this.jobBodyInput.fill(data.body)
		}
		await this.positionTypeSelect.selectOption(data.positionType)
		await this.seniorityLevelSelect.selectOption(data.seniorityLevel)
	}

	/**
	 * Fill location section
	 */
	async fillLocation(data: {
		remoteStatus: string
		location?: string
		remoteRestrictions?: string
	}): Promise<void> {
		await this.remoteStatusSelect.selectOption(data.remoteStatus)
		if (data.location) {
			await this.locationInput.fill(data.location)
		}
		if (data.remoteRestrictions) {
			await this.remoteRestrictionsInput.fill(data.remoteRestrictions)
		}
	}

	/**
	 * Fill salary section
	 */
	async fillSalary(data: {
		min?: string
		max?: string
		currency?: string
	}): Promise<void> {
		if (data.min) {
			await this.salaryMinInput.fill(data.min)
		}
		if (data.max) {
			await this.salaryMaxInput.fill(data.max)
		}
		if (data.currency) {
			await this.salaryCurrencySelect.selectOption(data.currency)
		}
	}

	/**
	 * Click submit/continue to payment button
	 */
	async clickSubmit(): Promise<void> {
		await this.submitButton.click()
	}

	/**
	 * Fill entire job submission form
	 */
	async fillCompleteForm(data: {
		tier: 'basic' | 'featured' | 'premium'
		company: {
			companyName: string
			employerEmail: string
			companyWebsite?: string
		}
		job: {
			title: string
			description: string
			body?: string
			positionType: string
			seniorityLevel: string
		}
		location: {
			remoteStatus: string
			location?: string
			remoteRestrictions?: string
		}
		salary?: {
			min?: string
			max?: string
			currency?: string
		}
	}): Promise<void> {
		await this.selectTier(data.tier)
		await this.fillCompanyInfo(data.company)
		await this.fillJobDetails(data.job)
		await this.fillLocation(data.location)
		if (data.salary) {
			await this.fillSalary(data.salary)
		}
	}

	// Assertions

	/**
	 * Verify page loaded correctly
	 */
	async expectPageLoaded(): Promise<void> {
		await expect(this.page).toHaveTitle(/Post a Job/)
		await expect(this.pricingTiers).toBeVisible()
		await expect(this.submitButton).toBeVisible()
	}

	/**
	 * Verify all pricing tiers are displayed
	 */
	async expectAllTiersVisible(): Promise<void> {
		await expect(this.tierButton('basic')).toBeVisible()
		await expect(this.tierButton('featured')).toBeVisible()
		await expect(this.tierButton('premium')).toBeVisible()
	}

	/**
	 * Verify a specific tier is selected
	 * @param tierName - Expected selected tier
	 */
	async expectTierSelected(tierName: 'basic' | 'featured' | 'premium'): Promise<void> {
		const tierButton = this.tierButton(tierName)
		// Selected tier has specific styling with orange border
		await expect(tierButton).toHaveClass(/border-orange-500/)
	}

	/**
	 * Verify form validation errors are shown
	 */
	async expectValidationErrors(): Promise<void> {
		// Form validation errors would show up as error messages
		// This is a generic check - specific errors can be checked individually
		const errorMessages = this.page.locator('[class*="text-red"]')
		const count = await errorMessages.count()
		expect(count).toBeGreaterThan(0)
	}

	/**
	 * Verify company name input has error
	 */
	async expectCompanyNameError(): Promise<void> {
		const input = this.companyNameInput
		const container = input.locator('..')
		await expect(container.locator('[class*="text-red"]')).toBeVisible()
	}

	/**
	 * Verify job title input has error
	 */
	async expectJobTitleError(): Promise<void> {
		const input = this.jobTitleInput
		const container = input.locator('..')
		await expect(container.locator('[class*="text-red"]')).toBeVisible()
	}

	/**
	 * Verify form can be submitted (button is enabled)
	 */
	async expectCanSubmit(): Promise<void> {
		await expect(this.submitButton).toBeEnabled()
	}
}
