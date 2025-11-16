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
		await detailPage.goto('recipe', 'test-recipe-counter-component-content_recipe_001')

		await detailPage.expectContentLoaded()
		await detailPage.expectTitleIs('Test Recipe: Building a Counter Component')
		await detailPage.expectContentTypeIs('recipe')
		// Recipes don't show description on detail pages, only the rendered body
		await detailPage.expectPublishedDateVisible()
	})

	test('can view video detail page', async ({ page }) => {
		const detailPage = new ContentDetailPage(page)
		await detailPage.goto('video', 'test-video-svelte-5-intro-content_video_001')

		await detailPage.expectContentLoaded()
		await detailPage.expectTitleIs('Test Video: Svelte 5 Introduction')
		await detailPage.expectContentTypeIs('video')
		await detailPage.expectDescriptionVisible()
		await detailPage.expectPublishedDateVisible()
	})

	test('can view library detail page', async ({ page }) => {
		const detailPage = new ContentDetailPage(page)
		await detailPage.goto('library', 'test-library-testing-library-content_library_001')

		await detailPage.expectContentLoaded()
		await detailPage.expectTitleIs('Test Library: Svelte Testing Library')
		await detailPage.expectContentTypeIs('library')
		await detailPage.expectDescriptionVisible()
		await detailPage.expectPublishedDateVisible()
	})

	test('can view announcement detail page', async ({ page }) => {
		const detailPage = new ContentDetailPage(page)
		await detailPage.goto('announcement', 'test-announcement-svelte-5-released-content_announcement_001')

		await detailPage.expectContentLoaded()
		await detailPage.expectTitleIs('Test Announcement: Svelte 5 Released')
		await detailPage.expectContentTypeIs('announcement')
		await detailPage.expectDescriptionVisible()
		await detailPage.expectPublishedDateVisible()
	})

	test('can view collection detail page', async ({ page }) => {
		const detailPage = new ContentDetailPage(page)
		await detailPage.goto('collection', 'test-collection-best-components-content_collection_001')

		await detailPage.expectContentLoaded()
		await detailPage.expectTitleIs('Test Collection: Best Svelte Components')
		await detailPage.expectContentTypeIs('collection')
		await detailPage.expectDescriptionVisible()
		await detailPage.expectPublishedDateVisible()
	})

	test('displays content metadata correctly', async ({ page }) => {
		const detailPage = new ContentDetailPage(page)
		await detailPage.goto('video', 'test-video-svelte-5-intro-content_video_001')

		await detailPage.expectContentLoaded()

		const title = await detailPage.getTitle()
		expect(title).toBe('Test Video: Svelte 5 Introduction')

		const description = await detailPage.getDescription()
		expect(description).toContain('A comprehensive introduction to Svelte 5')

		const contentType = await detailPage.getContentType()
		expect(contentType?.toLowerCase()).toBe('video')

		const author = await detailPage.getAuthorName()
		expect(author).toBe('Test Admin')

		const tags = await detailPage.getTags()
		expect(tags).toContain('svelte')
		expect(tags).toContain('sveltekit')

		await expect(detailPage.likeButton).toBeVisible()
		await expect(detailPage.saveButton).toBeVisible()
		await expect(detailPage.publishedDate).toBeVisible()
	})

	test('author link navigates to user profile', async ({ page }) => {
		const detailPage = new ContentDetailPage(page)
		await detailPage.goto('recipe', 'test-recipe-counter-component-content_recipe_001')

		await detailPage.expectContentLoaded()
		await expect(detailPage.authorLink).toBeVisible()
		await expect(detailPage.authorLink).toHaveAttribute('href', '/user/test_admin')
	})

	test('tag links are functional', async ({ page }) => {
		const detailPage = new ContentDetailPage(page)
		await detailPage.goto('recipe', 'test-recipe-counter-component-content_recipe_001')

		await detailPage.expectContentLoaded()

		const tagLinks = detailPage.tagsContainer.locator('a')
		const firstTag = tagLinks.first()
		await expect(firstTag).toBeVisible()

		const href = await firstTag.getAttribute('href')
		// Tag links redirect to homepage with tags query param when not on content listing route
		expect(href).toMatch(/^\/\?tags=/)
	})

	test('library displays NPM package link when available', async ({ page }) => {
		const detailPage = new ContentDetailPage(page)
		await detailPage.goto('library', 'test-library-testing-library-content_library_001')

		await detailPage.expectContentLoaded()

		// Check that NPM link is visible
		const npmLink = page.locator('a[href*="npmjs.com/package"]')
		await expect(npmLink).toBeVisible()

		// Verify the link points to the correct package
		const href = await npmLink.getAttribute('href')
		expect(href).toBe('https://www.npmjs.com/package/@testing-library/svelte')

		// Verify link has correct attributes for external links
		await expect(npmLink).toHaveAttribute('target', '_blank')
		await expect(npmLink).toHaveAttribute('rel', 'noopener noreferrer')
	})
})
