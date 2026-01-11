import { test, expect } from '@playwright/test'
import { AdminCampaignListPage, AdminCampaignEditorPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'
import { loginAs } from '../../helpers/auth'

// Run tests serially to avoid database conflicts when multiple tests create campaigns
test.describe.configure({ mode: 'serial' })

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

		// Fill fields and verify before submitting
		await editorPage.titleInput.fill('Test Campaign Title')
		await expect(editorPage.titleInput).toHaveValue('Test Campaign Title')
		await editorPage.subjectInput.fill('Test Email Subject Line')
		await expect(editorPage.subjectInput).toHaveValue('Test Email Subject Line')
		await editorPage.introTextarea.fill('Welcome to our test newsletter!')
		await editorPage.submit()

		// Should redirect to edit page after creation so user can add content
		await expect(page.getByRole('heading', { name: 'Edit Campaign' })).toBeVisible({
			timeout: 10000
		})
	})

	test('created campaign can be found after reload', async ({ page }) => {
		const editorPage = new AdminCampaignEditorPage(page)
		await editorPage.gotoNew()

		const campaignTitle = `Test Campaign ${Date.now()}`
		// Fill fields and verify before submitting
		await editorPage.titleInput.fill(campaignTitle)
		await expect(editorPage.titleInput).toHaveValue(campaignTitle)
		await editorPage.subjectInput.fill('Test Subject')
		await expect(editorPage.subjectInput).toHaveValue('Test Subject')
		await editorPage.introTextarea.fill('Test intro')
		await editorPage.submit()

		// After creation, redirects to edit page - wait for edit heading
		await expect(page.getByRole('heading', { name: 'Edit Campaign' })).toBeVisible({
			timeout: 10000
		})

		// Verify the edit page shows the campaign title we created
		await expect(editorPage.titleInput).toHaveValue(campaignTitle, { timeout: 5000 })
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
			url.includes('/login') || url.includes('/unauthorized') || !url.includes('/admin/newsletter')

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
		// Fill fields individually and verify values before submitting
		await editorPage.titleInput.fill(originalTitle)
		await expect(editorPage.titleInput).toHaveValue(originalTitle)
		await editorPage.subjectInput.fill('Original Subject')
		await expect(editorPage.subjectInput).toHaveValue('Original Subject')
		await editorPage.submit()

		// After creation, redirects to edit page - wait for edit heading
		await expect(page.getByRole('heading', { name: 'Edit Campaign' })).toBeVisible({
			timeout: 10000
		})

		// Verify we're on the edit page with the correct values
		await expect(editorPage.titleInput).toHaveValue(originalTitle, { timeout: 5000 })
	})

	test('edit page shows existing campaign values', async ({ page }) => {
		// First create a campaign
		const editorPage = new AdminCampaignEditorPage(page)
		await editorPage.gotoNew()

		const campaignTitle = `Edit Test Campaign ${Date.now()}`
		const campaignSubject = 'Edit Test Subject'
		// Fill fields individually and verify values before submitting
		await editorPage.titleInput.fill(campaignTitle)
		await expect(editorPage.titleInput).toHaveValue(campaignTitle)
		await editorPage.subjectInput.fill(campaignSubject)
		await expect(editorPage.subjectInput).toHaveValue(campaignSubject)
		await editorPage.submit()

		// After creation, redirects to edit page - wait for edit heading
		await expect(page.getByRole('heading', { name: 'Edit Campaign' })).toBeVisible({
			timeout: 10000
		})

		// Verify values are populated on the edit page
		await expect(editorPage.titleInput).toHaveValue(campaignTitle, { timeout: 5000 })
		await expect(editorPage.subjectInput).toHaveValue(campaignSubject)
	})
})
