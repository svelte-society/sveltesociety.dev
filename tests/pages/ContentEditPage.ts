import { type Page, type Locator, expect } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * Page Object Model for content editing and management
 * Handles editing content details and changing status (draft/published/archived)
 */
export class ContentEditPage extends BasePage {
	// Selectors
	readonly pageHeading: Locator
	readonly titleInput: Locator
	readonly slugInput: Locator
	readonly descriptionTextarea: Locator
	readonly bodyTextarea: Locator
	readonly typeSelect: Locator
	readonly statusSelect: Locator
	readonly statusSelectDropdown: Locator
	readonly submitButton: Locator
	readonly cancelButton: Locator
	readonly authorAutocomplete: Locator
	readonly authorSelect: Locator

	constructor(page: Page) {
		super(page)
		this.pageHeading = page.getByRole('heading', { name: 'Edit Content', level: 1 })
		this.titleInput = page.getByTestId('input-title')
		this.slugInput = page.getByTestId('input-slug')
		this.descriptionTextarea = page.getByTestId('textarea-description')
		this.bodyTextarea = page.getByTestId('markdown-editor-body')
		this.typeSelect = page.getByTestId('select-type')
		this.statusSelect = page.getByTestId('category-selector-status')
		this.statusSelectDropdown = page.getByTestId('select-status')
		this.submitButton = page.getByRole('button', { name: 'Update Content' })
		this.cancelButton = page.getByRole('link', { name: 'Cancel' })
		this.authorAutocomplete = page.getByTestId('autocomplete-author_id')
		this.authorSelect = page.getByTestId('select-author')
	}

	/**
	 * Navigate to the edit page for a specific content item
	 */
	async gotoEdit(contentId: string): Promise<void> {
		await this.goto(`/admin/content/${contentId}`)
		await expect(this.pageHeading).toBeVisible()
	}

	/**
	 * Edit the title of the content
	 */
	async editTitle(newTitle: string): Promise<void> {
		await this.titleInput.clear()
		await this.titleInput.fill(newTitle)
	}

	/**
	 * Edit the description of the content
	 */
	async editDescription(newDescription: string): Promise<void> {
		await this.descriptionTextarea.clear()
		await this.descriptionTextarea.fill(newDescription)
	}

	/**
	 * Change the status of the content (draft, published, archived)
	 */
	async changeStatus(status: 'draft' | 'published' | 'archived'): Promise<void> {
		await expect(this.statusSelectDropdown).toBeVisible()
		await this.statusSelectDropdown.selectOption(status)
	}

	/**
	 * Get the current status from the form
	 */
	async getCurrentStatus(): Promise<string> {
		return await this.statusSelectDropdown.inputValue()
	}

	/**
	 * Submit the edit form
	 */
	async submit(): Promise<void> {
		await this.submitButton.click()
	}

	/**
	 * Edit content and submit in one action
	 */
	async editAndSubmit(data: {
		title?: string
		description?: string
		status?: 'draft' | 'published' | 'archived'
	}): Promise<void> {
		if (data.title) {
			await this.editTitle(data.title)
		}
		if (data.description) {
			await this.editDescription(data.description)
		}
		if (data.status) {
			await this.changeStatus(data.status)
		}
		await this.submit()
	}

	/**
	 * Archive content (change status to archived and submit)
	 */
	async archiveContent(): Promise<void> {
		await this.changeStatus('archived')
		await this.submit()
	}

	/**
	 * Publish content (change status to published and submit)
	 */
	async publishContent(): Promise<void> {
		await this.changeStatus('published')
		await this.submit()
	}

	/**
	 * Unarchive content (change status back to draft)
	 */
	async unarchiveContent(): Promise<void> {
		await this.changeStatus('draft')
		await this.submit()
	}

	/**
	 * Expect success message after update
	 */
	async expectSuccessMessage(): Promise<void> {
		// SuperForms uses toast notifications (svelte-sonner)
		// Use .first() to handle cases where multiple toasts may appear
		const successToast = this.page.getByText('Content updated successfully').first()
		await expect(successToast).toBeVisible({ timeout: 5000 })
	}

