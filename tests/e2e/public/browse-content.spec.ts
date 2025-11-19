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

		// Wait for sidebar tags to load
		const sidebarTags = page.locator('aside').locator('a')
		await expect(sidebarTags.first()).toBeVisible()

		const firstTagHref = await sidebarTags.first().getAttribute('href')
		// When on content listing route, tags should preserve the current path
		expect(firstTagHref).toMatch(/^\/recipe\?tags=/)
	})

	test('tags in sidebar appear on desktop', async ({ page }) => {
		const contentList = new ContentListPage(page)
		await contentList.goto('recipe')

		// Check that tags are in the sidebar on desktop
		const sidebar = page.locator('aside')
		await expect(sidebar).toBeVisible()

		// Tags should be visible in sidebar (hidden class is sm:block)
		const sidebarTags = sidebar.locator('a')
		const tagCount = await sidebarTags.count()
		expect(tagCount).toBeGreaterThan(0)
	})
})
