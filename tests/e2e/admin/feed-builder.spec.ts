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
		// Expect either the table or empty state to be visible
		const tableVisible = await feedBuilderPage.feedItemsTable.isVisible()
		const emptyVisible = await feedBuilderPage.noFeedItemsMessage.isVisible()
		expect(tableVisible || emptyVisible).toBe(true)
	})

	test('shows seeded feed items including sponsors', async ({ page }) => {
		const feedBuilderPage = new FeedBuilderPage(page)
		await feedBuilderPage.gotoList()

		// Test data seeds 3 feed items: 1 CTA + 2 sponsors
		const count = await feedBuilderPage.getFeedItemCount()
		expect(count).toBe(3)
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

		// First create a feed item (this creates a non-sponsor CTA we can toggle)
		await feedBuilderPage.gotoNew()
		await feedBuilderPage.fillCustomCTAForm({
			title: 'Toggle Test',
			description: 'For testing toggle',
			buttonText: 'Test',
			buttonHref: '/test'
		})
		await feedBuilderPage.submitForm()
		await feedBuilderPage.expectListPage()

		// Find the first non-sponsor row (rows that have toggle buttons)
		// Sponsor rows don't have toggle buttons
		const toggleableRow = page
			.locator('[data-testid="feed-items-table"] tbody tr')
			.filter({ has: page.getByTestId('toggle-button') })
			.first()
		await expect(toggleableRow).toBeVisible()

		// Get initial status from the status badge in this row
		const statusBadge = toggleableRow.locator('td').last().locator('span').first()
		const initialStatus = await statusBadge.textContent()

		// Toggle status
		await toggleableRow.getByTestId('toggle-button').click()

		// Wait for status to change
		await expect(async () => {
			const newStatus = await statusBadge.textContent()
			expect(newStatus?.trim()).not.toBe(initialStatus?.trim())
		}).toPass({ timeout: 5000 })
	})

	test('can delete a feed item', async ({ page }) => {
		const feedBuilderPage = new FeedBuilderPage(page)

		// First create a feed item (this creates a non-sponsor CTA we can delete)
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

		// Find a row that has a delete button (non-sponsor rows)
		const deletableRow = page
			.locator('[data-testid="feed-items-table"] tbody tr')
			.filter({ has: page.getByTestId('delete-button') })
			.first()
		await expect(deletableRow).toBeVisible()

		// Delete the feed item
		await deletableRow.getByTestId('delete-button').click()
		// Wait for confirmation modal and click confirm button
		await page.locator('dialog[open]').getByTestId('confirm-delete-button').click()

		// Wait for count to decrease
		await expect(async () => {
			const newCount = await feedBuilderPage.getFeedItemCount()
			expect(newCount).toBeLessThan(initialCount)
		}).toPass({ timeout: 5000 })
	})

	test('can edit a feed item', async ({ page }) => {
		const feedBuilderPage = new FeedBuilderPage(page)

		// First create a feed item (this creates a non-sponsor CTA we can edit)
		await feedBuilderPage.gotoNew()
		await feedBuilderPage.fillCustomCTAForm({
			title: 'Edit Test Original',
			description: 'Original description',
			buttonText: 'Original Button',
			buttonHref: '/original'
		})
		await feedBuilderPage.submitForm()
		await feedBuilderPage.expectListPage()

		// Find a row that has an edit button (non-sponsor rows)
		const editableRow = page
			.locator('[data-testid="feed-items-table"] tbody tr')
			.filter({ has: page.getByTestId('edit-button') })
			.first()
		await expect(editableRow).toBeVisible()

		// Click edit button on the editable row
		await editableRow.getByTestId('edit-button').click()

		// Should navigate to edit page
		await expect(page).toHaveURL(/\/admin\/feed-builder\/[a-fA-F0-9]+/)

		// Update the title
		await feedBuilderPage.setTitle('Edit Test Updated')
		await feedBuilderPage.submitForm()

		// Should redirect back to list
		await feedBuilderPage.expectListPage()
	})

	test('can create a featured content-linked feed item', async ({ page }) => {
		const feedBuilderPage = new FeedBuilderPage(page)
		await feedBuilderPage.gotoNew()

		// Fill out the featured content form (links to existing content)
		await feedBuilderPage.fillFeaturedContentForm({ priority: 5 })

		await feedBuilderPage.submitForm()

		// Should redirect back to list
		await feedBuilderPage.expectListPage()

		// Should now have at least one feed item
		const count = await feedBuilderPage.getFeedItemCount()
		expect(count).toBeGreaterThan(0)
	})

	// ========== SPONSOR FEED ITEM TESTS ==========

	test('sponsor feed items display with SPONSOR type badge', async ({ page }) => {
		const feedBuilderPage = new FeedBuilderPage(page)
		await feedBuilderPage.gotoList()

		// Should have sponsor feed items from seed data
		const sponsorCount = await feedBuilderPage.getSponsorFeedItemCount()
		expect(sponsorCount).toBe(2) // 2 active sponsors in test data
	})

	test('sponsor feed items show company name as title', async ({ page }) => {
		const feedBuilderPage = new FeedBuilderPage(page)
		await feedBuilderPage.gotoList()

		// Check that sponsor company names appear in the table
		const title1 = await feedBuilderPage.getSponsorFeedItemTitle(0)
		const title2 = await feedBuilderPage.getSponsorFeedItemTitle(1)

		// Should be one of the test sponsor company names
		const validNames = ['Acme Dev Tools', 'CloudHost Pro']
		expect(validNames).toContain(title1)
		expect(validNames).toContain(title2)
	})

	test('sponsor feed items show "(Auto-managed)" label', async ({ page }) => {
		const feedBuilderPage = new FeedBuilderPage(page)
		await feedBuilderPage.gotoList()

		// Check both sponsor rows have the auto-managed label
		expect(await feedBuilderPage.sponsorRowHasAutoManagedLabel(0)).toBe(true)
		expect(await feedBuilderPage.sponsorRowHasAutoManagedLabel(1)).toBe(true)
	})

	test('sponsor feed items show "Managed via Sponsors" instead of actions', async ({ page }) => {
		const feedBuilderPage = new FeedBuilderPage(page)
		await feedBuilderPage.gotoList()

		// Check both sponsor rows have the "Managed via Sponsors" text
		expect(await feedBuilderPage.sponsorRowHasManagedViaText(0)).toBe(true)
		expect(await feedBuilderPage.sponsorRowHasManagedViaText(1)).toBe(true)
	})

	test('sponsor feed items do not have edit or delete buttons', async ({ page }) => {
		const feedBuilderPage = new FeedBuilderPage(page)
		await feedBuilderPage.gotoList()

		// Sponsor rows should not have edit/delete buttons
		await feedBuilderPage.expectSponsorRowsHaveNoEditButtons()
		await feedBuilderPage.expectSponsorRowsHaveNoDeleteButtons()
	})
})
