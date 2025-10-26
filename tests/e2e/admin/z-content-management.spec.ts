import { test, expect } from '@playwright/test'
import { ContentEditPage, AdminDashboardPage } from '../../pages'
import { loginAs } from '../../helpers/auth'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'

test.describe.configure({ mode: 'serial' })

test.describe('Admin Content Management', () => {

	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
		await loginAs(page, 'admin')
	})

	test('admin can edit published content title', async ({ page }) => {
		const dashboardPage = new AdminDashboardPage(page)
		const editPage = new ContentEditPage(page)

		await dashboardPage.gotoContentManagement()
		await dashboardPage.expectContentManagementHeading()

		const firstLink = page.getByTestId('content-edit-link').first()
		await firstLink.waitFor({ state: 'visible' })
		await firstLink.click()

		await page.waitForURL(/\/admin\/content\/[^/]+$/)
		await editPage.expectEditPageLoaded()

		const newTitle = `Updated Title - ${Date.now()}`
		await editPage.editTitle(newTitle)

		await editPage.submit()

		await editPage.expectSuccessMessage()

		await dashboardPage.gotoContentManagement()
		await dashboardPage.expectContentManagementHeading()

		await expect(page.getByTestId('content-edit-link').first()).toBeVisible()
	})

	test('admin can edit content description', async ({ page }) => {
		const dashboardPage = new AdminDashboardPage(page)
		const editPage = new ContentEditPage(page)

		await dashboardPage.gotoContentManagement()
		await dashboardPage.expectContentManagementHeading()

		const links = page.getByTestId('content-edit-link')
		await links.first().waitFor({ state: 'visible' })
		await links.nth(1).click()
		await editPage.expectEditPageLoaded()

		const newDescription = `Updated description - ${Date.now()}`
		await editPage.editDescription(newDescription)

		await editPage.submit()

		await editPage.expectSuccessMessage()
	})

	test('admin can archive published content', async ({ page }) => {
		const dashboardPage = new AdminDashboardPage(page)
		const editPage = new ContentEditPage(page)

		await dashboardPage.gotoContentManagement()
		await dashboardPage.expectContentManagementHeading()

		const firstLink = page.getByTestId('content-edit-link').first()
		await firstLink.waitFor({ state: 'visible' })
		await firstLink.click()
		await editPage.expectEditPageLoaded()

		await editPage.archiveContent()

		await editPage.expectSuccessMessage()

		const archivedRadio = page.getByTestId('category-selector-status-archived').locator('input')
		await expect(archivedRadio).toBeChecked()
	})

	test('admin can unarchive content', async ({ page }) => {
		const dashboardPage = new AdminDashboardPage(page)
		const editPage = new ContentEditPage(page)

		await dashboardPage.gotoContentManagement()
		await dashboardPage.expectContentManagementHeading()

		const firstLink = page.getByTestId('content-edit-link').first()
		await firstLink.waitFor({ state: 'visible' })
		await firstLink.click()
		await editPage.expectEditPageLoaded()

		const archivedRadio = page.getByTestId('category-selector-status-archived').locator('input')
		const isArchived = await archivedRadio.isChecked()

		if (!isArchived) {
			await editPage.archiveContent()
			await editPage.expectSuccessMessage()
		}

		await editPage.unarchiveContent()
		await editPage.expectSuccessMessage()

		const draftRadio = page.getByTestId('category-selector-status-draft').locator('input')
		await expect(draftRadio).toBeChecked()
	})

	test('admin can publish draft content', async ({ page }) => {
		const dashboardPage = new AdminDashboardPage(page)
		const editPage = new ContentEditPage(page)

		await dashboardPage.gotoContentManagement()
		await dashboardPage.expectContentManagementHeading()

		const links = page.getByTestId('content-edit-link')
		await links.first().waitFor({ state: 'visible' })
		await links.nth(1).click()
		await editPage.expectEditPageLoaded()

		const draftRadio = page.getByTestId('category-selector-status-draft').locator('input')
		const isDraft = await draftRadio.isChecked()

		if (!isDraft) {
			await editPage.changeStatus('draft')
			await editPage.submit()
			await editPage.expectSuccessMessage()
		}

		await editPage.publishContent()
		await editPage.expectSuccessMessage()

		const publishedRadio = page.getByTestId('category-selector-status-published').locator('input')
		await expect(publishedRadio).toBeChecked()
	})
})
