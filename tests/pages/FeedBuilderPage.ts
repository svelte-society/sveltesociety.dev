import type { Page, Locator } from '@playwright/test'
import { expect } from '@playwright/test'
import { BasePage } from './BasePage'

export class FeedBuilderPage extends BasePage {
	readonly addFeedItemButton: Locator
	readonly feedItemsTable: Locator
	readonly feedItemRows: Locator
	readonly feedItemTitles: Locator
	readonly feedItemStatuses: Locator
	readonly noFeedItemsMessage: Locator
	readonly editButtons: Locator
	readonly toggleButtons: Locator
	readonly deleteButtons: Locator

	readonly itemTypeSelect: Locator
	readonly contentIdSelect: Locator
	readonly titleInput: Locator
	readonly descriptionTextarea: Locator
	readonly buttonTextInput: Locator
	readonly buttonHrefInput: Locator
	readonly positionTypeSelect: Locator
	readonly positionFixedInput: Locator
	readonly positionRangeMinInput: Locator
	readonly positionRangeMaxInput: Locator
	readonly startDateInput: Locator
	readonly endDateInput: Locator
	readonly priorityInput: Locator
	readonly isActiveCheckbox: Locator
	readonly submitButton: Locator
	readonly cancelButton: Locator
	readonly contentModeCustomRadio: Locator
	readonly contentModeContentRadio: Locator

	constructor(page: Page) {
		super(page)

		// List page elements
		this.addFeedItemButton = page.locator('a[href="/admin/feed-builder/new"]')
		this.feedItemsTable = page.getByTestId('feed-items-table')
		this.feedItemRows = page.locator('[data-testid="feed-items-table"] tbody tr')
		this.feedItemTitles = page.locator('[data-testid="feed-items-table"] tbody tr td:first-child')
		this.feedItemStatuses = page.locator(
			'[data-testid="feed-items-table"] tbody tr td:last-child span'
		)
		this.noFeedItemsMessage = page.getByTestId('feed-items-table-empty')
		this.editButtons = page.getByTestId('edit-button')
		this.toggleButtons = page.getByTestId('toggle-button')
		this.deleteButtons = page.getByTestId('delete-button')

		// Form elements
		this.itemTypeSelect = page.getByTestId('select-item_type')
		this.contentIdSelect = page.getByTestId('select-content_id')
		this.titleInput = page.getByTestId('input-title')
		this.descriptionTextarea = page.getByTestId('textarea-description')
		this.buttonTextInput = page.getByTestId('input-button_text')
		this.buttonHrefInput = page.getByTestId('input-button_href')
		this.positionTypeSelect = page.getByTestId('select-position_type')
		this.positionFixedInput = page.getByTestId('input-position_fixed')
		this.positionRangeMinInput = page.getByTestId('input-position_range_min')
		this.positionRangeMaxInput = page.getByTestId('input-position_range_max')
		this.startDateInput = page.getByTestId('input-start_date')
		this.endDateInput = page.getByTestId('input-end_date')
		this.priorityInput = page.getByTestId('input-priority')
		this.isActiveCheckbox = page.getByTestId('checkbox-is_active')
		this.submitButton = page.locator('button[type="submit"]')
		this.cancelButton = page.locator('a[href="/admin/feed-builder"]').last()
		this.contentModeCustomRadio = page.locator('#content_mode_custom')
		this.contentModeContentRadio = page.locator('#content_mode_content')
	}

	async gotoList(): Promise<void> {
		await this.page.goto('/admin/feed-builder')
	}

	async gotoNew(): Promise<void> {
		await this.page.goto('/admin/feed-builder/new')
		// Wait for the form to be ready
		await this.itemTypeSelect.waitFor({ state: 'visible' })
	}

	async gotoEdit(id: string): Promise<void> {
		await this.page.goto(`/admin/feed-builder/${id}`)
	}

	async clickAddFeedItem(): Promise<void> {
		await this.addFeedItemButton.click()
	}

	async getFeedItemCount(): Promise<number> {
		return await this.feedItemRows.count()
	}

	async setItemType(type: 'cta' | 'ad' | 'featured'): Promise<void> {
		await this.itemTypeSelect.selectOption(type)
	}

	async setTitle(title: string): Promise<void> {
		await this.titleInput.fill(title)
	}

	async setDescription(description: string): Promise<void> {
		await this.descriptionTextarea.fill(description)
	}

	async setButtonText(text: string): Promise<void> {
		await this.buttonTextInput.fill(text)
	}

	async setButtonHref(href: string): Promise<void> {
		await this.buttonHrefInput.fill(href)
	}

	async setPositionType(type: 'fixed' | 'random'): Promise<void> {
		await this.positionTypeSelect.selectOption(type)
	}

	async setPriority(priority: number): Promise<void> {
		await this.priorityInput.fill(priority.toString())
	}

	async submitForm(): Promise<void> {
		await this.submitButton.click()
		// Wait for navigation to complete after form submission
		await this.page.waitForLoadState('domcontentloaded')
	}

	async toggleFirstFeedItem(): Promise<void> {
		await this.toggleButtons.first().click()
	}

