import type { Locator } from '@playwright/test'
import { expect } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * JobDetailPage - Page Object Model for individual job detail pages
 *
 * Represents the job detail page at /job/[slug] which displays
 * full job information and application functionality.
 *
 * Provides methods for:
 * - Viewing job details (title, company, description)
 * - Viewing job metadata (salary, location, position type)
 * - Applying for jobs (authenticated users)
 * - Checking application status
 *
 * @example
 * const jobDetailPage = new JobDetailPage(page)
 * await jobDetailPage.goto('senior-svelte-developer-acme')
 * await jobDetailPage.expectJobLoaded()
 */
export class JobDetailPage extends BasePage {
	/**
	 * Navigate to a specific job detail page
	 * @param slug - The job's URL slug
	 */
	async goto(slug: string): Promise<void> {
		await this.page.goto(`/job/${slug}`)
	}

	// Selectors

	/**
	 * The main job detail card container
	 */
	get jobDetailCard(): Locator {
		return this.page.getByTestId('job-detail-card')
	}

	/**
	 * Back to jobs link
	 */
	get backToJobsLink(): Locator {
		return this.page.getByTestId('back-to-jobs')
	}

	/**
	 * Job title heading
	 */
	get title(): Locator {
		return this.jobDetailCard.locator('h1')
	}

	/**
	 * Company name
	 */
	get companyName(): Locator {
		return this.jobDetailCard.locator('.font-medium.text-gray-700').first()
	}

	/**
	 * Company website link
	 */
	get companyWebsiteLink(): Locator {
		return this.jobDetailCard.locator('a[target="_blank"]').first()
	}

	/**
	 * Expired warning banner
	 */
	get expiredWarning(): Locator {
		return this.page.getByTestId('expired-warning')
	}

	/**
	 * Already applied message
	 */
	get alreadyAppliedMessage(): Locator {
		return this.page.getByTestId('already-applied')
	}

	/**
	 * Application name input
	 */
	get applicationNameInput(): Locator {
		return this.page.getByTestId('application-name')
	}

	/**
	 * Application email input
	 */
	get applicationEmailInput(): Locator {
		return this.page.getByTestId('application-email')
	}

	/**
	 * Application message textarea
	 */
	get applicationMessageInput(): Locator {
		return this.page.getByTestId('application-message')
	}

	/**
	 * Apply button
	 */
	get applyButton(): Locator {
		return this.page.getByTestId('apply-button')
	}

	/**
	 * Login to apply link (shown when not authenticated)
	 */
	get loginToApplyLink(): Locator {
		return this.page.getByTestId('login-to-apply')
	}

	/**
	 * Edit link (shown for admins)
	 */
	get editLink(): Locator {
		return this.page.getByTestId('edit-link')
	}

	// Actions

	/**
	 * Click back to jobs link
	 */
	async clickBackToJobs(): Promise<void> {
		await this.backToJobsLink.click()
	}

	/**
	 * Fill in application message
	 * @param message - Message to include with application
	 */
	async fillApplicationMessage(message: string): Promise<void> {
		await this.applicationMessageInput.fill(message)
	}

	/**
	 * Submit job application (ensures required name/email fields have values)
	 */
	async submitApplication(): Promise<void> {
		// Ensure name and email fields have values (they should be pre-filled from user profile)
		const nameValue = await this.applicationNameInput.inputValue()
		const emailValue = await this.applicationEmailInput.inputValue()

		// If not pre-filled (shouldn't happen with authenticated users), fill with defaults
		if (!nameValue) {
			await this.applicationNameInput.fill('Test User')
		}
		if (!emailValue) {
			await this.applicationEmailInput.fill('test@example.com')
		}

		await this.applyButton.click()
	}

	/**
	 * Apply with optional message
	 * @param message - Optional message to include
	 */
	async applyForJob(message?: string): Promise<void> {
		if (message) {
			await this.fillApplicationMessage(message)
		}
		await this.submitApplication()
	}

