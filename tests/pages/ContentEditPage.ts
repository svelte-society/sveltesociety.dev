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
	readonly submitButton: Locator
	readonly cancelButton: Locator

	constructor(page: Page) {
		super(page)
		this.pageHeading = page.getByRole('heading', { name: 'Edit Content', level: 1 })
		this.titleInput = page.getByTestId('input-title')
		this.slugInput = page.getByTestId('input-slug')
		this.descriptionTextarea = page.getByTestId('textarea-description')
		this.bodyTextarea = page.getByTestId('markdown-editor-body')
		this.typeSelect = page.getByTestId('select-type')
		this.statusSelect = page.getByTestId('category-selector-status')
		this.submitButton = page.getByRole('button', { name: 'Update Content' })
		this.cancelButton = page.getByRole('link', { name: 'Cancel' })
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
		// CategorySelector uses radio buttons wrapped in clickable Labels
		const statusOption = this.page.getByTestId(`category-selector-status-${status}`)
		await expect(statusOption).toBeVisible()
		// Get the radio input and use dispatchEvent to trigger Svelte's binding
		const radioInput = statusOption.locator('input[type="radio"]')
		await radioInput.evaluate((el: HTMLInputElement) => {
			el.checked = true
			el.dispatchEvent(new Event('change', { bubbles: true }))
		})
	}

	/**
	 * Get the current status from the form
	 */
	async getCurrentStatus(): Promise<string> {
		// Check which radio button is currently checked
		const draftRadio = this.page.getByTestId('category-selector-status-draft').locator('input')
		const publishedRadio = this.page
			.getByTestId('category-selector-status-published')
			.locator('input')
		const archivedRadio = this.page
			.getByTestId('category-selector-status-archived')
			.locator('input')

		if (await draftRadio.isChecked()) return 'draft'
		if (await publishedRadio.isChecked()) return 'published'
		if (await archivedRadio.isChecked()) return 'archived'

		return ''
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
		const successToast = this.page.getByText('Content updated successfully')
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

		// Click the confirm delete button in the dialog
		const confirmButton = this.page.getByRole('button', { name: 'Delete' })
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
}
