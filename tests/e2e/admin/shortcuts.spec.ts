import { test, expect } from '../../fixtures/auth.fixture'
import { ShortcutsPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'

test.describe.serial('Admin - Sidebar Shortcuts', () => {
	test.use({ authenticatedAs: 'admin' })

	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('can view shortcuts list page', async ({ page }) => {
		const shortcutsPage = new ShortcutsPage(page)
		await shortcutsPage.gotoList()

		await expect(page).toHaveURL('/admin/shortcuts')
		await expect(shortcutsPage.shortcutsTable).toBeVisible()
	})

	test('shows empty state when no shortcuts exist', async ({ page }) => {
		const shortcutsPage = new ShortcutsPage(page)
		await shortcutsPage.gotoList()

		// Initially should show empty state (database has no shortcuts)
		const isEmpty = await shortcutsPage.isEmptyStateVisible()
		const count = await shortcutsPage.getShortcutCount()

		// Either empty state is visible or there are no rows
		expect(isEmpty || count === 0).toBeTruthy()
	})

	test('can navigate to add shortcut form', async ({ page }) => {
		const shortcutsPage = new ShortcutsPage(page)
		await shortcutsPage.gotoList()

		await shortcutsPage.clickAddShortcut()

		await expect(page).toHaveURL('/admin/shortcuts/new')
	})

	test('can create a new shortcut', async ({ page }) => {
		const shortcutsPage = new ShortcutsPage(page)
		await shortcutsPage.gotoNew()

		// Type to search for content (combobox requires typing to trigger oninput)
		await shortcutsPage.contentSelect.click()
		await shortcutsPage.contentSelect.pressSequentially('Test')
		// Wait for options to appear (300ms debounce + API call)
		await page.getByRole('option').first().waitFor({ state: 'visible', timeout: 5000 })
		await page.getByRole('option').first().click()

		await shortcutsPage.setPriority(10)

		await shortcutsPage.submitForm()

		// Should redirect back to list
		await shortcutsPage.expectListPage()

		// Should now have at least one shortcut
		const count = await shortcutsPage.getShortcutCount()
		expect(count).toBeGreaterThan(0)
	})

	test('can toggle shortcut status', async ({ page }) => {
		const shortcutsPage = new ShortcutsPage(page)

		// First create a shortcut
		await shortcutsPage.gotoNew()
		await shortcutsPage.contentSelect.click()
		await shortcutsPage.contentSelect.pressSequentially('Test')
		await page.getByRole('option').first().waitFor({ state: 'visible', timeout: 5000 })
		await page.getByRole('option').first().click()
		await shortcutsPage.submitForm()
		await shortcutsPage.expectListPage()

		// Get initial status
		const initialStatus = await shortcutsPage.getFirstShortcutStatus()

		// Toggle status
		await shortcutsPage.toggleFirstShortcut()

		// Wait for status to change
		await expect(async () => {
			const newStatus = await shortcutsPage.getFirstShortcutStatus()
			expect(newStatus).not.toBe(initialStatus)
		}).toPass({ timeout: 5000 })

		// Status should have changed
		const newStatus = await shortcutsPage.getFirstShortcutStatus()
		expect(newStatus).not.toBe(initialStatus)
	})

	test('can delete a shortcut', async ({ page }) => {
		const shortcutsPage = new ShortcutsPage(page)

		// First create a shortcut
		await shortcutsPage.gotoNew()
		await shortcutsPage.contentSelect.click()
		await shortcutsPage.contentSelect.pressSequentially('Test')
		await page.getByRole('option').first().waitFor({ state: 'visible', timeout: 5000 })
		await page.getByRole('option').first().click()
		await shortcutsPage.submitForm()
		await shortcutsPage.expectListPage()

		const initialCount = await shortcutsPage.getShortcutCount()
		expect(initialCount).toBeGreaterThan(0)

		// Delete the shortcut
		await shortcutsPage.deleteFirstShortcut()

		// Wait for count to decrease
		await expect(async () => {
			const newCount = await shortcutsPage.getShortcutCount()
			expect(newCount).toBeLessThan(initialCount)
		}).toPass({ timeout: 5000 })
	})
})
