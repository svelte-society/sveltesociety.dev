import type { Page, Locator } from '@playwright/test'
import { expect } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * SocialPostsPage - Page Object Model for Social Media Posts admin pages
 *
 * Manages navigation and interactions for:
 * - /admin/social (list page)
 * - /admin/social/new (create page)
 * - /admin/social/[id] (edit page)
 *
 * @example
 * const socialPage = new SocialPostsPage(page)
 * await socialPage.gotoList()
 * await socialPage.clickNewPost()
 * await socialPage.fillTitle('My Post')
 * await socialPage.fillTwitterText('Tweet content')
 * await socialPage.submit()
 */
export class SocialPostsPage extends BasePage {
	// ========== LIST PAGE SELECTORS ==========

	readonly newPostButton: Locator
	readonly postsTable: Locator
	readonly postRows: Locator
	readonly emptyMessage: Locator
	readonly searchInput: Locator
	readonly statusFilter: Locator
	readonly typeFilter: Locator
	readonly platformFilter: Locator

	// ========== FORM SELECTORS ==========

	readonly titleInput: Locator
	readonly twitterTextarea: Locator
	readonly blueskyTextarea: Locator
	readonly linkedinTextarea: Locator
	readonly submitButton: Locator
	readonly cancelButton: Locator
	readonly saveButton: Locator
	readonly deleteButton: Locator
	readonly confirmDeleteButton: Locator
	readonly backButton: Locator
	readonly form: Locator

	// ========== CHECKBOXES ==========

	readonly twitterCheckbox: Locator
	readonly blueskyCheckbox: Locator
	readonly linkedinCheckbox: Locator

	constructor(page: Page) {
		super(page)

		// List page
		this.newPostButton = page.getByTestId('new-post-button')
		this.postsTable = page.getByTestId('social-posts-table')
		this.postRows = page.getByTestId('social-posts-table-row')
		this.emptyMessage = page.getByTestId('social-posts-table-empty')
		this.searchInput = page.getByTestId('input-search')
		this.statusFilter = page.getByTestId('select-status')
		this.typeFilter = page.getByTestId('select-post_type')
		this.platformFilter = page.getByTestId('select-platform')

		// Form fields
		this.form = page.locator('form')
		this.titleInput = page.getByTestId('input-title')
		this.twitterTextarea = page.getByTestId('textarea-twitter')
		this.blueskyTextarea = page.getByTestId('textarea-bluesky')
		this.linkedinTextarea = page.getByTestId('textarea-linkedin')
		this.submitButton = page.getByTestId('submit-button')
		this.cancelButton = page.getByTestId('cancel-button')
		this.saveButton = page.getByTestId('save-button')
		this.deleteButton = page.getByTestId('delete-button')
		this.confirmDeleteButton = page.getByTestId('confirm-delete-button')
		this.backButton = page.getByTestId('back-button')

		// Checkboxes
		this.twitterCheckbox = page.locator('#enable_twitter')
		this.blueskyCheckbox = page.locator('#enable_bluesky')
		this.linkedinCheckbox = page.locator('#enable_linkedin')
	}

	// ========== NAVIGATION ==========

	async gotoList(): Promise<void> {
		await this.page.goto('/admin/social')
		await this.page.waitForLoadState('networkidle')
	}

	async gotoNew(): Promise<void> {
		await this.page.goto('/admin/social/new')
		await this.page.waitForLoadState('networkidle')
		// Wait for Svelte hydration - checkboxes should be checked by default after hydration
		// This indicates the component has hydrated and state is initialized
		await expect(this.twitterCheckbox).toBeChecked({ timeout: 15000 })
		// Textarea should now be visible since checkbox is checked
		await this.twitterTextarea.waitFor({ state: 'visible' })
		await this.titleInput.waitFor({ state: 'visible' })
	}

	async gotoEdit(id: string): Promise<void> {
		await this.page.goto(`/admin/social/${id}`)
		// Wait for form to be visible and populated
		await this.saveButton.waitFor({ state: 'visible', timeout: 15000 })
		await this.titleInput.waitFor({ state: 'visible' })
	}

