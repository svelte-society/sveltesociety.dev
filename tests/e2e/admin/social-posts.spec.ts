import { test, expect } from '@playwright/test'
import { SocialPostsPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'
import { loginAs } from '../../helpers/auth'

test.describe('Admin: Social Posts', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
		await loginAs(page, 'admin')
	})

	test('admin can view social posts list', async ({ page }) => {
		const socialPage = new SocialPostsPage(page)
		await socialPage.gotoList()

		await socialPage.expectListPage()
		// Initially empty or with posts - both are valid states
	})

	test('admin can navigate to new post page', async ({ page }) => {
		const socialPage = new SocialPostsPage(page)
		await socialPage.gotoList()
		await socialPage.clickNewPost()

		await socialPage.expectNewPage()
	})

	test('admin can create a new social post', async ({ page }) => {
		const socialPage = new SocialPostsPage(page)
		await socialPage.gotoNew()

		// Fill in form
		await socialPage.fillTitle('Test Social Post')
		await socialPage.fillTwitterText('This is a test tweet for Svelte Society!')
		await socialPage.fillBlueskyText('This is a test Bluesky post!')
		await socialPage.fillLinkedinText('This is a test LinkedIn post about Svelte!')

		// Submit
		await socialPage.submit()

		// Should redirect to edit page after creation
		await socialPage.expectEditPage()
	})

	test('admin can edit an existing social post', async ({ page }) => {
		const socialPage = new SocialPostsPage(page)

		// First create a post
		await socialPage.gotoNew()
		await socialPage.fillTitle('Post to Edit')
		await socialPage.fillTwitterText('Original tweet')
		await socialPage.submit()
		await socialPage.expectEditPage()

		// Now edit it
		await socialPage.clearAndFillTitle('Updated Post Title')
		await socialPage.save()

		// Verify the title was updated
		const title = await socialPage.getTitleValue()
		expect(title).toBe('Updated Post Title')
	})

	test('admin can delete a social post', async ({ page }) => {
		const socialPage = new SocialPostsPage(page)

		// First create a post
		await socialPage.gotoNew()
		await socialPage.fillTitle('Post to Delete')
		await socialPage.fillTwitterText('This post will be deleted')
		await socialPage.submit()
		await socialPage.expectEditPage()

		// Delete the post
		await socialPage.deletePost()

		// Should redirect to list page
		await socialPage.expectListPage()
	})

	test('admin can cancel creating a post', async ({ page }) => {
		const socialPage = new SocialPostsPage(page)
		await socialPage.gotoNew()

		// Fill in partial data
		await socialPage.fillTitle('Cancelled Post')

		// Cancel
		await socialPage.clickCancel()

		// Should go back to list
		await socialPage.expectListPage()
	})

	test('non-admin cannot access social posts', async ({ page }) => {
		// Login as viewer (non-admin)
		await loginAs(page, 'viewer')

		// Try to access social posts
		await page.goto('/admin/social')

		// Should redirect away from admin area
		await expect(page).not.toHaveURL(/\/admin\/social/)
	})

	test('admin can create post with only Twitter enabled', async ({ page }) => {
		const socialPage = new SocialPostsPage(page)
		await socialPage.gotoNew()

		// Fill title and only Twitter
		await socialPage.fillTitle('Twitter Only Post')
		await socialPage.fillTwitterText('Just a tweet!')

		// Uncheck other platforms
		await socialPage.blueskyCheckbox.uncheck()
		await socialPage.linkedinCheckbox.uncheck()

		await socialPage.submit()
		await socialPage.expectEditPage()
	})
})
