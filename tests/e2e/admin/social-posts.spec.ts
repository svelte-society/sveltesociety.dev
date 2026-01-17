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

	// ========== CALENDAR TESTS ==========

	test('admin can access calendar page', async ({ page }) => {
		const socialPage = new SocialPostsPage(page)
		await socialPage.gotoList()

		// Click calendar link
		await socialPage.clickCalendarLink()
		await socialPage.expectCalendarPage()
	})

	test('admin can navigate calendar views', async ({ page }) => {
		const socialPage = new SocialPostsPage(page)
		await socialPage.gotoCalendar()

		// Test week view toggle
		await socialPage.switchToWeekView()
		await expect(page.getByRole('button', { name: 'Week' })).toHaveClass(/font-medium/)

		// Test month view toggle
		await socialPage.switchToMonthView()
		await expect(page.getByRole('button', { name: 'Month' })).toHaveClass(/font-medium/)
	})

	test('admin can navigate calendar months', async ({ page }) => {
		const socialPage = new SocialPostsPage(page)
		await socialPage.gotoCalendar()

		// Get current month name from the calendar controls
		const monthHeading = page.locator('.rounded-lg.bg-white h2')
		const initialMonth = await monthHeading.textContent()

		// Navigate to next month
		await socialPage.navigateCalendarNext()
		await page.waitForTimeout(500) // Wait for re-render

		// Month should have changed
		const nextMonth = await monthHeading.textContent()
		expect(nextMonth).not.toBe(initialMonth)

		// Navigate back with Today button
		await socialPage.clickCalendarToday()
		await page.waitForTimeout(500)
	})

	// ========== SETTINGS TESTS ==========

	test('admin can access queue settings page', async ({ page }) => {
		const socialPage = new SocialPostsPage(page)
		await socialPage.gotoList()

		// Click settings link
		await socialPage.clickSettingsLink()
		await socialPage.expectSettingsPage()
	})

	test('admin can view global queue settings', async ({ page }) => {
		const socialPage = new SocialPostsPage(page)
		await socialPage.gotoSettings()

		// Should see global settings section
		await expect(page.getByText('Global Queue Settings')).toBeVisible()
		// Should see platform sections
		await expect(page.getByText('Twitter/X')).toBeVisible()
		await expect(page.getByText('Bluesky')).toBeVisible()
		await expect(page.getByText('LinkedIn')).toBeVisible()
	})

	// ========== SCHEDULING TESTS ==========

	test('admin can schedule a draft post', async ({ page }) => {
		const socialPage = new SocialPostsPage(page)

		// Create a post first
		await socialPage.gotoNew()
		await socialPage.fillTitle('Post to Schedule')
		await socialPage.fillTwitterText('This will be scheduled')
		await socialPage.submit()
		await socialPage.expectEditPage()

		// Post should be in draft status
		await socialPage.expectPostDraft()

		// Schedule for tomorrow
		const tomorrow = new Date()
		tomorrow.setDate(tomorrow.getDate() + 1)
		const dateStr = tomorrow.toISOString().split('T')[0]

		await socialPage.schedulePost(dateStr, '14:00')

		// Post should now be scheduled
		await socialPage.expectPostScheduled()
	})

	test('admin can unschedule a scheduled post', async ({ page }) => {
		const socialPage = new SocialPostsPage(page)

		// Create and schedule a post
		await socialPage.gotoNew()
		await socialPage.fillTitle('Post to Unschedule')
		await socialPage.fillTwitterText('This will be unscheduled')
		await socialPage.submit()
		await socialPage.expectEditPage()

		// Schedule it
		const tomorrow = new Date()
		tomorrow.setDate(tomorrow.getDate() + 1)
		const dateStr = tomorrow.toISOString().split('T')[0]
		await socialPage.schedulePost(dateStr, '15:00')
		await socialPage.expectPostScheduled()

		// Unschedule it
		await socialPage.unschedulePost()
		await socialPage.expectPostDraft()
	})

	// ========== AUTO-POSTING RULES TESTS ==========

	test('admin can access rules page', async ({ page }) => {
		const socialPage = new SocialPostsPage(page)
		await socialPage.gotoList()

		// Click rules link
		await page.getByTestId('rules-button').click()
		await expect(page).toHaveURL('/admin/social/rules')
		await expect(page.getByRole('heading', { name: 'Auto-Posting Rules', level: 1 })).toBeVisible()
	})

	test('admin can create a new auto-posting rule', async ({ page }) => {
		// Navigate to new rule page
		await page.goto('/admin/social/rules/new')
		await page.waitForLoadState('networkidle')

		// Wait for Svelte hydration - platforms should be selected by default
		await expect(page.getByRole('button', { name: /Twitter\/X ✓/i })).toBeVisible({
			timeout: 15000
		})
		await expect(page.getByTestId('submit-button')).toBeEnabled({ timeout: 5000 })

		// Fill in rule form
		const nameInput = page.getByRole('textbox', { name: 'Rule Name' })
		await nameInput.click()
		await nameInput.fill('Auto-post videos')

		const descInput = page.getByRole('textbox', { name: 'Description' })
		await descInput.click()
		await descInput.fill('Automatically create posts for new videos')

		// Select trigger type and filter
		await page.locator('select[name="trigger_type"]').selectOption('content_published')
		await page.locator('select[name="content_type_filter"]').selectOption('video')

		// Submit and wait for redirect
		await page.getByTestId('submit-button').click()
		await expect(page).toHaveURL(/\/admin\/social\/rules\/[A-F0-9]{16}$/)
	})

	test('admin can edit an auto-posting rule', async ({ page }) => {
		// First create a rule
		await page.goto('/admin/social/rules/new')
		await page.waitForLoadState('networkidle')
		await expect(page.getByRole('button', { name: /Twitter\/X ✓/i })).toBeVisible({
			timeout: 15000
		})

		const nameInput = page.getByRole('textbox', { name: 'Rule Name' })
		await nameInput.click()
		await nameInput.fill('Rule to Edit')

		const descInput = page.getByRole('textbox', { name: 'Description' })
		await descInput.click()
		await descInput.fill('Test rule for editing')

		await page.locator('select[name="trigger_type"]').selectOption('content_published')
		await page.locator('select[name="content_type_filter"]').selectOption('video')

		// Submit and wait for redirect
		await page.getByTestId('submit-button').click()
		await expect(page).toHaveURL(/\/admin\/social\/rules\/[A-F0-9]{16}$/)

		// Wait for edit page to load
		await page.waitForLoadState('networkidle')
		await page.getByTestId('save-button').waitFor({ state: 'visible', timeout: 15000 })

		// Now edit the rule
		const editNameInput = page.getByRole('textbox', { name: 'Rule Name' })
		await editNameInput.click()
		await editNameInput.clear()
		await editNameInput.fill('Updated Rule Name')
		await page.getByTestId('save-button').click()

		// Should show success message (within the form area)
		await expect(page.locator('form .bg-green-50').first()).toBeVisible({ timeout: 10000 })
	})

	test('admin can toggle rule active status', async ({ page }) => {
		// First create a rule
		await page.goto('/admin/social/rules/new')
		await page.waitForLoadState('networkidle')
		await expect(page.getByRole('button', { name: /Twitter\/X ✓/i })).toBeVisible({
			timeout: 15000
		})

		const nameInput = page.getByRole('textbox', { name: 'Rule Name' })
		await nameInput.click()
		await nameInput.fill('Rule to Toggle')

		const descInput = page.getByRole('textbox', { name: 'Description' })
		await descInput.click()
		await descInput.fill('Test rule for toggling')

		await page.locator('select[name="trigger_type"]').selectOption('content_published')
		await page.locator('select[name="content_type_filter"]').selectOption('video')

		// Submit and wait for redirect
		await page.getByTestId('submit-button').click()
		await expect(page).toHaveURL(/\/admin\/social\/rules\/[A-F0-9]{16}$/)

		// Go to rules list
		await page.goto('/admin/social/rules')
		await page.waitForLoadState('networkidle')

		// Wait for table to load
		await expect(page.getByTestId('auto-rules-table')).toBeVisible({ timeout: 10000 })

		// Find the rule and check it's active
		const ruleRow = page.locator('tr').filter({ hasText: 'Rule to Toggle' })
		await expect(ruleRow).toBeVisible({ timeout: 5000 })
		await expect(ruleRow.getByText('Active')).toBeVisible()

		// Toggle to inactive
		await ruleRow.getByRole('button', { name: /Active/i }).click()
		await page.waitForLoadState('networkidle')

		// Check it's now paused
		await expect(ruleRow.getByText('Paused')).toBeVisible()
	})

	test('admin can delete an auto-posting rule', async ({ page }) => {
		// First create a rule
		await page.goto('/admin/social/rules/new')
		await page.waitForLoadState('networkidle')
		await expect(page.getByRole('button', { name: /Twitter\/X ✓/i })).toBeVisible({
			timeout: 15000
		})

		const nameInput = page.getByRole('textbox', { name: 'Rule Name' })
		await nameInput.click()
		await nameInput.fill('Rule to Delete')

		const descInput = page.getByRole('textbox', { name: 'Description' })
		await descInput.click()
		await descInput.fill('Test rule for deletion')

		await page.locator('select[name="trigger_type"]').selectOption('content_published')
		await page.locator('select[name="content_type_filter"]').selectOption('video')

		// Submit and wait for redirect
		await page.getByTestId('submit-button').click()
		await expect(page).toHaveURL(/\/admin\/social\/rules\/[A-F0-9]{16}$/)

		// Wait for edit page to load with delete button
		await page.waitForLoadState('networkidle')
		await page.getByTestId('delete-button').waitFor({ state: 'visible', timeout: 15000 })

		// Click delete button to open dialog
		await page.getByTestId('delete-button').click()

		// Confirm deletion in dialog
		await page.locator('dialog[open]').waitFor({ state: 'visible' })
		await page.getByTestId('confirm-delete-button').click()

		// Should redirect to rules list
		await expect(page).toHaveURL('/admin/social/rules')
	})
})
