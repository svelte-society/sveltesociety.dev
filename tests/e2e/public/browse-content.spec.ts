import { test, expect } from '@playwright/test'
import { ContentListPage } from '../../pages'

test.describe('Public Content Browsing', () => {
	test('can view recipes list', async ({ page }) => {
		const contentList = new ContentListPage(page)
		await contentList.goto('recipe')

		// Should display at least one recipe from test data
		await contentList.expectContentDisplayed()

		// Should have our test recipe
		const titles = await contentList.getContentTitles()
		expect(titles.length).toBeGreaterThan(0)
	})

	test('can view videos list', async ({ page }) => {
		const contentList = new ContentListPage(page)
		await contentList.goto('video')

		// Should display at least one video from test data
		await contentList.expectContentDisplayed()

		// Should have our test video
		await contentList.expectContentWithTitle('Test Video')
	})

	test('can view libraries list', async ({ page }) => {
		const contentList = new ContentListPage(page)
		await contentList.goto('library')

		// Should display at least one library from test data
		await contentList.expectContentDisplayed()

		// Should have our test library
		await contentList.expectContentWithTitle('Test Library')
	})

	test('can view announcements list', async ({ page }) => {
		const contentList = new ContentListPage(page)
		await contentList.goto('announcement')

		// Should display at least one announcement from test data
		await contentList.expectContentDisplayed()

		// Should have our test announcement
		await contentList.expectContentWithTitle('Test Announcement')
	})

	test('can view collections list', async ({ page }) => {
		const contentList = new ContentListPage(page)
		await contentList.goto('collection')

		// Should display at least one collection from test data
		await contentList.expectContentDisplayed()

		// Should have our test collection
		await contentList.expectContentWithTitle('Test Collection')
	})

	test('content cards display correctly', async ({ page }) => {
		const contentList = new ContentListPage(page)
		await contentList.goto('recipe')

		// Verify at least one content card exists
		const count = await contentList.getContentCount()
		expect(count).toBeGreaterThan(0)

		// Verify titles are extracted correctly
		const titles = await contentList.getContentTitles()
		expect(titles.length).toBe(count)
		expect(titles.every((title) => title.length > 0)).toBe(true)
	})
})
