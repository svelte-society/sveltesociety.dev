import { type Page, type Locator, expect } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * TagsManagementPage - Page Object Model for admin tags management
 *
 * Represents pages for viewing and managing tags in the admin panel
 * Accessible at /admin/tags (list) and /admin/tags/:id (edit)
 *
 * Provides methods for:
 * - Viewing the tags list
 * - Navigating to tag edit pages
 * - Creating new tags
 * - Editing existing tags
 *
 * @example
 * const tagsMgmt = new TagsManagementPage(page)
 * await tagsMgmt.gotoTagsList()
 * const count = await tagsMgmt.getTagCount()
 */
export class TagsManagementPage extends BasePage {
	readonly tagsTable: Locator
	readonly tagRow: Locator
	readonly nameInput: Locator
	readonly slugInput: Locator
	readonly createButton: Locator
	readonly updateButton: Locator
	readonly backLink: Locator
	readonly newTagButton: Locator

	constructor(page: Page) {
		super(page)
		this.tagsTable = page.getByTestId('tags-table')
		this.tagRow = page.getByTestId('tags-table-row')
		this.nameInput = page.getByTestId('input-name')
		this.slugInput = page.getByTestId('input-slug')
		this.createButton = page.getByRole('button', { name: /create tag/i })
		this.updateButton = page.getByRole('button', { name: /update tag/i })
		this.backLink = page.getByRole('link', { name: /back to tags/i })
		this.newTagButton = page.getByRole('link', { name: /new tag/i })
	}

	async gotoTagsList(): Promise<void> {
		await this.page.goto('/admin/tags')
	}

	async gotoNewTag(): Promise<void> {
		await this.page.goto('/admin/tags/new')
	}

	async gotoEditTag(tagId: string): Promise<void> {
		await this.page.goto(`/admin/tags/${tagId}`)
	}

	async getTagCount(): Promise<number> {
		await this.tagsTable.waitFor({ state: 'visible' })
		return await this.tagRow.count()
	}

	async getTagNameByRow(index: number): Promise<string> {
		const row = this.tagRow.nth(index)
		return (await row.locator('[data-testid="tag-name"]').textContent()) || ''
	}

	async getTagSlugByRow(index: number): Promise<string> {
		const row = this.tagRow.nth(index)
		return (await row.locator('[data-testid="tag-slug"]').textContent()) || ''
	}

	async clickEditForRow(index: number): Promise<void> {
		const row = this.tagRow.nth(index)
		await row.getByTestId('edit-button').click()
	}

	async clickNewTag(): Promise<void> {
		await this.newTagButton.click()
	}

	async createTag(data: { name: string; slug: string }): Promise<void> {
		await this.nameInput.fill(data.name)
		await this.slugInput.fill(data.slug)
		await this.createButton.click()
	}

	async editTag(data: { name?: string; slug?: string }): Promise<void> {
		if (data.name !== undefined) {
			await this.nameInput.fill(data.name)
		}

		if (data.slug !== undefined) {
			await this.slugInput.fill(data.slug)
		}

		await this.updateButton.click()
	}

	async expectTagInList(tagName: string): Promise<void> {
		await expect(
			this.page.getByTestId('tag-name').filter({ hasText: new RegExp(`^${tagName}$`) }).first()
		).toBeVisible()
	}

	async expectTagNotInList(tagName: string): Promise<void> {
		await expect(
			this.page.getByTestId('tag-name').filter({ hasText: new RegExp(`^${tagName}$`) })
		).not.toBeVisible()
	}
}
