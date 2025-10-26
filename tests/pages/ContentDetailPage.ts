import { type Locator, type Page } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * ContentDetailPage - Page Object Model for individual content detail pages
 *
 * Represents detail pages for all content types (recipes, videos, libraries, etc.)
 * Accessible at routes like /recipe/1, /video/2, /library/3, etc.
 *
 * Provides methods for:
 * - Viewing content details (title, description, metadata)
 * - Interacting with content (save, like)
 * - Navigating to author profiles
 * - Clicking on tags
 *
 * @example
 * const detailPage = new ContentDetailPage(page)
 * await detailPage.goto('recipe', '1')
 * const title = await detailPage.getTitle()
 */
export class ContentDetailPage extends BasePage {
	readonly article: Locator
	readonly titleHeading: Locator
	readonly titleLink: Locator
	readonly description: Locator
	readonly contentTypeLabel: Locator
	readonly authorLink: Locator
	readonly tagsContainer: Locator
	readonly likeButton: Locator
	readonly saveButton: Locator
	readonly publishedDate: Locator
	readonly editLink: Locator

	constructor(page: Page) {
		super(page)
		this.article = page.getByTestId('content-card')
		this.titleHeading = page.getByTestId('content-title')
		this.titleLink = this.titleHeading.locator('a').first()
		this.description = page.getByTestId('content-description')
		this.contentTypeLabel = page.getByTestId('content-type')
		this.authorLink = page.getByTestId('author-link')
		this.tagsContainer = page.getByTestId('content-tags')
		this.likeButton = page.locator('button[name="type"][value="like"]')
		this.saveButton = page.locator('button[name="type"][value="save"]')
		this.publishedDate = page.getByTestId('published-date')
		this.editLink = page.getByTestId('edit-link')
	}

	async goto(type: string, slug: string) {
		await this.page.goto(`/${type}/${slug}`)
	}

	async getTitle() {
		return await this.titleLink.textContent()
	}

	async getDescription() {
		return await this.description.textContent()
	}

	async getContentType() {
		const text = await this.contentTypeLabel.textContent()
		return text?.trim()
	}

	async getAuthorName() {
		if (await this.authorLink.isVisible()) {
			return await this.authorLink.textContent()
		}
		return null
	}

	async getTags() {
		const tagElements = this.tagsContainer.locator('a')
		const count = await tagElements.count()
		const tags: string[] = []
		for (let i = 0; i < count; i++) {
			const text = await tagElements.nth(i).textContent()
			if (text) tags.push(text.trim())
		}
		return tags
	}

	async getLikeCount() {
		const text = await this.likeButton.textContent()
		const match = text?.match(/\d+/)
		return match ? parseInt(match[0]) : 0
	}

	async getSaveCount() {
		const text = await this.saveButton.textContent()
		const match = text?.match(/\d+/)
		return match ? parseInt(match[0]) : 0
	}

	async isLiked() {
		const title = await this.likeButton.getAttribute('title')
		return title === 'Remove like'
	}

	async isSaved() {
		const title = await this.saveButton.getAttribute('title')
		return title === 'Unsave'
	}

	async like() {
		await this.likeButton.click()
	}

	async save() {
		await this.saveButton.click()
	}

	async hasEditLink() {
		return await this.editLink.isVisible()
	}

	async clickEdit() {
		await this.editLink.click()
	}

	async expectContentLoaded() {
		await this.article.waitFor({ state: 'visible' })
		await this.titleHeading.waitFor({ state: 'visible' })
	}

	async expectTitleIs(title: string) {
		await this.titleLink.waitFor({ state: 'visible' })
		const actualTitle = await this.getTitle()
		if (actualTitle !== title) {
			throw new Error(`Expected title to be "${title}" but got "${actualTitle}"`)
		}
	}

	async expectContentTypeIs(type: string) {
		await this.contentTypeLabel.waitFor({ state: 'visible' })
		const actualType = await this.getContentType()
		if (actualType?.toLowerCase() !== type.toLowerCase()) {
			throw new Error(`Expected content type to be "${type}" but got "${actualType}"`)
		}
	}

	async expectAuthorIs(authorName: string) {
		await this.authorLink.waitFor({ state: 'visible' })
		const actualAuthor = await this.getAuthorName()
		if (actualAuthor !== authorName) {
			throw new Error(`Expected author to be "${authorName}" but got "${actualAuthor}"`)
		}
	}

	async expectTagsInclude(tag: string) {
		const tags = await this.getTags()
		if (!tags.includes(tag)) {
			throw new Error(`Expected tags to include "${tag}" but got [${tags.join(', ')}]`)
		}
	}

	async expectDescriptionVisible() {
		await this.description.waitFor({ state: 'visible' })
	}

	async expectPublishedDateVisible() {
		await this.publishedDate.waitFor({ state: 'visible' })
	}
}
