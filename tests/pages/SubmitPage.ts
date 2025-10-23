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
	}

	async goto(): Promise<void> {
		await this.page.goto('/submit')
	}

	async expectSubmitHeading(): Promise<void> {
		await this.submitHeading.waitFor({ state: 'visible' })
	}

	async selectContentType(type: 'recipe' | 'video' | 'library'): Promise<void> {
		await this.page.locator(`[data-testid="content-type-selector-${type}"]`).click()
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
