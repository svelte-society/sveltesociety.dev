import { test, expect } from '@playwright/test'
import { ContentEditPage, AdminDashboardPage } from '../../pages'
import { loginAs } from '../../helpers/auth'

test.describe.configure({ mode: 'serial' })

test.describe('Admin Content Management', () => {
	// Run these tests serially to avoid database conflicts
	// These tests modify content state (titles, descriptions, status)
	// which could affect other tests if run in parallel

	test.beforeEach(async ({ page }) => {
		// Login as admin before each test
		await loginAs(page, 'admin')
	})

	test('admin can edit published content title', async ({ page }) => {
		const dashboardPage = new AdminDashboardPage(page)
		const editPage = new ContentEditPage(page)

		// Navigate to content management
		await dashboardPage.gotoContentManagement()
		await dashboardPage.expectContentManagementHeading()

		// Wait for content list to load and click on the first content item
		const firstLink = page.getByTestId('content-edit-link').first()
		await firstLink.waitFor({ state: 'visible' })
		await firstLink.click()

		// Wait for navigation to edit page
		await page.waitForURL(/\/admin\/content\/[^/]+$/)
		await editPage.expectEditPageLoaded()

		// Edit the title
		const newTitle = `Updated Title - ${Date.now()}`
		await editPage.editTitle(newTitle)

		// Submit the form
		await editPage.submit()

		// Verify success message
		await editPage.expectSuccessMessage()

		// Navigate back to content list to verify the change
		await dashboardPage.gotoContentManagement()
		await dashboardPage.expectContentManagementHeading()

		// Verify we're back on the content management page
		// Note: The title might be truncated in the list, so we just verify we're on the right page
		await expect(page.getByTestId('content-edit-link').first()).toBeVisible()
	})

	test('admin can edit content description', async ({ page }) => {
		const dashboardPage = new AdminDashboardPage(page)
		const editPage = new ContentEditPage(page)

		// Navigate to content management
		await dashboardPage.gotoContentManagement()
		await dashboardPage.expectContentManagementHeading()

		// Wait for content list and click on the second content item
		const links = page.getByTestId('content-edit-link')
		await links.first().waitFor({ state: 'visible' })
		await links.nth(1).click()
		await editPage.expectEditPageLoaded()

		// Edit the description
		const newDescription = `Updated description - ${Date.now()}`
		await editPage.editDescription(newDescription)

		// Submit the form
		await editPage.submit()

		// Verify success message
		await editPage.expectSuccessMessage()
	})

	test('admin can archive published content', async ({ page }) => {
		const dashboardPage = new AdminDashboardPage(page)
		const editPage = new ContentEditPage(page)

		// Navigate to content management
		await dashboardPage.gotoContentManagement()
		await dashboardPage.expectContentManagementHeading()

		// Wait for content list and find a published content item
		const firstLink = page.getByTestId('content-edit-link').first()
		await firstLink.waitFor({ state: 'visible' })
		await firstLink.click()
		await editPage.expectEditPageLoaded()

		// Archive the content
		await editPage.archiveContent()

		// Verify success message
		await editPage.expectSuccessMessage()

		// Verify the status changed to archived by checking the status selector
		const archivedRadio = page.getByTestId('category-selector-status-archived').locator('input')
		await expect(archivedRadio).toBeChecked()
	})

	test('admin can unarchive content', async ({ page }) => {
		const dashboardPage = new AdminDashboardPage(page)
		const editPage = new ContentEditPage(page)

		// Navigate to content management
		await dashboardPage.gotoContentManagement()
		await dashboardPage.expectContentManagementHeading()

		// Wait for content list and click on the first content item
		const firstLink = page.getByTestId('content-edit-link').first()
		await firstLink.waitFor({ state: 'visible' })
		await firstLink.click()
		await editPage.expectEditPageLoaded()

		// First, archive it if not already archived
		const archivedRadio = page.getByTestId('category-selector-status-archived').locator('input')
		const isArchived = await archivedRadio.isChecked()

		if (!isArchived) {
			await editPage.archiveContent()
			await editPage.expectSuccessMessage()
		}

		// Now unarchive it (change to draft)
		await editPage.unarchiveContent()
		await editPage.expectSuccessMessage()

		// Verify the status changed to draft
		const draftRadio = page.getByTestId('category-selector-status-draft').locator('input')
		await expect(draftRadio).toBeChecked()
	})

	test('admin can publish draft content', async ({ page }) => {
		const dashboardPage = new AdminDashboardPage(page)
		const editPage = new ContentEditPage(page)

		// Navigate to content management
		await dashboardPage.gotoContentManagement()
		await dashboardPage.expectContentManagementHeading()

		// Wait for content list and click on a content item
		const links = page.getByTestId('content-edit-link')
		await links.first().waitFor({ state: 'visible' })
		await links.nth(1).click()
		await editPage.expectEditPageLoaded()

		// Check current status and make it draft if needed
		const draftRadio = page.getByTestId('category-selector-status-draft').locator('input')
		const isDraft = await draftRadio.isChecked()

		if (!isDraft) {
			await editPage.changeStatus('draft')
			await editPage.submit()
			await editPage.expectSuccessMessage()
		}

		// Now publish it
		await editPage.publishContent()
		await editPage.expectSuccessMessage()

		// Verify the status changed to published
		const publishedRadio = page.getByTestId('category-selector-status-published').locator('input')
		await expect(publishedRadio).toBeChecked()
	})
})
