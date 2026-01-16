import { test, expect } from '@playwright/test'
import { AdminCampaignListPage, AdminCampaignEditorPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'
import { loginAs } from '../../helpers/auth'
import { setupPlunkMock } from '../../helpers/plunk-mock'

// Run tests serially to avoid database conflicts when multiple tests create campaigns
test.describe.configure({ mode: 'serial' })

test.describe('Admin - Campaign Types', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
		await setupPlunkMock(page)
		await loginAs(page, 'admin')
	})

	test('new campaign page shows campaign type selector', async ({ page }) => {
		const editorPage = new AdminCampaignEditorPage(page)
		await editorPage.gotoNew()
		await editorPage.expectNewPageLoaded()

		// Verify all three campaign type buttons are visible
		await expect(editorPage.contentHighlightsTypeButton).toBeVisible()
		await expect(editorPage.announcementTypeButton).toBeVisible()
		await expect(editorPage.jobsRoundupTypeButton).toBeVisible()
	})

	test('content_highlights type shows intro textarea', async ({ page }) => {
		const editorPage = new AdminCampaignEditorPage(page)
		await editorPage.gotoNew()
		await editorPage.expectNewPageLoaded()

		// Content highlights is the default selection
		await expect(editorPage.introTextarea).toBeVisible()

		// Announcement fields should not be visible
		await expect(editorPage.announcementBodyTextarea).not.toBeVisible()
		await expect(editorPage.jobsIntroTextarea).not.toBeVisible()
	})

	test('announcement type shows announcement fields', async ({ page }) => {
		const editorPage = new AdminCampaignEditorPage(page)
		await editorPage.gotoNew()
		await editorPage.expectNewPageLoaded()

		// Select announcement type
		await editorPage.selectCampaignType('announcement')

		// Announcement fields should be visible
		await expect(editorPage.announcementBodyTextarea).toBeVisible()
		await expect(editorPage.ctaTextInput).toBeVisible()
		await expect(editorPage.ctaUrlInput).toBeVisible()

		// Content highlights intro should not be visible
		await expect(editorPage.introTextarea).not.toBeVisible()
	})

	test('jobs_roundup type shows jobs section', async ({ page }) => {
		const editorPage = new AdminCampaignEditorPage(page)
		await editorPage.gotoNew()
		await editorPage.expectNewPageLoaded()

		// Select jobs roundup type
		await editorPage.selectCampaignType('jobs_roundup')

		// Jobs intro textarea should be visible
		await expect(editorPage.jobsIntroTextarea).toBeVisible()

		// Content highlights intro should not be visible
		await expect(editorPage.introTextarea).not.toBeVisible()
		await expect(editorPage.announcementBodyTextarea).not.toBeVisible()
	})

	test('can switch between campaign types', async ({ page }) => {
		const editorPage = new AdminCampaignEditorPage(page)
		await editorPage.gotoNew()
		await editorPage.expectNewPageLoaded()

		// Start with content_highlights (default)
		await expect(editorPage.introTextarea).toBeVisible()

		// Switch to announcement
		await editorPage.selectCampaignType('announcement')
		await expect(editorPage.announcementBodyTextarea).toBeVisible()
		await expect(editorPage.introTextarea).not.toBeVisible()

		// Switch to jobs_roundup
		await editorPage.selectCampaignType('jobs_roundup')
		await expect(editorPage.jobsIntroTextarea).toBeVisible()
		await expect(editorPage.announcementBodyTextarea).not.toBeVisible()

		// Switch back to content_highlights
		await editorPage.selectCampaignType('content_highlights')
		await expect(editorPage.introTextarea).toBeVisible()
		await expect(editorPage.jobsIntroTextarea).not.toBeVisible()
	})

	test('can create content_highlights campaign', async ({ page }) => {
		const editorPage = new AdminCampaignEditorPage(page)
		await editorPage.gotoNew()
		await editorPage.expectNewPageLoaded()

		const campaignTitle = `Weekly Digest ${Date.now()}`

		// Fill campaign details (content_highlights is default)
		await editorPage.fillCampaignFieldsRobust(campaignTitle, 'Weekly Svelte Digest')
		await editorPage.introTextarea.clear()
		await editorPage.introTextarea.fill('Welcome to this weeks edition!')

		await editorPage.submit()

		// Should redirect to list page
		await expect(page.getByRole('heading', { name: 'Newsletter Campaigns' })).toBeVisible({
			timeout: 10000
		})

		// Campaign should appear in list with Content type badge
		await expect(page.getByText(campaignTitle)).toBeVisible()
		const row = page.getByRole('row').filter({ hasText: campaignTitle })
		await expect(row.getByText('Content', { exact: true })).toBeVisible()
	})

	test('can create announcement campaign', async ({ page }) => {
		const editorPage = new AdminCampaignEditorPage(page)
		await editorPage.gotoNew()
		await editorPage.expectNewPageLoaded()

		const campaignTitle = `Community Update ${Date.now()}`

		// Select announcement type
		await editorPage.selectCampaignType('announcement')

		// Fill campaign details using robust method to handle reactive race conditions
		await editorPage.fillCampaignFieldsRobust(campaignTitle, 'Important Community Update')
		await editorPage.announcementBodyTextarea.fill('<p>We have exciting news to share!</p>')
		await editorPage.ctaTextInput.fill('Learn More')
		await editorPage.ctaUrlInput.fill('https://sveltesociety.dev/blog')

		await editorPage.submit()

		// Should redirect to list page
		await expect(page.getByRole('heading', { name: 'Newsletter Campaigns' })).toBeVisible({
			timeout: 10000
		})

		// Campaign should appear in list with Announcement type badge
		await expect(page.getByText(campaignTitle)).toBeVisible()
		const row = page.getByRole('row').filter({ hasText: campaignTitle })
		await expect(row.getByText('Announcement', { exact: true })).toBeVisible()
	})

	test('can create jobs_roundup campaign', async ({ page }) => {
		const editorPage = new AdminCampaignEditorPage(page)
		await editorPage.gotoNew()
		await editorPage.expectNewPageLoaded()

		const campaignTitle = `Weekly Openings ${Date.now()}`

		// Select jobs roundup type
		await editorPage.selectCampaignType('jobs_roundup')

		// Fill campaign details using robust method to handle reactive race conditions
		await editorPage.fillCampaignFieldsRobust(campaignTitle, 'New Svelte Jobs This Week')
		await editorPage.jobsIntroTextarea.fill('Check out these latest opportunities!')

		await editorPage.submit()

		// Should redirect to list page
		await expect(page.getByRole('heading', { name: 'Newsletter Campaigns' })).toBeVisible({
			timeout: 10000
		})

		// Campaign should appear in list with Jobs type badge
		await expect(page.getByText(campaignTitle)).toBeVisible()
		const row = page.getByRole('row').filter({ hasText: campaignTitle })
		await expect(row.getByText('Jobs', { exact: true })).toBeVisible()
	})

	test('campaign list shows type badges for all types', async ({ page }) => {
		const editorPage = new AdminCampaignEditorPage(page)
		const listPage = new AdminCampaignListPage(page)

		// Create a content_highlights campaign
		await editorPage.gotoNew()
		await editorPage.expectNewPageLoaded()
		await editorPage.fillCampaignFieldsRobust('Badge Test Digest', 'Content Subject')
		await editorPage.submit()
		await expect(page.getByRole('heading', { name: 'Newsletter Campaigns' })).toBeVisible({
			timeout: 10000
		})

		// Create an announcement campaign
		await listPage.clickNewCampaign()
		await editorPage.expectNewPageLoaded()
		await editorPage.selectCampaignType('announcement')
		await editorPage.fillCampaignFieldsRobust('Badge Test News', 'Announcement Subject')
		await editorPage.announcementBodyTextarea.fill('<p>Test content</p>')
		await editorPage.submit()
		await expect(page.getByRole('heading', { name: 'Newsletter Campaigns' })).toBeVisible({
			timeout: 10000
		})

		// Create a jobs_roundup campaign
		await listPage.clickNewCampaign()
		await editorPage.expectNewPageLoaded()
		await editorPage.selectCampaignType('jobs_roundup')
		await editorPage.fillCampaignFieldsRobust('Badge Test Openings', 'Jobs Subject')
		await editorPage.submit()
		await expect(page.getByRole('heading', { name: 'Newsletter Campaigns' })).toBeVisible({
			timeout: 10000
		})

		// Verify all three type badges are visible in the list
		await expect(
			page
				.getByRole('row')
				.filter({ hasText: 'Badge Test Digest' })
				.getByText('Content', { exact: true })
		).toBeVisible()
		await expect(
			page
				.getByRole('row')
				.filter({ hasText: 'Badge Test News' })
				.getByText('Announcement', { exact: true })
		).toBeVisible()
		await expect(
			page
				.getByRole('row')
				.filter({ hasText: 'Badge Test Openings' })
				.getByText('Jobs', { exact: true })
		).toBeVisible()
	})

	test('edit page preserves campaign type and cannot change it', async ({ page }) => {
		const editorPage = new AdminCampaignEditorPage(page)

		// Create an announcement campaign
		await editorPage.gotoNew()
		await editorPage.expectNewPageLoaded()
		await editorPage.selectCampaignType('announcement')

		const campaignTitle = `Edit Type Test ${Date.now()}`
		await editorPage.fillCampaignFieldsRobust(campaignTitle, 'Test Subject')
		await editorPage.announcementBodyTextarea.fill('<p>Original content</p>')
		await editorPage.submit()

		// Should redirect to list page
		await expect(page.getByRole('heading', { name: 'Newsletter Campaigns' })).toBeVisible({
			timeout: 10000
		})

		// Click edit
		const campaignRow = page.getByRole('row').filter({ hasText: campaignTitle })
		await campaignRow.getByRole('link', { name: 'Edit' }).click()

		// Verify we're on edit page with correct type fields
		await expect(page.getByRole('heading', { name: 'Edit Campaign' })).toBeVisible()
		// Wait for form values to load (async data fetch)
		await editorPage.waitForFormValues()

		// Announcement fields should be visible (type is preserved)
		await expect(editorPage.announcementBodyTextarea).toBeVisible()
		await expect(editorPage.announcementBodyTextarea).toHaveValue('<p>Original content</p>')

		// Type selector should not be visible on edit page
		await expect(editorPage.contentHighlightsTypeButton).not.toBeVisible()
		await expect(editorPage.announcementTypeButton).not.toBeVisible()
		await expect(editorPage.jobsRoundupTypeButton).not.toBeVisible()
	})
})
