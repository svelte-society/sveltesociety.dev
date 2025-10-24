import { test, expect } from '@playwright/test'
import { ContentDetailPage } from '../../pages'
import { TEST_CONTENT } from '../../fixtures/test-data'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'

test.describe('Content Detail Pages', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('can view recipe detail page', async ({ page }) => {
		const detailPage = new ContentDetailPage(page)
		await detailPage.goto('recipe', 'test-recipe-counter-component')

		await detailPage.expectContentLoaded()
		await detailPage.expectTitleIs('Test Recipe: Building a Counter Component')
		await detailPage.expectContentTypeIs('recipe')
		await detailPage.expectDescriptionVisible()
		await detailPage.expectPublishedDateVisible()
	})

	test('can view video detail page', async ({ page }) => {
		const detailPage = new ContentDetailPage(page)
		await detailPage.goto('video', 'test-video-svelte-5-intro')

		await detailPage.expectContentLoaded()
		await detailPage.expectTitleIs('Test Video: Svelte 5 Introduction')
		await detailPage.expectContentTypeIs('video')
		await detailPage.expectDescriptionVisible()
		await detailPage.expectPublishedDateVisible()
	})

	test('can view library detail page', async ({ page }) => {
		const detailPage = new ContentDetailPage(page)
		await detailPage.goto('library', 'test-library-testing-library')

		await detailPage.expectContentLoaded()
		await detailPage.expectTitleIs('Test Library: Svelte Testing Library')
		await detailPage.expectContentTypeIs('library')
		await detailPage.expectDescriptionVisible()
		await detailPage.expectPublishedDateVisible()
	})

	test('can view announcement detail page', async ({ page }) => {
		const detailPage = new ContentDetailPage(page)
		await detailPage.goto('announcement', 'test-announcement-svelte-5-released')

		await detailPage.expectContentLoaded()
		await detailPage.expectTitleIs('Test Announcement: Svelte 5 Released')
		await detailPage.expectContentTypeIs('announcement')
		await detailPage.expectDescriptionVisible()
		await detailPage.expectPublishedDateVisible()
	})

	test('can view collection detail page', async ({ page }) => {
		const detailPage = new ContentDetailPage(page)
		await detailPage.goto('collection', 'test-collection-best-components')

		await detailPage.expectContentLoaded()
		await detailPage.expectTitleIs('Test Collection: Best Svelte Components')
		await detailPage.expectContentTypeIs('collection')
		await detailPage.expectDescriptionVisible()
		await detailPage.expectPublishedDateVisible()
	})

	test('displays content metadata correctly', async ({ page }) => {
		const detailPage = new ContentDetailPage(page)
		await detailPage.goto('recipe', 'test-recipe-counter-component')

		await detailPage.expectContentLoaded()

		const title = await detailPage.getTitle()
		expect(title).toBe('Test Recipe: Building a Counter Component')

		const description = await detailPage.getDescription()
		expect(description).toContain('Learn how to build a simple counter component')

		const contentType = await detailPage.getContentType()
		expect(contentType?.toLowerCase()).toBe('recipe')

		const author = await detailPage.getAuthorName()
		expect(author).toBe('Test Admin')

		const tags = await detailPage.getTags()
		expect(tags).toContain('svelte')
		expect(tags).toContain('components')
		expect(tags).toContain('tutorial')

		await expect(detailPage.likeButton).toBeVisible()
		await expect(detailPage.saveButton).toBeVisible()
		await expect(detailPage.publishedDate).toBeVisible()
	})

	test('author link navigates to user profile', async ({ page }) => {
		const detailPage = new ContentDetailPage(page)
		await detailPage.goto('recipe', 'test-recipe-counter-component')

		await detailPage.expectContentLoaded()
		await expect(detailPage.authorLink).toBeVisible()
		await expect(detailPage.authorLink).toHaveAttribute('href', '/user/test_admin')
	})

	test('tag links are functional', async ({ page }) => {
		const detailPage = new ContentDetailPage(page)
		await detailPage.goto('recipe', 'test-recipe-counter-component')

		await detailPage.expectContentLoaded()

		const tagLinks = detailPage.tagsContainer.locator('a')
		const firstTag = tagLinks.first()
		await expect(firstTag).toBeVisible()

		const href = await firstTag.getAttribute('href')
		expect(href).toMatch(/^\/\?tags=/)
	})
})
