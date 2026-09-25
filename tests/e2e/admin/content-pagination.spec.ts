import { test, expect } from '@playwright/test'
import { execFileSync } from 'node:child_process'
import { ContentManagementPage } from '../../pages/ContentManagementPage'
import { loginAs } from '../../helpers/auth'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'
import {
	CONTENT_PAGINATION_FIXTURES,
	PAGINATION_SEARCH,
	PAGINATION_UNIQUE_SEARCH
} from '../../fixtures/content-pagination'

test.describe('Admin content pagination', () => {
	test.beforeAll(() => {
		execFileSync(
			'bun',
			[
				'-e',
				`
			import { Database } from 'bun:sqlite'
			const db = new Database('test-admin-content-pagination.db')
			db.exec('PRAGMA busy_timeout = 10000')
			const insert = db.prepare(
				'INSERT OR IGNORE INTO content (id, title, type, status, body, slug, description) VALUES (?, ?, ?, ?, ?, ?, ?)'
			)
			const { items, search } = await Bun.stdin.json()
			for (const item of items) insert.run(item.id, item.title, item.type, item.status, '', item.id, search)
			db.close()
		`
			],
			{ input: JSON.stringify({ items: CONTENT_PAGINATION_FIXTURES, search: PAGINATION_SEARCH }) }
		)
	})

	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
		await loginAs(page, 'admin')
	})

	test('changes rows on client pagination and browser history navigation', async ({ page }) => {
		const list = new ContentManagementPage(page)
		await list.gotoList({ search: PAGINATION_SEARCH, status: 'pending_review', type: 'recipe' })
		await expect(list.contentLinks).toHaveCount(50)
		const firstPage = await list.contentIds()

		await list.nextPage()
		await expect(page).toHaveURL(/page=2/)
		await expect(list.pagination).toContainText('Showing 51 - 60 of 60')
		await expect(list.contentLinks).toHaveCount(10)
		const secondPage = await list.contentIds()
		expect(secondPage.some((id) => firstPage.includes(id))).toBe(false)

		await list.previousPage()
		await expect(list.contentLinks).toHaveCount(50)
		expect(await list.contentIds()).toEqual(firstPage)
		await page.goBack()
		await expect(list.contentLinks).toHaveCount(10)
		expect(await list.contentIds()).toEqual(secondPage)
		await page.goForward()
		await expect(list.contentLinks).toHaveCount(50)
		expect(await list.contentIds()).toEqual(firstPage)
	})

	test('resets pagination for filters and restores filters with browser history', async ({
		page
	}) => {
		const list = new ContentManagementPage(page)
		await list.gotoList({ search: PAGINATION_SEARCH })
		await list.nextPage()
		await expect(list.contentLinks).toHaveCount(15)
		await list.typeFilter.selectOption('library')
		await expect(page).toHaveURL(
			(url) => url.searchParams.get('type') === 'library' && !url.searchParams.has('page')
		)
		await expect(list.contentLinks).toHaveCount(5)
		await list.statusFilter.selectOption('draft')
		await expect(page).toHaveURL(
			(url) =>
				url.searchParams.get('type') === 'library' && url.searchParams.get('status') === 'draft'
		)
		await expect(list.contentLinks).toHaveCount(1)
		await expect.poll(() => list.contentIds()).toEqual(['/admin/content/pagination_library_0'])

		await page.goBack()
		await expect(list.typeFilter).toHaveValue('')
		await expect(list.statusFilter).toHaveValue('all')
		await expect(list.contentLinks).toHaveCount(50)
		await page.goForward()
		await expect(list.typeFilter).toHaveValue('library')
		await expect(list.statusFilter).toHaveValue('draft')
		await expect(list.contentLinks).toHaveCount(1)
	})

	test('resets pagination for search and restores the query with browser history', async ({
		page
	}) => {
		const list = new ContentManagementPage(page)
		await list.gotoList({ search: PAGINATION_SEARCH })
		await list.nextPage()
		await expect(list.contentLinks).toHaveCount(15)
		await list.searchInput.fill(PAGINATION_UNIQUE_SEARCH)
		await expect(page).toHaveURL(new RegExp(`search=${PAGINATION_UNIQUE_SEARCH}$`))
		await expect(list.contentLinks).toHaveCount(1)
		await expect.poll(() => list.contentIds()).toEqual(['/admin/content/pagination_recipe_0'])

		await page.goBack()
		await expect(list.searchInput).toHaveValue(PAGINATION_SEARCH)
		await expect(list.contentLinks).toHaveCount(50)
	})
	for (const [filter, value] of [
		['type', 'recipe'],
		['status', 'pending_review']
	] as const) {
		test(`preserves a pending search when changing ${filter} immediately`, async ({ page }) => {
			await page.clock.install()
			const list = new ContentManagementPage(page)
			await list.gotoList({ search: PAGINATION_SEARCH, page: '2' })
			await expect(list.contentLinks).toHaveCount(15)
			await page.clock.pauseAt(new Date())
			await list.searchAndFilter(PAGINATION_UNIQUE_SEARCH, filter, value)
			await page.clock.runFor(50)

			// The filter must include the draft immediately, without waiting for the 300ms debounce.
			await expect(page).toHaveURL(
				(url) =>
					url.searchParams.get('search') === PAGINATION_UNIQUE_SEARCH &&
					url.searchParams.get(filter) === value &&
					!url.searchParams.has('page')
			)
			await expect(list.searchInput).toHaveValue(PAGINATION_UNIQUE_SEARCH)
			await expect(list.contentLinks).toHaveCount(1)
			await expect.poll(() => list.contentIds()).toEqual(['/admin/content/pagination_recipe_0'])

			await page.clock.fastForward(500)
			await expect(list.searchInput).toHaveValue(PAGINATION_UNIQUE_SEARCH)
			await expect(list.contentLinks).toHaveCount(1)
		})
	}
})
