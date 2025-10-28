import { test, expect } from '@playwright/test'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'
import { TagsManagementPage } from '../../pages'
import { loginAs } from '../../helpers/auth'

test.describe('Admin - Tags Management', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
		await loginAs(page, 'admin')
	})

	test('can view tags list', async ({ page }) => {
		const tagsManagementPage = new TagsManagementPage(page)
		await tagsManagementPage.gotoTagsList()

		const tagCount = await tagsManagementPage.getTagCount()
		expect(tagCount).toBeGreaterThan(0)

		// Check that at least one tag from test data is visible
		await tagsManagementPage.expectTagInList('svelte')
	})

	test('tags table displays tag information correctly', async ({ page }) => {
		const tagsManagementPage = new TagsManagementPage(page)
		await tagsManagementPage.gotoTagsList()

		const tagCount = await tagsManagementPage.getTagCount()
		expect(tagCount).toBeGreaterThan(0)

		// Check first tag has both name and slug
		const firstName = await tagsManagementPage.getTagNameByRow(0)
		const firstSlug = await tagsManagementPage.getTagSlugByRow(0)

		expect(firstName.length).toBeGreaterThan(0)
		expect(firstSlug.length).toBeGreaterThan(0)
	})

	test('can navigate to new tag page', async ({ page }) => {
		const tagsManagementPage = new TagsManagementPage(page)
		await tagsManagementPage.gotoTagsList()

		await tagsManagementPage.clickNewTag()

		await expect(page).toHaveURL('/admin/tags/new')
		await expect(page.getByRole('heading', { name: /new tag/i })).toBeVisible()
	})
})
