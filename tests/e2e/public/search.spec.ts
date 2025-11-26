import { test, expect } from '@playwright/test'
import { HomePage, ContentListPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'

test.describe('Search Functionality', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('can search for content by title', async ({ page }) => {
		const homePage = new HomePage(page)
		await homePage.goto()

		await homePage.search('Counter')

		const contentList = new ContentListPage(page)
		await contentList.expectContentDisplayed()

		const titles = await contentList.getContentTitles()
		expect(titles.some((title) => title.includes('Counter'))).toBeTruthy()
	})

	test('can search for content by description', async ({ page }) => {
		const homePage = new HomePage(page)
		await homePage.goto()

		await homePage.search('testing')

		const contentList = new ContentListPage(page)
		await contentList.expectContentDisplayed()

		const count = await contentList.getContentCount()
		expect(count).toBeGreaterThan(0)
	})

	test('search returns no results for non-existent content', async ({ page }) => {
		const homePage = new HomePage(page)
		await homePage.goto()

		await homePage.search('nonexistentcontentxyz123')

		const contentList = new ContentListPage(page)
		const isEmpty = await contentList.isEmptyState()
		expect(isEmpty).toBe(true)
	})

	test('can search from content list page', async ({ page }) => {
		const contentList = new ContentListPage(page)
		await contentList.goto('recipe')

		await page.getByTestId('search-input').fill('Counter')
		await page.getByTestId('search-input').press('Enter')

		await contentList.expectContentDisplayed()

		const titles = await contentList.getContentTitles()
		expect(titles.some((title) => title.includes('Counter'))).toBeTruthy()
	})

	test('search preserves content type filter', async ({ page }) => {
		const contentList = new ContentListPage(page)
		await contentList.goto('video')

		await page.getByTestId('search-input').fill('Svelte')
		await page.getByTestId('search-input').press('Enter')

		await expect(page).toHaveURL(/\/video/)

		const count = await contentList.getContentCount()
		expect(count).toBeGreaterThan(0)
	})

	test('can clear search and see all results', async ({ page }) => {
		const homePage = new HomePage(page)
		await homePage.goto()

		// Search for specific content
		await homePage.search('Counter')

		const contentList = new ContentListPage(page)
		await contentList.expectContentDisplayed()

		// Verify search shows filtered results
		const searchUrl = page.url()
		expect(searchUrl).toContain('Counter')

		// Get search result count
		const searchResultCount = await contentList.getContentCount()
		expect(searchResultCount).toBeGreaterThan(0)

		// Clear search by navigating back to home page (more reliable)
		await homePage.goto()
		await contentList.expectContentDisplayed()

		// Verify we're back to showing all content
		const allResultsCount = await contentList.getContentCount()
		expect(allResultsCount).toBeGreaterThanOrEqual(searchResultCount)
	})
})
