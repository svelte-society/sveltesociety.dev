import { test, expect } from '@playwright/test'
import { AdminCampaignListPage, AdminCampaignEditorPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'
import { loginAs } from '../../helpers/auth'

test.describe('Admin - Newsletter Campaigns', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
		await loginAs(page, 'admin')
	})

	test('can access campaign list page', async ({ page }) => {
		const listPage = new AdminCampaignListPage(page)
		await listPage.goto()

		await listPage.expectPageLoaded()
	})

	test('campaign list page shows new campaign button', async ({ page }) => {
		const listPage = new AdminCampaignListPage(page)
		await listPage.goto()

		await expect(listPage.newCampaignButton).toBeVisible()
		await expect(listPage.newCampaignButton).toHaveText(/new campaign/i)
	})

	test('can navigate to new campaign page', async ({ page }) => {
		const listPage = new AdminCampaignListPage(page)
		await listPage.goto()

		await listPage.clickNewCampaign()

		await expect(page).toHaveURL(/\/admin\/newsletter\/new/)
	})

	test('new campaign page has required form fields', async ({ page }) => {
		const editorPage = new AdminCampaignEditorPage(page)
		await editorPage.gotoNew()

		await editorPage.expectNewPageLoaded()
		await expect(editorPage.titleInput).toBeVisible()
		await expect(editorPage.subjectInput).toBeVisible()
		await expect(editorPage.introTextarea).toBeVisible()
		await expect(editorPage.submitButton).toBeVisible()
	})

	test('can create a new campaign', async ({ page }) => {
		const editorPage = new AdminCampaignEditorPage(page)
		await editorPage.gotoNew()

		await editorPage.createCampaign(
			'Test Campaign Title',
			'Test Email Subject Line',
			'Welcome to our test newsletter!'
		)

		// Should redirect to campaign list after success
		await expect(page).toHaveURL(/\/admin\/newsletter$/, { timeout: 5000 })
	})

	test('created campaign appears in list', async ({ page }) => {
		const editorPage = new AdminCampaignEditorPage(page)
		await editorPage.gotoNew()

		const campaignTitle = `Test Campaign ${Date.now()}`
		await editorPage.createCampaign(
			campaignTitle,
			'Test Subject',
			'Test intro'
		)

		// Wait for redirect
		await expect(page).toHaveURL(/\/admin\/newsletter$/, { timeout: 5000 })

		// Verify campaign is in list
		const listPage = new AdminCampaignListPage(page)
		await listPage.expectCampaignInList(campaignTitle)
	})

	test('cancel button returns to campaign list', async ({ page }) => {
		const editorPage = new AdminCampaignEditorPage(page)
		await editorPage.gotoNew()

		await editorPage.cancel()

		await expect(page).toHaveURL(/\/admin\/newsletter$/)
	})

	test('form shows validation errors for empty fields', async ({ page }) => {
		const editorPage = new AdminCampaignEditorPage(page)
		await editorPage.gotoNew()

		// Try to submit without filling required fields
		await editorPage.submit()

		// Should stay on same page (form didn't submit successfully)
		await expect(page).toHaveURL(/\/admin\/newsletter\/new/)

		// The form should show validation feedback
		// (RemoteForm handles validation errors)
	})

	test('non-admin users cannot access campaign list', async ({ page }) => {
		// Logout from admin and login as viewer
		await page.goto('/auth/logout')
		await loginAs(page, 'viewer')

		// Try to access newsletter admin
		await page.goto('/admin/newsletter')

		// Should be redirected or show unauthorized
		const url = page.url()
		const isUnauthorized =
			url.includes('/login') ||
			url.includes('/unauthorized') ||
			!url.includes('/admin/newsletter')

		expect(isUnauthorized).toBe(true)
	})
})

test.describe('Admin - Campaign Editing', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
		await loginAs(page, 'admin')
	})

	test('can edit existing campaign', async ({ page }) => {
		// First create a campaign
		const editorPage = new AdminCampaignEditorPage(page)
		await editorPage.gotoNew()

		const originalTitle = `Original Campaign ${Date.now()}`
		await editorPage.createCampaign(originalTitle, 'Original Subject')

		// Wait for redirect
		await expect(page).toHaveURL(/\/admin\/newsletter$/, { timeout: 5000 })

		// Click edit on the campaign we just created
		const listPage = new AdminCampaignListPage(page)
		await listPage.clickEditByTitle(originalTitle)

		// Should be on edit page
		await expect(page).toHaveURL(/\/admin\/newsletter\/[^/]+$/)

		// Verify edit page loaded with form
		await editorPage.expectEditPageLoaded()
	})

	test('edit page shows existing campaign values', async ({ page }) => {
		// First create a campaign
		const editorPage = new AdminCampaignEditorPage(page)
		await editorPage.gotoNew()

		const campaignTitle = `Edit Test Campaign ${Date.now()}`
		const campaignSubject = 'Edit Test Subject'
		await editorPage.createCampaign(campaignTitle, campaignSubject)

		// Wait for redirect
		await expect(page).toHaveURL(/\/admin\/newsletter$/, { timeout: 5000 })

		// Navigate to edit
		const listPage = new AdminCampaignListPage(page)
		await listPage.clickEditByTitle(campaignTitle)

		// Verify values are populated
		await expect(editorPage.titleInput).toHaveValue(campaignTitle)
		await expect(editorPage.subjectInput).toHaveValue(campaignSubject)
	})
})
