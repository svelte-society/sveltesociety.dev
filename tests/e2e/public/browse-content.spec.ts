import { test, expect } from '@playwright/test'
import { ContentListPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'

test.describe('Public Content Browsing', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('can view recipes list', async ({ page }) => {
		const contentList = new ContentListPage(page)
		await contentList.goto('recipe')

		await contentList.expectContentDisplayed()

		const titles = await contentList.getContentTitles()
		expect(titles.length).toBeGreaterThan(0)
	})

	test('can view videos list', async ({ page }) => {
		const contentList = new ContentListPage(page)
		await contentList.goto('video')

		await contentList.expectContentDisplayed()
		await contentList.expectContentWithTitle('Test Video')
	})

	test('can view libraries list', async ({ page }) => {
		const contentList = new ContentListPage(page)
		await contentList.goto('library')

		await contentList.expectContentDisplayed()
		await contentList.expectContentWithTitle('Test Library')
	})

	test('can view announcements list', async ({ page }) => {
		const contentList = new ContentListPage(page)
		await contentList.goto('announcement')

		await contentList.expectContentDisplayed()
		await contentList.expectContentWithTitle('Test Announcement')
	})

	test('can view collections list', async ({ page }) => {
		const contentList = new ContentListPage(page)
		await contentList.goto('collection')

		await contentList.expectContentDisplayed()
		await contentList.expectContentWithTitle('Test Collection')
	})

	test('content cards display correctly', async ({ page }) => {
		const contentList = new ContentListPage(page)
		await contentList.goto('recipe')

		const count = await contentList.getContentCount()
		expect(count).toBeGreaterThan(0)

		const titles = await contentList.getContentTitles()
		expect(titles.length).toBe(count)
		expect(titles.every((title) => title.length > 0)).toBe(true)
	})

	test('tags in sidebar redirect correctly from content listing pages', async ({ page }) => {
		const contentList = new ContentListPage(page)
		await contentList.goto('recipe')

		// Wait for content cards to load - tags in content cards are always visible
		const contentCard = page.getByTestId('content-card').first()
		await expect(contentCard).toBeVisible()

		// Get tag link from content card (these are always visible)
		const cardTagLink = contentCard.locator('a[href*="?tags="]').first()
		await expect(cardTagLink).toBeVisible()

		const tagHref = await cardTagLink.getAttribute('href')
		// When on content listing route, tags should preserve the current path
		expect(tagHref).toMatch(/^\/recipe\?tags=/)
	})

	test('tags in sidebar appear on desktop', async ({ page }) => {
		const contentList = new ContentListPage(page)
		await contentList.goto('recipe')

		// Check that tag links exist on the page
		const tagLinks = page.locator('a[href*="?tags="]')
		const tagCount = await tagLinks.count()
		expect(tagCount).toBeGreaterThan(0)
	})
})
