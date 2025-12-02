import type { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

type ContentType = 'recipe' | 'video' | 'library' | 'resource'

/**
 * Page Object Model for the Submit page
 *
 * The submit page now uses a navigation pattern where users click links
 * to go to /submit/recipe, /submit/video, etc.
 */
export class SubmitPage extends BasePage {
	readonly submitHeading: Locator
	readonly submitButton: Locator
	readonly contentTypeNav: Locator

	constructor(page: Page) {
		super(page)
		this.submitHeading = page.locator('h1')
		this.submitButton = page.locator('[data-testid="submit-button"]')
		this.contentTypeNav = page.locator('[data-testid="content-type-nav"]')
	}

	// Navigation
	async goto(type?: ContentType): Promise<void> {
		if (type) {
			await this.page.goto(`/submit/${type}`)
		} else {
			await this.page.goto('/submit')
		}
	}

	async selectContentType(type: ContentType): Promise<void> {
		await this.page.locator(`[data-testid="submit-${type}-link"]`).click()
		await this.page.waitForURL(`/submit/${type}`)
	}

	async expectSubmitHeading(): Promise<void> {
		await this.submitHeading.waitFor({ state: 'visible' })
	}

	async expectContentTypeNavVisible(): Promise<void> {
		await this.contentTypeNav.waitFor({ state: 'visible' })
	}

	// Recipe form fields
	get recipeTitleField(): Locator {
		return this.page.locator('[data-testid="recipe-title-input"]')
	}

	get recipeDescriptionField(): Locator {
		return this.page.locator('[data-testid="recipe-description-input"]')
	}

	get recipeBodyField(): Locator {
		return this.page.locator('[data-testid="recipe-body-input"]')
	}

	get recipeNotesField(): Locator {
		return this.page.locator('[data-testid="recipe-notes-input"]')
	}

	// Video form fields
	get videoUrlField(): Locator {
		return this.page.locator('[data-testid="video-url-input"]')
	}

	get videoDescriptionField(): Locator {
		return this.page.locator('[data-testid="video-description-input"]')
	}

	get videoNotesField(): Locator {
		return this.page.locator('[data-testid="video-notes-input"]')
	}

	// Library form fields
	get libraryGithubField(): Locator {
		return this.page.locator('[data-testid="library-github-input"]')
	}

	get libraryDescriptionField(): Locator {
		return this.page.locator('[data-testid="description-textarea"]')
	}

	get libraryNotesField(): Locator {
		return this.page.locator('[data-testid="library-notes-input"]')
	}

	// Resource form fields
	get resourceTitleField(): Locator {
		return this.page.locator('[data-testid="resource-title-input"]')
	}

	get resourceDescriptionField(): Locator {
		return this.page.locator('[data-testid="resource-description-input"]')
	}

	get resourceLinkField(): Locator {
		return this.page.locator('[data-testid="resource-link-input"]')
	}

	get resourceNotesField(): Locator {
		return this.page.locator('[data-testid="resource-notes-input"]')
	}

	// Legacy aliases for backward compatibility - used by individual tests
	// Video
	get urlField(): Locator {
		return this.videoUrlField
	}

	// Library
	get githubRepoField(): Locator {
		return this.libraryGithubField
	}

	// Recipe
	get titleField(): Locator {
		return this.recipeTitleField
	}

	get bodyField(): Locator {
		return this.recipeBodyField
	}

	// Generic description field - context-dependent based on current page
	get descriptionField(): Locator {
		// Try each type's description field - the visible one will match
		return this.page.locator('[data-testid$="-description-input"], [data-testid="description-textarea"]')
	}

	// Tags selector (common to all forms)
	get tagsSelector(): Locator {
		return this.page.locator('[data-testid="tags-selector"]')
	}

	// Form fill helpers
	async fillRecipeForm(data: {
		title: string
		description: string
		body: string
		tags?: string[]
		notes?: string
	}): Promise<void> {
		// Navigate to recipe page if not already there
		if (!this.page.url().includes('/submit/recipe')) {
			await this.goto('recipe')
		}

		await this.recipeTitleField.fill(data.title)
		await this.recipeDescriptionField.fill(data.description)
		await this.recipeBodyField.fill(data.body)

		if (data.tags?.length) {
			await this.selectTags(data.tags)
		}

		if (data.notes) {
			await this.recipeNotesField.fill(data.notes)
		}
	}

	async fillVideoForm(data: {
		url: string
		description: string
		tags?: string[]
		notes?: string
	}): Promise<void> {
		// Navigate to video page if not already there
		if (!this.page.url().includes('/submit/video')) {
			await this.goto('video')
		}

		await this.videoDescriptionField.fill(data.description)
		await this.videoUrlField.fill(data.url)

		if (data.tags?.length) {
			await this.selectTags(data.tags)
		}

		if (data.notes) {
			await this.videoNotesField.fill(data.notes)
		}
	}

	async fillLibraryForm(data: {
		githubRepo: string
		description: string
		tags?: string[]
		notes?: string
	}): Promise<void> {
		// Navigate to library page if not already there
		if (!this.page.url().includes('/submit/library')) {
			await this.goto('library')
		}

		await this.libraryDescriptionField.fill(data.description)
		await this.libraryGithubField.fill(data.githubRepo)

		if (data.tags?.length) {
			await this.selectTags(data.tags)
		}

		if (data.notes) {
			await this.libraryNotesField.fill(data.notes)
		}
	}

	async fillResourceForm(data: {
		title: string
		link: string
		description: string
		tags?: string[]
		notes?: string
	}): Promise<void> {
		// Navigate to resource page if not already there
		if (!this.page.url().includes('/submit/resource')) {
			await this.goto('resource')
		}

		await this.resourceTitleField.fill(data.title)
		await this.resourceDescriptionField.fill(data.description)
		await this.resourceLinkField.fill(data.link)

		if (data.tags?.length) {
			await this.selectTags(data.tags)
		}

		if (data.notes) {
			await this.resourceNotesField.fill(data.notes)
		}
	}

	async selectTags(tags: string[]): Promise<void> {
		// Select tags from Combobox by clicking (one tag per iteration)
		for (let i = 0; i < tags.length; i++) {
			await this.selectFirstTag()
		}
	}

	async selectFirstTag(): Promise<void> {
		// Click the combobox input to open the dropdown
		await this.tagsSelector.click()
		// Wait for the dropdown to be visible and click the first item
		// bits-ui Combobox uses [data-combobox-item] for items
		const firstItem = this.page.locator('[data-combobox-item]').first()
		await firstItem.waitFor({ state: 'visible' })
		await firstItem.click()
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
