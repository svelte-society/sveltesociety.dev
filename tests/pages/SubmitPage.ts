import type { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * Page Object Model for the Submit page
 */
export class SubmitPage extends BasePage {
	readonly submitHeading: Locator
	readonly submitButton: Locator
	readonly titleField: Locator
	readonly descriptionField: Locator
	readonly bodyField: Locator
	readonly urlField: Locator
	readonly githubRepoField: Locator
	readonly notesField: Locator
	readonly resourceTitleField: Locator
	readonly resourceLinkField: Locator
	readonly resourceImageUpload: Locator
	readonly resourceImageUploadSubmit: Locator
	readonly resourceImageUploadSuccess: Locator

	constructor(page: Page) {
		super(page)
		this.submitHeading = page.locator('h1')
		this.submitButton = page.locator('[data-testid="submit-button"]')

		// Form fields using test-ids
		this.titleField = page.locator('[data-testid="recipe-title-input"]')
		this.descriptionField = page.locator('[data-testid="description-textarea"]')
		this.bodyField = page.locator('[data-testid="recipe-body-editor"]')
		this.urlField = page.locator('[data-testid="video-url-input"]')
		this.githubRepoField = page.locator('[data-testid="library-github-input"]')
		this.notesField = page.locator('[data-testid="notes-textarea"]')
		this.resourceTitleField = page.locator('[data-testid="resource-title-input"]')
		this.resourceLinkField = page.locator('[data-testid="resource-link-input"]')
		this.resourceImageUpload = page.locator('[data-testid="resource-image-upload"]')
		this.resourceImageUploadSubmit = page.locator('[data-testid="resource-image-upload-submit"]')
		this.resourceImageUploadSuccess = page.locator('[data-testid="resource-image-upload-success"]')
	}

	async goto(): Promise<void> {
		await this.page.goto('/submit')
	}

	async expectSubmitHeading(): Promise<void> {
		await this.submitHeading.waitFor({ state: 'visible' })
	}

	async selectContentType(type: 'recipe' | 'video' | 'library' | 'resource'): Promise<void> {
		const typeLabels: Record<string, string> = {
			recipe: 'Recipe',
			video: 'Video',
			library: 'Library',
			resource: 'Resource'
		}
		// For native select, use selectOption
		await this.page.locator('[data-testid="content-type-selector"]').selectOption(type)
	}

	async fillRecipeForm(data: {
		title: string
		description: string
		body: string
		tags: string[]
		notes?: string
	}): Promise<void> {
		await this.selectContentType('recipe')
		await this.titleField.fill(data.title)
		await this.descriptionField.fill(data.description)
		await this.bodyField.fill(data.body)

		// Select tags using the Combobox component
		const tagsInput = this.page.locator('[data-testid="tags-selector"]')
		for (const tag of data.tags) {
			await tagsInput.click()
			await tagsInput.fill(tag)
			await this.page.locator(`[role="option"]:has-text("${tag}")`).first().click()
		}

		if (data.notes) {
			await this.notesField.fill(data.notes)
		}
	}

	async fillVideoForm(data: {
		url: string
		description: string
		tags: string[]
		notes?: string
	}): Promise<void> {
		await this.selectContentType('video')
		await this.urlField.fill(data.url)
		await this.descriptionField.fill(data.description)

		// Select tags using the Combobox component
		const tagsInput = this.page.locator('[data-testid="tags-selector"]')
		for (const tag of data.tags) {
			await tagsInput.click()
			await tagsInput.fill(tag)
			await this.page.locator(`[role="option"]:has-text("${tag}")`).first().click()
		}

		if (data.notes) {
			await this.notesField.fill(data.notes)
		}
	}

	async fillLibraryForm(data: {
		githubRepo: string
		description: string
		tags: string[]
		notes?: string
	}): Promise<void> {
		await this.selectContentType('library')
		await this.githubRepoField.fill(data.githubRepo)
		await this.descriptionField.fill(data.description)

		// Select tags using the Combobox component
		const tagsInput = this.page.locator('[data-testid="tags-selector"]')
		for (const tag of data.tags) {
			await tagsInput.click()
			await tagsInput.fill(tag)
			await this.page.locator(`[role="option"]:has-text("${tag}")`).first().click()
		}

		if (data.notes) {
			await this.notesField.fill(data.notes)
		}
	}

	async fillResourceForm(data: {
		title: string
		link: string
		description: string
		tags: string[]
		imagePath?: string
		notes?: string
	}): Promise<void> {
		await this.selectContentType('resource')
		await this.resourceTitleField.fill(data.title)
		await this.resourceLinkField.fill(data.link)
		await this.descriptionField.fill(data.description)

		if (data.imagePath) {
			await this.uploadResourceImage(data.imagePath)
		}

		// Select tags using the Combobox component
		const tagsInput = this.page.locator('[data-testid="tags-selector"]')
		for (const tag of data.tags) {
			await tagsInput.click()
			await tagsInput.fill(tag)
			await this.page.locator(`[role="option"]:has-text("${tag}")`).first().click()
		}

		if (data.notes) {
			await this.notesField.fill(data.notes)
		}
	}

	async uploadResourceImage(filePath: string): Promise<void> {
		// Use the input element inside the FileUpload component
		await this.page.locator('[data-testid="resource-image-upload-input"]').setInputFiles(filePath)
	}

	async uploadResourceImageAndSubmit(filePath: string): Promise<void> {
		await this.uploadResourceImage(filePath)
		await this.resourceImageUploadSubmit.click()
		await this.resourceImageUploadSuccess.waitFor({ state: 'visible', timeout: 30000 })
	}

	async expectImagePreview(): Promise<void> {
		// The FileUpload component shows a preview img when file is selected
		await this.page.locator('[data-testid="resource-image-upload"]').locator('img[alt="Preview"]').waitFor({ state: 'visible' })
	}

	async expectFileUploadError(message: string): Promise<void> {
		await this.page.locator(`[data-testid="resource-image-upload-error"]:has-text("${message}")`).waitFor({ state: 'visible' })
	}

	async submit(): Promise<void> {
		await this.submitButton.click()
	}

	async expectSuccessRedirect(): Promise<void> {
		await this.page.waitForURL('/submit/thankyou')
	}

	async expectValidationError(message: string): Promise<void> {
		await this.page.locator(`text=${message}`).waitFor({ state: 'visible' })
	}
}