	async clickNewPost(): Promise<void> {
		await this.newPostButton.click()
	}

	// ========== FORM ACTIONS ==========

	async fillTitle(title: string): Promise<void> {
		// Use click + clear + fill pattern for more reliable filling with Svelte
		await this.titleInput.click()
		await this.titleInput.clear()
		await this.titleInput.fill(title)
	}

	async clearAndFillTitle(title: string): Promise<void> {
		await this.titleInput.clear()
		await this.titleInput.fill(title)
	}

	async fillTwitterText(text: string): Promise<void> {
		// Ensure Twitter is enabled
		const isChecked = await this.twitterCheckbox.isChecked()
		if (!isChecked) {
			await this.twitterCheckbox.check()
		}
		// Wait for textarea to appear after checkbox change
		await this.twitterTextarea.waitFor({ state: 'visible' })
		await this.twitterTextarea.fill(text)
	}

	async fillBlueskyText(text: string): Promise<void> {
		// Ensure Bluesky is enabled
		const isChecked = await this.blueskyCheckbox.isChecked()
		if (!isChecked) {
			await this.blueskyCheckbox.check()
		}
		// Wait for textarea to appear after checkbox change
		await this.blueskyTextarea.waitFor({ state: 'visible' })
		await this.blueskyTextarea.fill(text)
	}

	async fillLinkedinText(text: string): Promise<void> {
		// Ensure LinkedIn is enabled
		const isChecked = await this.linkedinCheckbox.isChecked()
		if (!isChecked) {
			await this.linkedinCheckbox.check()
		}
		// Wait for textarea to appear after checkbox change
		await this.linkedinTextarea.waitFor({ state: 'visible' })
		await this.linkedinTextarea.fill(text)
	}

	async submit(): Promise<void> {
		await this.submitButton.click()
		// Wait for redirect to edit page or error message
		await Promise.race([
			this.page.waitForURL(/\/admin\/social\/[a-zA-Z0-9-]+$/, { timeout: 15000 }),
			this.page.locator('.bg-red-50').waitFor({ state: 'visible', timeout: 15000 })
		])
	}

	async save(): Promise<void> {
		await this.saveButton.click()
		// Wait for the form to complete and show success message (green) or error (red div)
		await Promise.race([
			this.page.locator('div.bg-green-50').first().waitFor({ state: 'visible', timeout: 15000 }),
			this.page.locator('div.bg-red-50.rounded-lg').waitFor({ state: 'visible', timeout: 15000 })
		])
		await this.page.waitForLoadState('networkidle')
	}

	async clickDelete(): Promise<void> {
		await this.deleteButton.click()
	}

	async confirmDelete(): Promise<void> {
		// Wait for dialog to open
		await this.page.locator('dialog[open]').waitFor({ state: 'visible' })
		await this.confirmDeleteButton.click()
		await this.page.waitForLoadState('domcontentloaded')
	}

	async deletePost(): Promise<void> {
		await this.clickDelete()
		await this.confirmDelete()
	}

	async clickBack(): Promise<void> {
		await this.backButton.click()
	}

	async clickCancel(): Promise<void> {
		await this.cancelButton.click()
	}

	// ========== GETTERS ==========

	async getPostCount(): Promise<number> {
		return await this.postRows.count()
	}

	async getPostTitles(): Promise<string[]> {
		const editLinks = this.page.getByTestId('post-edit-link')
		return await editLinks.allTextContents()
	}

	async getTitleValue(): Promise<string> {
		return (await this.titleInput.inputValue()) || ''
	}

	// ========== ASSERTIONS ==========

	async expectListPage(): Promise<void> {
		await this.page.waitForURL('/admin/social')
		// Wait for either table or empty state
		await expect(async () => {
			const tableVisible = await this.postsTable.isVisible()
			const emptyVisible = await this.emptyMessage.isVisible()
			expect(tableVisible || emptyVisible).toBeTruthy()
		}).toPass({ timeout: 10000 })
	}

	async expectPostsDisplayed(): Promise<void> {
		const count = await this.getPostCount()
		if (count === 0) {
			throw new Error('Expected posts to be displayed, but found 0')
		}
	}