	/**
	 * Click login to apply link
	 */
	async clickLoginToApply(): Promise<void> {
		await this.loginToApplyLink.click()
	}

	// Getters

	/**
	 * Get the job title text
	 */
	async getTitle(): Promise<string> {
		const text = await this.title.textContent()
		// Strip any trailing "Edit" text for admin users
		return text?.replace(/\s*Edit\s*$/, '').trim() || ''
	}

	/**
	 * Get the company name text
	 */
	async getCompanyName(): Promise<string> {
		return (await this.companyName.textContent())?.trim() || ''
	}

	/**
	 * Check if job is expired
	 */
	async isExpired(): Promise<boolean> {
		return await this.expiredWarning.isVisible()
	}

	/**
	 * Check if user has already applied
	 */
	async hasAlreadyApplied(): Promise<boolean> {
		return await this.alreadyAppliedMessage.isVisible()
	}

	/**
	 * Check if application form is visible (authenticated, not applied, not expired)
	 */
	async canApply(): Promise<boolean> {
		return await this.applyButton.isVisible()
	}

	/**
	 * Check if login prompt is visible (unauthenticated)
	 */
	async requiresLogin(): Promise<boolean> {
		return await this.loginToApplyLink.isVisible()
	}

	// Assertions

	/**
	 * Verify job detail page loaded correctly
	 */
	async expectJobLoaded(): Promise<void> {
		await expect(this.jobDetailCard).toBeVisible()
		await expect(this.title).toBeVisible()
	}

	/**
	 * Verify job title matches expected
	 * @param expectedTitle - Expected job title
	 */
	async expectTitleIs(expectedTitle: string): Promise<void> {
		const title = await this.getTitle()
		expect(title).toBe(expectedTitle)
	}

	/**
	 * Verify company name matches expected
	 * @param expectedCompany - Expected company name
	 */
	async expectCompanyIs(expectedCompany: string): Promise<void> {
		const company = await this.getCompanyName()
		expect(company).toBe(expectedCompany)
	}

	/**
	 * Verify job is marked as expired
	 */
	async expectExpired(): Promise<void> {
		await expect(this.expiredWarning).toBeVisible()
	}

	/**
	 * Verify job is not expired
	 */
	async expectNotExpired(): Promise<void> {
		await expect(this.expiredWarning).not.toBeVisible()
	}

	/**
	 * Verify already applied message is shown
	 */
	async expectAlreadyApplied(): Promise<void> {
		await expect(this.alreadyAppliedMessage).toBeVisible()
	}

	/**
	 * Verify application form is available
	 */
	async expectCanApply(): Promise<void> {
		await expect(this.applyButton).toBeVisible()
		await expect(this.applicationNameInput).toBeVisible()
		await expect(this.applicationEmailInput).toBeVisible()
		await expect(this.applicationMessageInput).toBeVisible()
	}

	/**
	 * Verify login prompt is shown
	 */
	async expectLoginRequired(): Promise<void> {
		await expect(this.loginToApplyLink).toBeVisible()
		await expect(this.loginToApplyLink).toHaveAttribute('href', /\/login\?redirect=/)
	}

	/**
	 * Verify application was successful
	 */
	async expectApplicationSuccess(): Promise<void> {
		// After successful application, should show "already applied" message
		await expect(this.alreadyAppliedMessage).toBeVisible({ timeout: 5000 })
	}

	/**
	 * Verify back to jobs link is present
	 */
	async expectBackLinkVisible(): Promise<void> {
		await expect(this.backToJobsLink).toBeVisible()
		await expect(this.backToJobsLink).toHaveAttribute('href', '/?type=job')
	}

	/**
	 * Verify job metadata pills are visible
	 */
	async expectMetadataVisible(): Promise<void> {
		// Position type, seniority level, and remote status should always be visible
		const pills = this.jobDetailCard.locator('.rounded-full')
		await expect(pills.first()).toBeVisible()
	}
}
