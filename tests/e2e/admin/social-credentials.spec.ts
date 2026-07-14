import { test, expect } from '@playwright/test'
import { SocialCredentialsPage, SocialPostsPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'
import { loginAs } from '../../helpers/auth'

test.describe('Admin: Social Credentials', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
		await loginAs(page, 'admin')
	})

	test('admin can view credentials page', async ({ page }) => {
		const credentialsPage = new SocialCredentialsPage(page)
		await credentialsPage.goto()

		await credentialsPage.expectCredentialsPage()
		// Should see platform section headers (use heading role to be specific)
		await expect(page.getByRole('heading', { name: 'Twitter/X' })).toBeVisible()
		await expect(page.getByRole('heading', { name: 'Bluesky' })).toBeVisible()
		await expect(page.getByRole('heading', { name: 'LinkedIn' })).toBeVisible()
	})

	test('admin can navigate to credentials page from social posts', async ({ page }) => {
		const socialPage = new SocialPostsPage(page)
		await socialPage.gotoList()

		// Click credentials link
		await page.getByTestId('credentials-button').click()

		const credentialsPage = new SocialCredentialsPage(page)
		await credentialsPage.expectCredentialsPage()
	})

	test('admin can add Twitter credentials', async ({ page }) => {
		const credentialsPage = new SocialCredentialsPage(page)
		await credentialsPage.goto()

		// Click add button
		await credentialsPage.clickAddCredentials()

		// Fill in form
		await credentialsPage.selectPlatform('twitter')
		await credentialsPage.fillAccountName('@sveltesociety')
		await credentialsPage.fillTwitterCredentials('test_access_token_12345', 'test_refresh_token')

		// Submit
		await credentialsPage.submitAdd()

		// Should show success message
		await credentialsPage.expectSuccessMessage()

		// Should display the credential
		await credentialsPage.expectCredentialWithAccountName('@sveltesociety')
	})

	test('admin can add Bluesky credentials', async ({ page }) => {
		const credentialsPage = new SocialCredentialsPage(page)
		await credentialsPage.goto()

		// Click add button
		await credentialsPage.clickAddCredentials()

		// Fill in form
		await credentialsPage.selectPlatform('bluesky')
		await credentialsPage.fillAccountName('sveltesociety.bsky.social')
		await credentialsPage.fillBlueskyCredentials('sveltesociety.bsky.social', 'test-app-password')

		// Submit
		await credentialsPage.submitAdd()

		// Should show success message
		await credentialsPage.expectSuccessMessage()

		// Should display the credential
		await credentialsPage.expectCredentialWithAccountName('sveltesociety.bsky.social')
	})

	test('admin can add LinkedIn credentials', async ({ page }) => {
		const credentialsPage = new SocialCredentialsPage(page)
		await credentialsPage.goto()

		// Click add button
		await credentialsPage.clickAddCredentials()

		// Fill in form
		await credentialsPage.selectPlatform('linkedin')
		await credentialsPage.fillAccountName('Svelte Society')
		await credentialsPage.fillLinkedinCredentials('test_linkedin_access_token')

		// Submit
		await credentialsPage.submitAdd()

		// Should show success message
		await credentialsPage.expectSuccessMessage()

		// Should display the credential
		await credentialsPage.expectCredentialWithAccountName('Svelte Society')
	})

	test('admin can edit credentials', async ({ page }) => {
		const credentialsPage = new SocialCredentialsPage(page)
		await credentialsPage.goto()

		// First add a credential
		await credentialsPage.clickAddCredentials()
		await credentialsPage.selectPlatform('twitter')
		await credentialsPage.fillAccountName('@oldname')
		await credentialsPage.fillTwitterCredentials('old_access_token')
		await credentialsPage.submitAdd()
		await credentialsPage.expectSuccessMessage()

		// Now edit it
		await credentialsPage.clickEdit()

		// Update the account name and credentials
		await credentialsPage.fillEditAccountName('@newname')
		await credentialsPage.fillEditTwitterCredentials('new_access_token')
		await credentialsPage.saveEdit()

		// Should show success message
		await credentialsPage.expectSuccessMessage()

		// Should display updated credential
		await credentialsPage.expectCredentialWithAccountName('@newname')
	})

	test('admin can delete credentials', async ({ page }) => {
		const credentialsPage = new SocialCredentialsPage(page)
		await credentialsPage.goto()

		// First add a credential with unique name
		await credentialsPage.clickAddCredentials()
		await credentialsPage.selectPlatform('bluesky')
		await credentialsPage.fillAccountName('todelete.bsky.social')
		await credentialsPage.fillBlueskyCredentials('todelete.bsky.social', 'test-password')
		await credentialsPage.submitAdd()
		await credentialsPage.expectSuccessMessage()

		// Verify it exists
		await credentialsPage.expectCredentialWithAccountName('todelete.bsky.social')

		// Delete the specific credential by account name
		await credentialsPage.deleteCredentialByAccountName('todelete.bsky.social')

		// Should no longer be visible
		await credentialsPage.expectNoCredentialWithAccountName('todelete.bsky.social')
	})

	test('admin can toggle credential active status', async ({ page }) => {
		const credentialsPage = new SocialCredentialsPage(page)
		await credentialsPage.goto()

		// First add a credential with unique name
		const accountName = 'Toggle Test Account'
		await credentialsPage.clickAddCredentials()
		await credentialsPage.selectPlatform('linkedin')
		await credentialsPage.fillAccountName(accountName)
		await credentialsPage.fillLinkedinCredentials('toggle_test_token')
		await credentialsPage.submitAdd()
		await credentialsPage.expectSuccessMessage()

		// Verify credential was added
		await credentialsPage.expectCredentialWithAccountName(accountName)

		// The credential should be active by default (button says "Deactivate")
		let buttonText = await credentialsPage.getToggleButtonTextByAccountName(accountName)
		expect(buttonText).toContain('Deactivate')

		// Deactivate it using the specific credential
		await credentialsPage.toggleActiveByAccountName(accountName)

		// Reload page to get fresh data (form submission doesn't auto-refresh data)
		await credentialsPage.goto()
		buttonText = await credentialsPage.getToggleButtonTextByAccountName(accountName)
		expect(buttonText).toContain('Activate')

		// Reactivate it
		await credentialsPage.toggleActiveByAccountName(accountName)

		// Reload page to get fresh data
		await credentialsPage.goto()
		buttonText = await credentialsPage.getToggleButtonTextByAccountName(accountName)
		expect(buttonText).toContain('Deactivate')
	})

	test('non-admin cannot access credentials page', async ({ page }) => {
		// Login as viewer (non-admin)
		await loginAs(page, 'viewer')

		// Try to access credentials
		await page.goto('/admin/social/credentials')

		// Should redirect away from admin area
		await expect(page).not.toHaveURL(/\/admin\/social\/credentials/)
	})

	test('validates required fields when adding Twitter credentials', async ({ page }) => {
		const credentialsPage = new SocialCredentialsPage(page)
		await credentialsPage.goto()

		// Click add button
		await credentialsPage.clickAddCredentials()

		// Try to submit without filling required fields
		await credentialsPage.selectPlatform('twitter')
		await credentialsPage.fillAccountName('@test')
		// Don't fill access token

		// Click submit - HTML5 validation should prevent submission
		await page.getByTestId('submit-button').click()

		// Form should still be visible (submission was blocked)
		await expect(page.getByTestId('input-twitter-access-token')).toBeVisible()

		// Check that the required field has validation error (browser-native)
		const accessTokenInput = page.getByTestId('input-twitter-access-token')
		const isInvalid = await accessTokenInput.evaluate((el: HTMLInputElement) => !el.checkValidity())
		expect(isInvalid).toBe(true)
	})

	test('validates required fields when adding Bluesky credentials', async ({ page }) => {
		const credentialsPage = new SocialCredentialsPage(page)
		await credentialsPage.goto()

		// Click add button
		await credentialsPage.clickAddCredentials()

		// Try to submit with partial fields
		await credentialsPage.selectPlatform('bluesky')
		await credentialsPage.fillAccountName('@test')
		await credentialsPage.fillBlueskyCredentials('identifier.bsky.social', '') // Empty password

		// Click submit - HTML5 validation should prevent submission
		await page.getByTestId('submit-button').click()

		// Form should still be visible (submission was blocked)
		await expect(page.getByTestId('input-bluesky-password')).toBeVisible()

		// Check that the required field has validation error (browser-native)
		const passwordInput = page.getByTestId('input-bluesky-password')
		const isInvalid = await passwordInput.evaluate((el: HTMLInputElement) => !el.checkValidity())
		expect(isInvalid).toBe(true)
	})

	test('can add multiple credentials for different platforms', async ({ page }) => {
		const credentialsPage = new SocialCredentialsPage(page)
		await credentialsPage.goto()

		// Get initial credential count
		const initialCount = await credentialsPage.getCredentialCount()

		// Add Twitter credential with unique name
		await credentialsPage.clickAddCredentials()
		await credentialsPage.selectPlatform('twitter')
		await credentialsPage.fillAccountName('@multi_twitter_test')
		await credentialsPage.fillTwitterCredentials('twitter_token')
		await credentialsPage.submitAdd()
		await credentialsPage.expectSuccessMessage()

		// Add Bluesky credential with unique name
		await credentialsPage.clickAddCredentials()
		await credentialsPage.selectPlatform('bluesky')
		await credentialsPage.fillAccountName('multi.bsky.social')
		await credentialsPage.fillBlueskyCredentials('multi.bsky.social', 'bsky_pass')
		await credentialsPage.submitAdd()
		await credentialsPage.expectSuccessMessage()

		// Add LinkedIn credential with unique name
		await credentialsPage.clickAddCredentials()
		await credentialsPage.selectPlatform('linkedin')
		await credentialsPage.fillAccountName('Multi Test LinkedIn')
		await credentialsPage.fillLinkedinCredentials('linkedin_token')
		await credentialsPage.submitAdd()
		await credentialsPage.expectSuccessMessage()

		// All three should be visible
		await credentialsPage.expectCredentialWithAccountName('@multi_twitter_test')
		await credentialsPage.expectCredentialWithAccountName('multi.bsky.social')
		await credentialsPage.expectCredentialWithAccountName('Multi Test LinkedIn')

		// Should have 3 more credentials than before
		const finalCount = await credentialsPage.getCredentialCount()
		expect(finalCount).toBe(initialCount + 3)
	})

	test('can navigate back to social posts from credentials page', async ({ page }) => {
		const credentialsPage = new SocialCredentialsPage(page)
		await credentialsPage.goto()

		// Click back button
		await credentialsPage.clickBack()

		// Should be on social posts page
		await expect(page).toHaveURL('/admin/social')
	})
})