	async expectPostWithTitle(title: string): Promise<void> {
		const titles = await this.getPostTitles()
		if (!titles.some((t) => t.includes(title))) {
			throw new Error(`Expected post with title "${title}", found: ${titles.join(', ')}`)
		}
	}

	async expectNoPostWithTitle(title: string): Promise<void> {
		const titles = await this.getPostTitles()
		if (titles.some((t) => t.includes(title))) {
			throw new Error(`Expected no post with title "${title}", but found one`)
		}
	}

	async expectEmptyState(): Promise<void> {
		await expect(this.emptyMessage).toBeVisible()
	}

	async expectEditPage(): Promise<void> {
		await expect(this.page).toHaveURL(/\/admin\/social\/[a-zA-Z0-9-]+$/)
		await this.page.waitForLoadState('networkidle')
		await expect(this.saveButton).toBeVisible({ timeout: 15000 })
	}

	async expectNewPage(): Promise<void> {
		await expect(this.page).toHaveURL('/admin/social/new')
		await expect(this.submitButton).toBeVisible()
	}

	/**
	 * Click on a post to edit it by title
	 */
	async clickPostByTitle(title: string): Promise<void> {
		const link = this.page.getByTestId('post-edit-link').filter({ hasText: title })
		await link.first().click()
	}

	// ========== CALENDAR PAGE ==========

	async gotoCalendar(): Promise<void> {
		await this.page.goto('/admin/social/calendar')
		await this.page.waitForLoadState('networkidle')
	}

	async expectCalendarPage(): Promise<void> {
		await expect(this.page).toHaveURL('/admin/social/calendar')
		await expect(this.page.getByRole('heading', { name: /Social Calendar/i })).toBeVisible()
	}

	async clickCalendarLink(): Promise<void> {
		await this.page.getByTestId('calendar-button').click()
	}

	async navigateCalendarNext(): Promise<void> {
		await this.page.getByLabel('Next').click()
	}

	async navigateCalendarPrev(): Promise<void> {
		await this.page.getByLabel('Previous').click()
	}

	async clickCalendarToday(): Promise<void> {
		await this.page.getByRole('button', { name: 'Today' }).click()
	}

	async switchToWeekView(): Promise<void> {
		await this.page.getByRole('button', { name: 'Week' }).click()
	}

	async switchToMonthView(): Promise<void> {
		await this.page.getByRole('button', { name: 'Month' }).click()
	}

	// ========== SETTINGS PAGE ==========

	async gotoSettings(): Promise<void> {
		await this.page.goto('/admin/social/settings')
		await this.page.waitForLoadState('networkidle')
	}

	async expectSettingsPage(): Promise<void> {
		await expect(this.page).toHaveURL('/admin/social/settings')
		await expect(this.page.getByRole('heading', { name: /Queue Settings/i })).toBeVisible()
	}

	async clickSettingsLink(): Promise<void> {
		await this.page.getByTestId('settings-button').click()
	}

	// ========== SCHEDULING (Edit Page) ==========

	async schedulePost(date: string, time: string): Promise<void> {
		// Fill in the schedule form on the edit page
		await this.page.locator('#schedule_date').fill(date)
		await this.page.locator('#schedule_time').fill(time)
		await this.page.getByRole('button', { name: /Schedule Post/i }).click()
		await this.page.waitForLoadState('domcontentloaded')
	}

	async unschedulePost(): Promise<void> {
		await this.page.getByRole('button', { name: /Unschedule/i }).click()
		await this.page.waitForLoadState('domcontentloaded')
	}

	async expectPostScheduled(): Promise<void> {
		// Should see scheduled status badge (in the Status card)
		await expect(
			this.page.locator('.rounded-2xl').filter({ hasText: 'Status' }).getByText('Scheduled').first()
		).toBeVisible()
	}

	async expectPostDraft(): Promise<void> {
		// Should see draft status badge (in the Status card)
		await expect(
			this.page.locator('.rounded-2xl').filter({ hasText: 'Status' }).getByText('Draft').first()
		).toBeVisible()
	}
}
