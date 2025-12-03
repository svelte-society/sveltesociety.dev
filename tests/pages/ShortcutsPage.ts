import type { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * Page Object Model for the Sidebar Shortcuts admin pages
 * Handles the list view (/admin/shortcuts), new form (/admin/shortcuts/new),
 * and edit form (/admin/shortcuts/[id])
 */
export class ShortcutsPage extends BasePage {
	// List view selectors
	readonly addShortcutButton: Locator
	readonly shortcutsTable: Locator
	readonly shortcutRows: Locator
	readonly shortcutTitles: Locator
	readonly shortcutStatuses: Locator
	readonly noShortcutsMessage: Locator
	readonly editButtons: Locator
	readonly toggleButtons: Locator
	readonly deleteButtons: Locator

	// Form selectors
	readonly contentSelect: Locator
	readonly labelInput: Locator
	readonly priorityInput: Locator
	readonly isActiveCheckbox: Locator
	readonly submitButton: Locator

	constructor(page: Page) {
		super(page)

		// List view
		this.addShortcutButton = page.getByTestId('add-shortcut-button')
		this.shortcutsTable = page.getByTestId('shortcuts-table')
		this.shortcutRows = page.getByTestId('shortcut-row')
		this.shortcutTitles = page.getByTestId('shortcut-title')
		this.shortcutStatuses = page.getByTestId('shortcut-status')
		this.noShortcutsMessage = page.getByTestId('no-shortcuts-message')
		this.editButtons = page.getByTestId('edit-shortcut-button')
		this.toggleButtons = page.getByTestId('toggle-shortcut-button')
		this.deleteButtons = page.getByTestId('delete-shortcut-button')

		// Form
		this.contentSelect = page.getByTestId('select-content_id')
		this.labelInput = page.getByTestId('input-label')
		this.priorityInput = page.getByTestId('input-priority')
		this.isActiveCheckbox = page.getByTestId('checkbox-is_active')
		this.submitButton = page.getByTestId('submit-shortcut-button')
	}

	/**
	 * Navigate to the shortcuts list page
	 */
	async gotoList(): Promise<void> {
		await this.page.goto('/admin/shortcuts')
	}

	/**
	 * Navigate to the new shortcut form
	 */
	async gotoNew(): Promise<void> {
		await this.page.goto('/admin/shortcuts/new')
	}

	/**
	 * Navigate to edit a specific shortcut
	 */
	async gotoEdit(id: string): Promise<void> {
		await this.page.goto(`/admin/shortcuts/${id}`)
	}

	/**
	 * Click the add shortcut button
	 */
	async clickAddShortcut(): Promise<void> {
		await this.addShortcutButton.click()
	}

	/**
	 * Get the count of shortcuts in the table
	 */
	async getShortcutCount(): Promise<number> {
		return await this.shortcutRows.count()
	}

	/**
	 * Get all shortcut titles from the table
	 */
	async getShortcutTitles(): Promise<string[]> {
		return await this.shortcutTitles.allTextContents()
	}

	/**
	 * Select content by visible label text
	 */
	async selectContent(labelText: string): Promise<void> {
		await this.contentSelect.click()
		await this.page.getByRole('option', { name: labelText }).click()
	}

	/**
	 * Set the priority value
	 */
	async setPriority(priority: number): Promise<void> {
		await this.priorityInput.fill(priority.toString())
	}

	/**
	 * Set the label value
	 */
	async setLabel(label: string): Promise<void> {
		await this.labelInput.fill(label)
	}

	/**
	 * Submit the form
	 */
	async submitForm(): Promise<void> {
		await this.submitButton.click()
	}

	/**
	 * Toggle the first shortcut's status
	 */
	async toggleFirstShortcut(): Promise<void> {
		await this.toggleButtons.first().click()
	}

	/**
	 * Delete the first shortcut (handles confirmation dialog)
	 */
	async deleteFirstShortcut(): Promise<void> {
		this.page.on('dialog', (dialog) => dialog.accept())
		await this.deleteButtons.first().click()
	}

	/**
	 * Get the status of the first shortcut
	 */
	async getFirstShortcutStatus(): Promise<string> {
		const text = await this.shortcutStatuses.first().textContent()
		return text?.trim() || ''
	}

	/**
	 * Check if empty state message is visible
	 */
	async isEmptyStateVisible(): Promise<boolean> {
		return await this.noShortcutsMessage.isVisible()
	}

	/**
	 * Wait for navigation to shortcuts list
	 */
	async expectListPage(): Promise<void> {
		await this.page.waitForURL('/admin/shortcuts')
	}
}
