import { test, expect } from '../../fixtures/auth.fixture'
import { ModerationQueuePage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'

test.describe('Admin - Content Moderation', () => {
	test.use({ authenticatedAs: 'admin' })

	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('pending content appears in moderation queue', async ({ page }) => {
		const moderationPage = new ModerationQueuePage(page)
		await moderationPage.gotoQueue()

		const count = await moderationPage.getQueueCount()
		expect(count).toBeGreaterThan(0)
	})

	test('admin can inspect pending content', async ({ page }) => {
		const moderationPage = new ModerationQueuePage(page)
		await moderationPage.gotoQueue()

		await moderationPage.inspectFirstItem()

		// Should be on the moderation item detail page
		await expect(page).toHaveURL(/\/admin\/moderation\/.+/)

		// Status should be pending
		const status = await moderationPage.getItemStatus()
		expect(status).toBe('pending')
	})

	test('admin can approve pending content', async ({ page }) => {
		const moderationPage = new ModerationQueuePage(page)
		await moderationPage.gotoQueue()

		// Get initial count
		const initialCount = await moderationPage.getQueueCount()

		// Inspect first item
		await moderationPage.inspectFirstItem()

		// Approve the item
		await moderationPage.approveItem()

		// Should redirect back to queue or to next item
		await page.waitForURL(/\/admin\/moderation/)

		// Queue count should decrease (if we're back at queue list)
		if (page.url() === '/admin/moderation' || page.url().endsWith('/admin/moderation')) {
			const newCount = await moderationPage.getQueueCount()
			expect(newCount).toBeLessThan(initialCount)
		}
	})

	test('admin can reject pending content', async ({ page }) => {
		const moderationPage = new ModerationQueuePage(page)
		await moderationPage.gotoQueue()

		// Get initial count
		const initialCount = await moderationPage.getQueueCount()

		// Inspect first item
		await moderationPage.inspectFirstItem()

		// Reject the item
		await moderationPage.rejectItem()

		// Should redirect back to queue or to next item
		await page.waitForURL(/\/admin\/moderation/)

		// Queue count should decrease (if we're back at queue list)
		if (page.url() === '/admin/moderation' || page.url().endsWith('/admin/moderation')) {
			const newCount = await moderationPage.getQueueCount()
			expect(newCount).toBeLessThan(initialCount)
		}
	})

})
