import { test, expect } from '@playwright/test'
import { ContentListPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'

test.describe('Active Filters', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('clear all button appears with multiple filters', async ({ page }) => {
		// Navigate with two filters
		await page.goto('/?type=recipe&tags=svelte')

		// Clear all button should be visible
		const clearAllButton = page.getByRole('link', { name: /Clear all/i })
		await expect(clearAllButton).toBeVisible()
	})

	test('clear all button does not appear with single filter', async ({ page }) => {
		// Navigate with only one filter
		await page.goto('/?tags=svelte')

		// Clear all button should not be visible
		const clearAllButton = page.getByRole('link', { name: /Clear all/i })
		await expect(clearAllButton).not.toBeVisible()
	})

	test('clicking clear all removes all filters', async ({ page }) => {
		// Navigate with multiple filters
		await page.goto('/?type=recipe&tags=svelte&query=test')

		// Click clear all
		const clearAllButton = page.getByRole('link', { name: /Clear all/i })
		await expect(clearAllButton).toBeVisible()
		await clearAllButton.click()

		// Should navigate to homepage without filters
		await expect(page).toHaveURL('/')

		// Clear all button should no longer be visible
		await expect(clearAllButton).not.toBeVisible()
	})

	test('individual filter can be removed', async ({ page }) => {
		// Navigate with a tag filter
		await page.goto('/?tags=svelte')

		// Find the remove button for the svelte tag
		const removeButton = page.locator('a[aria-label*="Remove"]').first()
		await expect(removeButton).toBeVisible()
		await removeButton.click()

		// URL should no longer contain the tag
		await expect(page).not.toHaveURL(/tags=svelte/)
	})

	test('active filters display correctly', async ({ page }) => {
		// Navigate with multiple filters
		await page.goto('/?type=recipe&tags=svelte')

		// Should show the type filter label
		const typeFilter = page.locator('span').filter({ hasText: 'Category:' })
		await expect(typeFilter.first()).toBeVisible()

		// Should show the tag filter (removable tag has the hash icon and name)
		const tagFilter = page.locator('span').filter({ hasText: 'svelte' }).first()
		await expect(tagFilter).toBeVisible()
	})

	test('search query appears as active filter', async ({ page }) => {
		// Navigate with a search query
		await page.goto('/?query=counter')

		// Should show the search filter label
		const searchFilter = page.locator('span').filter({ hasText: 'Search:' })
		await expect(searchFilter.first()).toBeVisible()

		// Should show the query text in the active filter area (not in content)
		const queryValue = page.locator('span').filter({ hasText: 'counter' }).first()
		await expect(queryValue).toBeVisible()
	})
})

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

	test('tags in content cards redirect to filtered homepage', async ({ page }) => {
		const contentList = new ContentListPage(page)
		await contentList.goto('recipe')

		// Wait for content cards to load - tags in content cards are always visible
		const contentCard = page.getByTestId('content-card').first()
		await expect(contentCard).toBeVisible()

		// Get tag link from content card (these are always visible)
		// When on category page, tags redirect to homepage with type param preserved
		const cardTagLink = contentCard.locator('a[href*="tags="]').first()
		await expect(cardTagLink).toBeVisible()

		const tagHref = await cardTagLink.getAttribute('href')
		// When on content listing route, tags redirect to homepage with type=recipe preserved
		expect(tagHref).toMatch(/^\/\?.*type=recipe.*tags=|^\/\?.*tags=.*type=recipe/)
	})

	test('tags in content cards appear on desktop', async ({ page }) => {
		const contentList = new ContentListPage(page)
		await contentList.goto('recipe')

		// Check that tag links exist in content cards
		// Tags have href containing "tags=" (could be ?tags= or &tags=)
		const tagLinks = page.locator('a[href*="tags="]')
		const tagCount = await tagLinks.count()
		expect(tagCount).toBeGreaterThan(0)
	})
})