	/**
	 * Verify the page is on edit mode
	 */
	async expectEditPageLoaded(): Promise<void> {
		// Wait for page heading first
		await expect(this.pageHeading).toBeVisible({ timeout: 10000 })
		// Then wait for form elements
		await expect(this.titleInput).toBeVisible({ timeout: 10000 })
		await expect(this.submitButton).toBeVisible()
	}

	/**
	 * Delete content (clicks delete button and confirms in dialog)
	 */
	async deleteContent(): Promise<void> {
		// Find and click the delete button (trash icon in Actions component)
		const deleteButton = this.page.getByRole('button', { name: /delete/i })
		await expect(deleteButton).toBeVisible()
		await deleteButton.click()

		// Wait for confirmation dialog to appear
		const confirmDialog = this.page.getByRole('heading', { name: /are you sure/i })
		await expect(confirmDialog).toBeVisible()

		// Click the confirm delete button in the dialog (scoped to open dialog)
		const confirmButton = this.page.locator('dialog[open]').getByRole('button', { name: 'Delete' })
		await expect(confirmButton).toBeVisible()
		await confirmButton.click()
	}

	/**
	 * Expect to be redirected to content list after deletion
	 */
	async expectRedirectToContentList(): Promise<void> {
		await this.page.waitForURL('/admin/content', { timeout: 10000 })
		const contentListHeading = this.page.getByRole('heading', { name: 'Content Management' })
		await expect(contentListHeading).toBeVisible()
	}

	/**
	 * Search for an author using the autocomplete (legacy - use selectAuthorByValue instead)
	 */
	async searchAuthor(_searchText: string): Promise<void> {
		// The author field is now a select dropdown, not an autocomplete
		// This method is kept for backwards compatibility but does nothing
		await expect(this.authorSelect).toBeVisible()
	}

	/**
	 * Select an author from the select dropdown by label text (partial match)
	 */
	async selectAuthor(authorLabel: string): Promise<void> {
		await expect(this.authorSelect).toBeVisible()
		// Find option that contains the search text
		const options = this.authorSelect.locator('option')
		const count = await options.count()
		for (let i = 0; i < count; i++) {
			const optionText = await options.nth(i).textContent()
			if (optionText?.toLowerCase().includes(authorLabel.toLowerCase())) {
				const optionValue = await options.nth(i).getAttribute('value')
				if (optionValue) {
					await this.authorSelect.selectOption(optionValue)
					return
				}
			}
		}
		throw new Error(`No option found matching "${authorLabel}"`)
	}

	/**
	 * Select an author by user ID
	 */
	async selectAuthorById(userId: string): Promise<void> {
		await expect(this.authorSelect).toBeVisible()
		await this.authorSelect.selectOption(userId)
	}

	/**
	 * Search and select an author in one action
	 */
	async changeAuthor(_searchText: string, authorLabel: string): Promise<void> {
		await this.selectAuthor(authorLabel)
	}

	/**
	 * Expect the author select dropdown to have options
	 */
	async expectAuthorResults(expectedCount?: number): Promise<void> {
		await expect(this.authorSelect).toBeVisible()
		const options = this.authorSelect.locator('option')
		if (expectedCount !== undefined) {
			await expect(options).toHaveCount(expectedCount)
		} else {
			// Expect at least one option beyond the placeholder
			const count = await options.count()
			expect(count).toBeGreaterThan(1)
		}
	}

	/**
	 * Expect no author results in the dropdown
	 */
	async expectNoAuthorResults(): Promise<void> {
		const options = this.authorSelect.locator('option')
		// Only the placeholder option should exist
		await expect(options).toHaveCount(1)
	}

	/**
	 * Get current author value from select
	 */
	async getCurrentAuthor(): Promise<string> {
		return await this.authorSelect.inputValue()
	}
}