	async deleteFirstFeedItem(): Promise<void> {
		await this.deleteButtons.first().click()
		// Wait for confirmation modal and click confirm button (scoped to open dialog)
		await this.page.locator('dialog[open]').getByTestId('confirm-delete-button').click()
	}

	async getFirstFeedItemStatus(): Promise<string> {
		const text = await this.feedItemStatuses.first().textContent()
		return text?.trim() || ''
	}

	async isEmptyStateVisible(): Promise<boolean> {
		return await this.noFeedItemsMessage.isVisible()
	}

	async expectListPage(): Promise<void> {
		await this.page.waitForURL('/admin/feed-builder')
		// Wait for either the table or empty state to be visible using polling
		// This is more reliable than Promise.race as it properly verifies the state
		await expect(async () => {
			const tableVisible = await this.feedItemsTable.isVisible()
			const emptyVisible = await this.noFeedItemsMessage.isVisible()
			expect(tableVisible || emptyVisible).toBeTruthy()
		}).toPass({ timeout: 10000 })
	}

	async fillCustomCTAForm(data: {
		title: string
		description: string
		buttonText: string
		buttonHref: string
		priority?: number
	}): Promise<void> {
		await this.setItemType('cta')
		await this.setTitle(data.title)
		await this.setDescription(data.description)
		await this.setButtonText(data.buttonText)
		await this.setButtonHref(data.buttonHref)
		if (data.priority !== undefined) {
			await this.setPriority(data.priority)
		}
	}

	async setContentMode(mode: 'custom' | 'content'): Promise<void> {
		if (mode === 'content') {
			await this.contentModeContentRadio.click()
		} else {
			await this.contentModeCustomRadio.click()
		}
	}

	async selectContent(index: number = 1): Promise<void> {
		// Select the first non-empty option (index 0 is "Select content to feature")
		const options = await this.contentIdSelect.locator('option').all()
		if (options.length > index) {
			const value = await options[index].getAttribute('value')
			if (value) {
				await this.contentIdSelect.selectOption(value)
			}
		}
	}

	async fillFeaturedContentForm(data: { priority?: number } = {}): Promise<void> {
		await this.setItemType('featured')
		await this.setContentMode('content')
		await this.selectContent()
		if (data.priority !== undefined) {
			await this.setPriority(data.priority)
		}
	}

	// ========== SPONSOR-SPECIFIC METHODS ==========

	/**
	 * Get all rows that have type "SPONSOR"
	 */
	get sponsorRows(): Locator {
		return this.feedItemRows.filter({ hasText: 'SPONSOR' })
	}

	/**
	 * Get all "Auto-managed" labels in the table
	 */
	get autoManagedLabels(): Locator {
		return this.page.locator('text=(Auto-managed)')
	}

	/**
	 * Get all "Managed via Sponsors" text elements
	 */
	get managedViaSponsorText(): Locator {
		return this.page.locator('text=Managed via Sponsors')
	}

	/**
	 * Get count of sponsor feed items
	 */
	async getSponsorFeedItemCount(): Promise<number> {
		return await this.sponsorRows.count()
	}

	/**
	 * Check if a sponsor row has the "(Auto-managed)" label
	 */
	async sponsorRowHasAutoManagedLabel(index: number = 0): Promise<boolean> {
		const row = this.sponsorRows.nth(index)
		const label = row.locator('text=(Auto-managed)')
		return await label.isVisible()
	}

	/**
	 * Check if a sponsor row has "Managed via Sponsors" instead of edit/delete buttons
	 */
	async sponsorRowHasManagedViaText(index: number = 0): Promise<boolean> {
		const row = this.sponsorRows.nth(index)
		const text = row.locator('text=Managed via Sponsors')
		return await text.isVisible()
	}

	/**
	 * Get the title/company name of a sponsor feed item
	 */
	async getSponsorFeedItemTitle(index: number = 0): Promise<string> {
		const row = this.sponsorRows.nth(index)
		const titleCell = row.locator('td').first()
		const text = await titleCell.textContent()
		// Remove the "(Auto-managed)" suffix if present
		return text?.replace('(Auto-managed)', '').trim() || ''
	}

	/**
	 * Check if sponsor rows don't have edit buttons
	 */
	async expectSponsorRowsHaveNoEditButtons(): Promise<void> {
		const sponsorCount = await this.getSponsorFeedItemCount()
		for (let i = 0; i < sponsorCount; i++) {
			const row = this.sponsorRows.nth(i)
			const editBtn = row.getByTestId('edit-button')
			const editCount = await editBtn.count()
			expect(editCount).toBe(0)
		}
	}

	/**
	 * Check if sponsor rows don't have delete buttons
	 */
	async expectSponsorRowsHaveNoDeleteButtons(): Promise<void> {
		const sponsorCount = await this.getSponsorFeedItemCount()
		for (let i = 0; i < sponsorCount; i++) {
			const row = this.sponsorRows.nth(i)
			const deleteBtn = row.getByTestId('delete-button')
			const deleteCount = await deleteBtn.count()
			expect(deleteCount).toBe(0)
		}
	}

	/**
	 * Expect sponsor feed items to be displayed with auto-managed UI
	 */
	async expectSponsorFeedItemsDisplayed(): Promise<void> {
		const count = await this.getSponsorFeedItemCount()
		expect(count).toBeGreaterThan(0)
	}
}
