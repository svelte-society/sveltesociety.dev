import type { Locator } from '@playwright/test'
import { expect } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * AdminSponsorsPage - Page Object Model for admin sponsor management
 *
 * Represents the admin sponsors page at /admin/sponsors for managing
 * sponsor subscriptions and profiles.
 *
 * Provides methods for:
 * - Viewing sponsors list
 * - Filtering by status
 * - Searching sponsors
 * - Activating, pausing, and cancelling sponsors
 * - Editing sponsor details
 *
 * @example
 * const adminSponsorsPage = new AdminSponsorsPage(page)
 * await adminSponsorsPage.goto()
 * await adminSponsorsPage.expectSponsorsDisplayed()
 */
export class AdminSponsorsPage extends BasePage {
	/**
	 * Navigate to the admin sponsors list page
	 */
	async goto(): Promise<void> {
		await this.page.goto('/admin/sponsors')
	}

	/**
	 * Navigate to a specific sponsor's edit page
	 * @param sponsorId - The ID of the sponsor
	 */
	async gotoEdit(sponsorId: string): Promise<void> {
		await this.page.goto(`/admin/sponsors/${sponsorId}`)
	}

	// List Page Selectors

	/**
	 * Search input field
	 */
	get searchInput(): Locator {
		return this.page.locator('input[placeholder*="Search sponsors"]')
	}

	/**
	 * Status filter select
	 */
	get statusSelect(): Locator {
		return this.page.getByTestId('select-status')
	}

	/**
	 * Sponsors table
	 */
	get sponsorsTable(): Locator {
		return this.page.locator('table')
	}

	/**
	 * Table rows (sponsor entries)
	 */
	get tableRows(): Locator {
		return this.sponsorsTable.locator('tbody tr')
	}

	/**
	 * Empty message when no sponsors found
	 */
	get emptyMessage(): Locator {
		return this.page.locator('text=No sponsors found')
	}

	// Edit Page Selectors

	/**
	 * Company name input on edit page
	 */
	get companyNameInput(): Locator {
		return this.page.getByTestId('input-company_name')
	}

	/**
	 * Tagline textarea on edit page
	 */
	get taglineTextarea(): Locator {
		return this.page.getByTestId('textarea-tagline')
	}

	/**
	 * Website URL input on edit page
	 */
	get websiteUrlInput(): Locator {
		return this.page.getByTestId('input-website_url')
	}

	/**
	 * Discount code input on edit page
	 */
	get discountCodeInput(): Locator {
		return this.page.getByTestId('input-discount_code')
	}

	/**
	 * Discount description input on edit page
	 */
	get discountDescriptionInput(): Locator {
		return this.page.getByTestId('input-discount_description')
	}

	/**
	 * Status select on edit page
	 */
	get statusSelectEdit(): Locator {
		return this.page.getByTestId('select-status')
	}

	/**
	 * Save changes button on edit page
	 */
	get saveButton(): Locator {
		return this.page.getByRole('button', { name: /Save Changes/i })
	}

	/**
	 * Back to sponsors link on edit page
	 */
	get backLink(): Locator {
		return this.page.locator('a', { hasText: 'Back to Sponsors' })
	}

	// Action Buttons

	/**
	 * Activate sponsor button in row actions
	 */
	activateButton(rowIndex: number): Locator {
		return this.tableRows.nth(rowIndex).getByTestId('activate-sponsor-button')
	}

	/**
	 * Pause sponsor button in row actions
	 */
	pauseButton(rowIndex: number): Locator {
		return this.tableRows.nth(rowIndex).getByTestId('pause-sponsor-button')
	}

	/**
	 * Reactivate sponsor button in row actions
	 */
	reactivateButton(rowIndex: number): Locator {
		return this.tableRows.nth(rowIndex).getByTestId('reactivate-sponsor-button')
	}

	/**
	 * Cancel sponsor button in row actions
	 */
	cancelButton(rowIndex: number): Locator {
		return this.tableRows.nth(rowIndex).getByTestId('cancel-sponsor-button')
	}

	/**
	 * Edit button in row actions
	 */
	editButton(rowIndex: number): Locator {
		return this.tableRows.nth(rowIndex).getByTestId('edit-button')
	}

	// Quick action buttons on edit page

	/**
	 * Activate sponsor button on edit page
	 */
	get activateSponsorButton(): Locator {
		return this.page.getByRole('button', { name: /Activate Sponsor/i })
	}

	/**
	 * Pause sponsor button on edit page
	 */
	get pauseSponsorButton(): Locator {
		return this.page.getByRole('button', { name: /Pause Sponsor/i })
	}

	/**
	 * Reactivate sponsor button on edit page
	 */
	get reactivateSponsorButton(): Locator {
		return this.page.getByRole('button', { name: /Reactivate Sponsor/i })
	}

	/**
	 * Cancel sponsor button on edit page
	 */
	get cancelSponsorButton(): Locator {
		return this.page.getByRole('button', { name: /Cancel Sponsor/i })
	}

