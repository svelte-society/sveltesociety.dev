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
})
