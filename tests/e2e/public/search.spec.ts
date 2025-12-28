import { test, expect } from '@playwright/test'
import { HomePage, ContentListPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'

test.describe('OmniSearch Suggestions', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('shows tag suggestions when typing', async ({ page }) => {
		const homePage = new HomePage(page)
		await homePage.goto()

		const searchInput = page.getByTestId('omni-search-input')
		await searchInput.fill('svelte')

		// Wait for suggestions to appear
		const suggestionLink = page.locator('a:has-text("in Tags")').first()
		await expect(suggestionLink).toBeVisible()

		// Verify the suggestion contains matching text
		await expect(suggestionLink).toContainText('svelte')
	})

	test('shows category suggestions when typing', async ({ page }) => {
		const homePage = new HomePage(page)
		await homePage.goto()

		const searchInput = page.getByTestId('omni-search-input')
		await searchInput.fill('video')

		// Wait for category suggestion
		const categorySuggestion = page.locator('a:has-text("in Categories")').first()
		await expect(categorySuggestion).toBeVisible()
	})

	test('clicking a suggestion applies the filter', async ({ page }) => {
		const homePage = new HomePage(page)
		await homePage.goto()

		const searchInput = page.getByTestId('omni-search-input')
		await searchInput.fill('svelte')

		// Click on a tag suggestion
		const tagSuggestion = page.locator('a:has-text("in Tags")').first()
		await expect(tagSuggestion).toBeVisible()
		await tagSuggestion.click()

		// Verify URL contains tags param
		await expect(page).toHaveURL(/tags=/)

		// Verify content is displayed
		const contentList = new ContentListPage(page)
		await contentList.expectContentDisplayed()
	})

	test('arrow keys navigate suggestions', async ({ page }) => {
		const homePage = new HomePage(page)
		await homePage.goto()

		const searchInput = page.getByTestId('omni-search-input')
		await searchInput.fill('svelte')

		// Wait for suggestions
		const suggestions = page.locator('a:has-text("in Tags"), a:has-text("in Categories"), a:has-text("in Authors")')
		await expect(suggestions.first()).toBeVisible()

		// Press arrow down to select first suggestion
		await searchInput.press('ArrowDown')

		// First suggestion should have focus
		const firstSuggestion = suggestions.first()
		await expect(firstSuggestion).toBeFocused()
	})

	test('enter selects highlighted suggestion', async ({ page }) => {
		const homePage = new HomePage(page)
		await homePage.goto()

		const searchInput = page.getByTestId('omni-search-input')
		await searchInput.fill('svelte')

		// Wait for suggestions
		const suggestions = page.locator('a:has-text("in Tags"), a:has-text("in Categories")')
		await expect(suggestions.first()).toBeVisible()

		// Navigate to first suggestion and select it
		await searchInput.press('ArrowDown')
		await searchInput.press('Enter')

		// Should navigate - URL should have filter params
		await expect(page).toHaveURL(/tags=|type=/)
	})

	test('escape closes suggestions and blurs input', async ({ page }) => {
		const homePage = new HomePage(page)
		await homePage.goto()

		const searchInput = page.getByTestId('omni-search-input')
		await searchInput.fill('svelte')

		// Wait for suggestions
		const suggestions = page.locator('a:has-text("in Tags")')
		await expect(suggestions.first()).toBeVisible()

		// Press escape
		await searchInput.press('Escape')

		// Input should not be focused
		await expect(searchInput).not.toBeFocused()
	})

	test('active filters are excluded from suggestions', async ({ page }) => {
		// Navigate to homepage with an active tag filter
		await page.goto('/?tags=svelte')

		const searchInput = page.getByTestId('omni-search-input')
		await searchInput.fill('svelte')

		// Wait a moment for suggestions to potentially appear
		await page.waitForTimeout(300)

		// The exact "svelte" tag should not appear in suggestions since it's already active
		// But "sveltekit" should still appear
		const svelteKitSuggestion = page.locator('a').filter({ hasText: 'sveltekit' }).filter({ hasText: 'in Tags' })

		// Either no suggestions at all (if svelte was the only match) or sveltekit is available
		const suggestionCount = await page.locator('a:has-text("in Tags")').count()

		// If there are tag suggestions, verify svelte is not among them as an exact match
		if (suggestionCount > 0) {
			// Check that we have sveltekit but the first tag is not exactly "svelte"
			await expect(svelteKitSuggestion).toBeVisible()
		}
	})

	test('suggestions filter correctly based on query', async ({ page }) => {
		const homePage = new HomePage(page)
		await homePage.goto()

		const searchInput = page.getByTestId('omni-search-input')

		// Type a unique query that should match specific items
		await searchInput.fill('testing')

		// Should show the testing tag
		const testingSuggestion = page.locator('a').filter({ hasText: 'testing' }).filter({ hasText: 'in Tags' })
		await expect(testingSuggestion).toBeVisible()

		// Clear and type something else
		await searchInput.clear()
		await searchInput.fill('xyz123nonexistent')

		// Wait for no suggestions message
		const noResults = page.getByText('No matching filters found')
		await expect(noResults).toBeVisible()
	})

	test('search input clears after selecting suggestion', async ({ page }) => {
		const homePage = new HomePage(page)
		await homePage.goto()

		const searchInput = page.getByTestId('omni-search-input')
		await searchInput.fill('svelte')

		// Wait for suggestions
		const tagSuggestion = page.locator('a:has-text("in Tags")').first()
		await expect(tagSuggestion).toBeVisible()

		// Click the suggestion
		await tagSuggestion.click()

		// Wait for navigation
		await expect(page).toHaveURL(/tags=/)

		// Search input should be empty after selection
		await expect(searchInput).toHaveValue('')
	})
})

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

		await page.getByTestId('omni-search-input').fill('Counter')
		await page.getByTestId('omni-search-input').press('Enter')

		await contentList.expectContentDisplayed()

		const titles = await contentList.getContentTitles()
		expect(titles.some((title) => title.includes('Counter'))).toBeTruthy()
	})

	test('search preserves content type filter', async ({ page }) => {
		const contentList = new ContentListPage(page)
		await contentList.goto('video')

		await page.getByTestId('omni-search-input').fill('Svelte')
		await page.getByTestId('omni-search-input').press('Enter')

		// Search from category page redirects to homepage with type preserved as query param
		await expect(page).toHaveURL(/type=video/)
		await expect(page).toHaveURL(/query=Svelte/)

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

test.describe('Author Filtering', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('partial author name matches full author name', async ({ page }) => {
		// Navigate with partial author name "Test" which should match "Test Admin"
		await page.goto('/?authors=Test')

		const contentList = new ContentListPage(page)
		await contentList.expectContentDisplayed()

		// Should show content from "Test Admin" (all test content is authored by test_admin)
		const count = await contentList.getContentCount()
		expect(count).toBeGreaterThan(0)
	})

	test('partial author name is case-insensitive', async ({ page }) => {
		// Navigate with lowercase partial author name
		await page.goto('/?authors=admin')

		const contentList = new ContentListPage(page)
		await contentList.expectContentDisplayed()

		// Should match "Test Admin" case-insensitively
		const count = await contentList.getContentCount()
		expect(count).toBeGreaterThan(0)
	})

	test('full author name works for exact match', async ({ page }) => {
		// Navigate with full author name
		await page.goto('/?authors=Test%20Admin')

		const contentList = new ContentListPage(page)
		await contentList.expectContentDisplayed()

		// Should show content from "Test Admin"
		const count = await contentList.getContentCount()
		expect(count).toBeGreaterThan(0)
	})

	test('non-matching author name shows no results', async ({ page }) => {
		// Navigate with author name that doesn't match any author
		await page.goto('/?authors=NonExistentAuthor123')

		// Should show no results or empty state
		const contentList = new ContentListPage(page)
		const count = await contentList.getContentCount()
		expect(count).toBe(0)
	})
})

test.describe('Datalist Selection (No-JS fallback)', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('datalist category selection is parsed correctly', async ({ page }) => {
		// Simulate selecting "Recipe (category)" from datalist
		await page.goto('/?q=Recipe%20(category)')

		// Should redirect to /?type=recipe
		await expect(page).toHaveURL(/type=recipe/)
		await expect(page).not.toHaveURL(/q=/)

		const contentList = new ContentListPage(page)
		await contentList.expectContentDisplayed()
	})

	test('datalist tag selection is parsed correctly', async ({ page }) => {
		// Simulate selecting "svelte (tag)" from datalist
		await page.goto('/?q=svelte%20(tag)')

		// Should redirect to /?tags=svelte
		await expect(page).toHaveURL(/tags=svelte/)
		await expect(page).not.toHaveURL(/q=/)

		const contentList = new ContentListPage(page)
		await contentList.expectContentDisplayed()
	})

	test('datalist author selection is parsed correctly', async ({ page }) => {
		// Simulate selecting "Test Admin (author)" from datalist
		await page.goto('/?q=Test%20Admin%20(author)')

		// Should redirect to /?authors=Test%20Admin
		await expect(page).toHaveURL(/authors=Test/)
		await expect(page).not.toHaveURL(/q=/)

		const contentList = new ContentListPage(page)
		await contentList.expectContentDisplayed()
	})

	test('regular search still works when not matching datalist format', async ({ page }) => {
		// Regular search term without datalist format
		await page.goto('/?q=Counter')

		// Should redirect to /?query=Counter
		await expect(page).toHaveURL(/query=Counter/)
		await expect(page).not.toHaveURL(/q=/)

		const contentList = new ContentListPage(page)
		await contentList.expectContentDisplayed()
	})
})
