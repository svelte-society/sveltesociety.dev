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

		await expect(page).toHaveURL(/\/admin\/moderation\/.+/)

		const status = await moderationPage.getItemStatus()
		expect(status).toBe('pending')
	})

	test('admin can approve pending content', async ({ page }) => {
		const moderationPage = new ModerationQueuePage(page)
		await moderationPage.gotoQueue()

		const initialCount = await moderationPage.getQueueCount()

		await moderationPage.inspectFirstItem()

		await moderationPage.approveItem()

		await page.waitForURL(/\/admin\/moderation/)

		if (page.url() === '/admin/moderation' || page.url().endsWith('/admin/moderation')) {
			const newCount = await moderationPage.getQueueCount()
			expect(newCount).toBeLessThan(initialCount)
		}
	})

	test('admin can reject pending content', async ({ page }) => {
		const moderationPage = new ModerationQueuePage(page)
		await moderationPage.gotoQueue()

		const initialCount = await moderationPage.getQueueCount()

		await moderationPage.inspectFirstItem()

		await moderationPage.rejectItem()

		await page.waitForURL(/\/admin\/moderation/)

		if (page.url() === '/admin/moderation' || page.url().endsWith('/admin/moderation')) {
			const newCount = await moderationPage.getQueueCount()
			expect(newCount).toBeLessThan(initialCount)
		}
	})

})