	// Actions

	/**
	 * Search for sponsors by query
	 * @param query - Search query
	 */
	async search(query: string): Promise<void> {
		await this.searchInput.fill(query)
		// Wait for debounce
		await this.page.waitForTimeout(400)
	}

	/**
	 * Filter sponsors by status
	 * @param status - Status to filter by
	 */
	async filterByStatus(
		status: 'all' | 'pending' | 'active' | 'paused' | 'expired' | 'cancelled'
	): Promise<void> {
		await this.statusSelect.selectOption(status)
	}

	/**
	 * Click edit button for a row
	 * @param rowIndex - Row index (0-based)
	 */
	async clickEdit(rowIndex: number): Promise<void> {
		await this.editButton(rowIndex).click()
	}

	/**
	 * Click activate button for a row
	 * @param rowIndex - Row index (0-based)
	 */
	async clickActivate(rowIndex: number): Promise<void> {
		await this.activateButton(rowIndex).click()
	}

	/**
	 * Click pause button for a row
	 * @param rowIndex - Row index (0-based)
	 */
	async clickPause(rowIndex: number): Promise<void> {
		await this.pauseButton(rowIndex).click()
	}

	/**
	 * Click cancel button for a row
	 * @param rowIndex - Row index (0-based)
	 */
	async clickCancel(rowIndex: number): Promise<void> {
		await this.cancelButton(rowIndex).click()
	}

	/**
	 * Update sponsor details on edit page
	 */
	async updateSponsorDetails(data: {
		companyName?: string
		tagline?: string
		websiteUrl?: string
		discountCode?: string
		discountDescription?: string
	}): Promise<void> {
		if (data.companyName !== undefined) {
			await this.companyNameInput.fill(data.companyName)
		}
		if (data.tagline !== undefined) {
			await this.taglineTextarea.fill(data.tagline)
		}
		if (data.websiteUrl !== undefined) {
			await this.websiteUrlInput.fill(data.websiteUrl)
		}
		if (data.discountCode !== undefined) {
			await this.discountCodeInput.fill(data.discountCode)
		}
		if (data.discountDescription !== undefined) {
			await this.discountDescriptionInput.fill(data.discountDescription)
		}
		await this.saveButton.click()
	}

	// Getters

	/**
	 * Get number of sponsors displayed
	 * @returns Number of rows in the table
	 */
	async getSponsorCount(): Promise<number> {
		return await this.tableRows.count()
	}

	/**
	 * Get company names of all displayed sponsors
	 * @returns Array of company names
	 */
	async getCompanyNames(): Promise<string[]> {
		const names: string[] = []
		const count = await this.tableRows.count()
		for (let i = 0; i < count; i++) {
			const nameCell = this.tableRows.nth(i).locator('td').first()
			const name = await nameCell.locator('.font-medium').textContent()
			if (name) names.push(name.trim())
		}
		return names
	}

	/**
	 * Get status badge text for a row
	 * @param rowIndex - Row index (0-based)
	 * @returns Status text
	 */
	async getStatusForRow(rowIndex: number): Promise<string> {
		const statusCell = this.tableRows.nth(rowIndex).locator('[class*="badge"]')
		const text = await statusCell.textContent()
		return text?.trim() ?? ''
	}

	// Assertions

	/**
	 * Verify sponsors list page loaded
	 */
	async expectPageLoaded(): Promise<void> {
		await expect(this.page.getByRole('heading', { name: 'Sponsors' })).toBeVisible()
		await expect(this.searchInput).toBeVisible()
		await expect(this.statusSelect).toBeVisible()
	}

	/**
	 * Verify sponsors are displayed in the table
	 */
	async expectSponsorsDisplayed(): Promise<void> {
		const count = await this.getSponsorCount()
		expect(count).toBeGreaterThan(0)
	}

	/**
	 * Verify no sponsors found message is displayed
	 */
	async expectNoSponsors(): Promise<void> {
		await expect(this.emptyMessage).toBeVisible()
	}

	/**
	 * Verify a sponsor with specific company name is in the list
	 * @param companyName - Expected company name
	 */
	async expectSponsorWithCompanyName(companyName: string): Promise<void> {
		const names = await this.getCompanyNames()
		expect(names).toContain(companyName)
	}

	/**
	 * Verify edit page loaded for a sponsor
	 */
	async expectEditPageLoaded(): Promise<void> {
		await expect(this.page.getByRole('heading', { name: 'Edit Sponsor' })).toBeVisible()
		await expect(this.companyNameInput).toBeVisible()
		await expect(this.saveButton).toBeVisible()
	}

	/**
	 * Verify URL contains status filter
	 * @param status - Expected status in URL
	 */
	async expectUrlHasStatus(status: string): Promise<void> {
		await expect(this.page).toHaveURL(new RegExp(`status=${status}`))
	}
}
