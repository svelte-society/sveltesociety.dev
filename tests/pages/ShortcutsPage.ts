import type { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

export class ShortcutsPage extends BasePage {
	readonly addShortcutButton: Locator
	readonly shortcutsTable: Locator
	readonly shortcutRows: Locator
	readonly shortcutTitles: Locator
	readonly shortcutStatuses: Locator
	readonly noShortcutsMessage: Locator
	readonly editButtons: Locator
	readonly toggleButtons: Locator
	readonly deleteButtons: Locator

	readonly contentSelect: Locator
	readonly labelInput: Locator
	readonly priorityInput: Locator
	readonly isActiveCheckbox: Locator
	readonly submitButton: Locator

	constructor(page: Page) {
		super(page)

		this.addShortcutButton = page.getByTestId('add-shortcut-button')
		this.shortcutsTable = page.getByTestId('shortcuts-table')
		this.shortcutRows = page.getByTestId('shortcuts-table-row')
		this.shortcutTitles = page.getByTestId('shortcut-title')
		this.shortcutStatuses = page.getByTestId('shortcut-status')
		this.noShortcutsMessage = page.getByTestId('shortcuts-table-empty')
		this.editButtons = page.getByTestId('edit-button')
		this.toggleButtons = page.getByTestId('toggle-button')
		this.deleteButtons = page.getByTestId('delete-button')

		this.contentSelect = page.getByTestId('select-content_id')
		this.labelInput = page.getByTestId('input-label')
		this.priorityInput = page.getByTestId('input-priority')
		this.isActiveCheckbox = page.getByTestId('checkbox-is_active')
		this.submitButton = page.getByTestId('submit-shortcut-button')
	}

	async gotoList(): Promise<void> {
		await this.page.goto('/admin/shortcuts')
	}

	async gotoNew(): Promise<void> {
		await this.page.goto('/admin/shortcuts/new')
		// Wait for the form to be ready
		await this.contentSelect.waitFor({ state: 'visible' })
	}

	async gotoEdit(id: string): Promise<void> {
		await this.page.goto(`/admin/shortcuts/${id}`)
	}

	async clickAddShortcut(): Promise<void> {
		await this.addShortcutButton.click()
	}

	async getShortcutCount(): Promise<number> {
		return await this.shortcutRows.count()
	}

	async getShortcutTitles(): Promise<string[]> {
		return await this.shortcutTitles.allTextContents()
	}

	async selectContent(labelText: string): Promise<void> {
		await this.contentSelect.click()
		await this.page.getByRole('option', { name: labelText }).click()
	}

	async setPriority(priority: number): Promise<void> {
		await this.priorityInput.fill(priority.toString())
	}

	async setLabel(label: string): Promise<void> {
		await this.labelInput.fill(label)
	}

	async submitForm(): Promise<void> {
		await this.submitButton.click()
		// Wait for navigation to complete after form submission
		await this.page.waitForLoadState('domcontentloaded')
	}

	async toggleFirstShortcut(): Promise<void> {
		await this.toggleButtons.first().click()
	}

	async deleteFirstShortcut(): Promise<void> {
		await this.deleteButtons.first().click()
		// Wait for confirmation modal and click confirm button (scoped to open dialog)
		await this.page.locator('dialog[open]').getByTestId('confirm-delete-button').click()
	}

	async getFirstShortcutStatus(): Promise<string> {
		const text = await this.shortcutStatuses.first().textContent()
		return text?.trim() || ''
	}

	async isEmptyStateVisible(): Promise<boolean> {
		return await this.noShortcutsMessage.isVisible()
	}

	async expectListPage(): Promise<void> {
		await this.page.waitForURL('/admin/shortcuts')
		// Wait for either the table or empty state to be visible
		await Promise.race([
			this.shortcutsTable.waitFor({ state: 'visible' }),
			this.noShortcutsMessage.waitFor({ state: 'visible' })
		])
	}
}
