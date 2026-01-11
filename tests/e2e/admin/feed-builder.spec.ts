import { test, expect } from '../../fixtures/auth.fixture'
import { FeedBuilderPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'

test.describe.serial('Admin - Feed Builder', () => {
	test.use({ authenticatedAs: 'admin' })

	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('can view feed builder list page', async ({ page }) => {
		const feedBuilderPage = new FeedBuilderPage(page)
		await feedBuilderPage.gotoList()

		await expect(page).toHaveURL('/admin/feed-builder')
		await expect(feedBuilderPage.feedItemsTable).toBeVisible()
	})

	test('shows empty state when no feed items exist', async ({ page }) => {
		const feedBuilderPage = new FeedBuilderPage(page)
		await feedBuilderPage.gotoList()

		// Initially should show empty state or no rows
		const count = await feedBuilderPage.getFeedItemCount()
		expect(count).toBe(0)
	})

	test('can navigate to add feed item form', async ({ page }) => {
		const feedBuilderPage = new FeedBuilderPage(page)
		await feedBuilderPage.gotoList()

		await feedBuilderPage.clickAddFeedItem()

		await expect(page).toHaveURL('/admin/feed-builder/new')
	})

	test('can create a custom CTA feed item', async ({ page }) => {
		const feedBuilderPage = new FeedBuilderPage(page)
		await feedBuilderPage.gotoNew()

		await feedBuilderPage.fillCustomCTAForm({
			title: 'Test CTA Title',
			description: 'Test CTA Description',
			buttonText: 'Click Me',
			buttonHref: '/test-link',
			priority: 10
		})

		await feedBuilderPage.submitForm()

		// Should redirect back to list
		await feedBuilderPage.expectListPage()

		// Should now have at least one feed item
		const count = await feedBuilderPage.getFeedItemCount()
		expect(count).toBeGreaterThan(0)
	})

	test('can toggle feed item status', async ({ page }) => {
		const feedBuilderPage = new FeedBuilderPage(page)

		// First create a feed item
		await feedBuilderPage.gotoNew()
		await feedBuilderPage.fillCustomCTAForm({
			title: 'Toggle Test',
			description: 'For testing toggle',
			buttonText: 'Test',
			buttonHref: '/test'
		})
		await feedBuilderPage.submitForm()
		await feedBuilderPage.expectListPage()

		// Get initial status
		const initialStatus = await feedBuilderPage.getFirstFeedItemStatus()

		// Toggle status
		await feedBuilderPage.toggleFirstFeedItem()

		// Wait for status to change
		await expect(async () => {
			const newStatus = await feedBuilderPage.getFirstFeedItemStatus()
			expect(newStatus).not.toBe(initialStatus)
		}).toPass({ timeout: 5000 })

		// Status should have changed
		const newStatus = await feedBuilderPage.getFirstFeedItemStatus()
		expect(newStatus).not.toBe(initialStatus)
	})

	test('can delete a feed item', async ({ page }) => {
		const feedBuilderPage = new FeedBuilderPage(page)

		// First create a feed item
		await feedBuilderPage.gotoNew()
		await feedBuilderPage.fillCustomCTAForm({
			title: 'Delete Test',
			description: 'For testing deletion',
			buttonText: 'Test',
			buttonHref: '/test'
		})
		await feedBuilderPage.submitForm()
		await feedBuilderPage.expectListPage()

		const initialCount = await feedBuilderPage.getFeedItemCount()
		expect(initialCount).toBeGreaterThan(0)

		// Delete the feed item
		await feedBuilderPage.deleteFirstFeedItem()

		// Wait for count to decrease
		await expect(async () => {
			const newCount = await feedBuilderPage.getFeedItemCount()
			expect(newCount).toBeLessThan(initialCount)
		}).toPass({ timeout: 5000 })
	})

	test('can edit a feed item', async ({ page }) => {
		const feedBuilderPage = new FeedBuilderPage(page)

		// First create a feed item
		await feedBuilderPage.gotoNew()
		await feedBuilderPage.fillCustomCTAForm({
			title: 'Edit Test Original',
			description: 'Original description',
			buttonText: 'Original Button',
			buttonHref: '/original'
		})
		await feedBuilderPage.submitForm()
		await feedBuilderPage.expectListPage()

		// Click edit button on first item
		await feedBuilderPage.editButtons.first().click()

		// Should navigate to edit page
		await expect(page).toHaveURL(/\/admin\/feed-builder\/[a-f0-9]+/)

		// Update the title
		await feedBuilderPage.setTitle('Edit Test Updated')
		await feedBuilderPage.submitForm()

		// Should redirect back to list
		await feedBuilderPage.expectListPage()
	})
})
