import type { Page, Locator } from '@playwright/test'
import { expect } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * SocialCredentialsPage - Page Object Model for Social Media Credentials admin page
 *
 * Manages navigation and interactions for:
 * - /admin/social/credentials (credentials management)
 *
 * @example
 * const credentialsPage = new SocialCredentialsPage(page)
 * await credentialsPage.goto()
 * await credentialsPage.clickAddCredentials()
 * await credentialsPage.fillAccountName('@sveltesociety')
 * await credentialsPage.submitAdd()
 */
export class SocialCredentialsPage extends BasePage {
	// ========== PAGE SELECTORS ==========

	readonly addCredentialButton: Locator
	readonly backButton: Locator
	readonly submitButton: Locator
	readonly saveButton: Locator
	readonly deleteButton: Locator
	readonly confirmDeleteButton: Locator
	readonly encryptionWarning: Locator

	// ========== FORM SELECTORS ==========

	readonly platformSelect: Locator
	readonly accountNameInput: Locator

	// Twitter fields
	readonly twitterAccessTokenInput: Locator
	readonly twitterRefreshTokenInput: Locator

	// Bluesky fields
	readonly blueskyIdentifierInput: Locator
	readonly blueskyPasswordInput: Locator

	// LinkedIn fields
	readonly linkedinAccessTokenInput: Locator
	readonly linkedinRefreshTokenInput: Locator

	constructor(page: Page) {
		super(page)

		// Page elements
		this.addCredentialButton = page.getByTestId('add-credential-button')
		this.backButton = page.getByTestId('back-button')
		this.submitButton = page.getByTestId('submit-button')
		this.saveButton = page.getByTestId('save-button')
		this.deleteButton = page.getByTestId('delete-button')
		this.confirmDeleteButton = page.getByTestId('confirm-delete-button')
		this.encryptionWarning = page.locator('.bg-amber-50')

		// Form fields
		this.platformSelect = page.getByTestId('select-platform')
		this.accountNameInput = page.getByTestId('input-account-name')

		// Twitter
		this.twitterAccessTokenInput = page.getByTestId('input-twitter-access-token')
		this.twitterRefreshTokenInput = page.getByTestId('input-twitter-refresh-token')

		// Bluesky
		this.blueskyIdentifierInput = page.getByTestId('input-bluesky-identifier')
		this.blueskyPasswordInput = page.getByTestId('input-bluesky-password')

		// LinkedIn
		this.linkedinAccessTokenInput = page.getByTestId('input-linkedin-access-token')
		this.linkedinRefreshTokenInput = page.getByTestId('input-linkedin-refresh-token')
	}

	// ========== NAVIGATION ==========

	async goto(): Promise<void> {
		await this.page.goto('/admin/social/credentials')
		await this.page.waitForLoadState('networkidle')
	}

	async clickBack(): Promise<void> {
		await this.backButton.click()
	}

	// ========== ADD CREDENTIAL ==========

	async clickAddCredentials(): Promise<void> {
		await this.addCredentialButton.click()
		// Wait for form to appear
		await this.accountNameInput.waitFor({ state: 'visible', timeout: 5000 })
	}

	async selectPlatform(platform: 'twitter' | 'bluesky' | 'linkedin'): Promise<void> {
		await this.platformSelect.selectOption(platform)
	}

	async fillAccountName(name: string): Promise<void> {
		await this.accountNameInput.click()
		await this.accountNameInput.fill(name)
	}

	// Twitter
	async fillTwitterCredentials(accessToken: string, refreshToken?: string): Promise<void> {
		await this.twitterAccessTokenInput.fill(accessToken)
		if (refreshToken) {
			await this.twitterRefreshTokenInput.fill(refreshToken)
		}
	}

	// Bluesky
	async fillBlueskyCredentials(identifier: string, password: string): Promise<void> {
		await this.blueskyIdentifierInput.fill(identifier)
		await this.blueskyPasswordInput.fill(password)
	}

	// LinkedIn
	async fillLinkedinCredentials(accessToken: string, refreshToken?: string): Promise<void> {
		await this.linkedinAccessTokenInput.fill(accessToken)
		if (refreshToken) {
			await this.linkedinRefreshTokenInput.fill(refreshToken)
		}
	}

	async submitAdd(): Promise<void> {
		await this.submitButton.click()
		// Wait for network to settle - form will close on success
		await this.page.waitForLoadState('networkidle')
		// Short wait to allow Svelte reactivity to complete
		await this.page.waitForTimeout(500)
	}

	// ========== EDIT CREDENTIAL ==========

	async clickEdit(credentialId?: string): Promise<void> {
		if (credentialId) {
			await this.page
				.locator(`[data-testid="credential-row-${credentialId}"]`)
				.getByTestId('edit-button')
				.click()
		} else {
			await this.page.getByTestId('edit-button').first().click()
		}
		// Wait for edit form to appear
		await this.page.getByTestId('save-button').waitFor({ state: 'visible', timeout: 5000 })
	}

	async fillEditAccountName(name: string): Promise<void> {
		const input = this.page.getByTestId('input-edit-account-name')
		await input.click()
		await input.clear()
		await input.fill(name)
	}

	async fillEditTwitterCredentials(accessToken: string, refreshToken?: string): Promise<void> {
		await this.page.getByTestId('input-edit-twitter-access-token').fill(accessToken)
		if (refreshToken) {
			await this.page.getByTestId('input-edit-twitter-refresh-token').fill(refreshToken)
		}
	}

	async fillEditBlueskyCredentials(identifier: string, password: string): Promise<void> {
		await this.page.getByTestId('input-edit-bluesky-identifier').fill(identifier)
		await this.page.getByTestId('input-edit-bluesky-password').fill(password)
	}

	async fillEditLinkedinCredentials(accessToken: string, refreshToken?: string): Promise<void> {
		await this.page.getByTestId('input-edit-linkedin-access-token').fill(accessToken)
		if (refreshToken) {
			await this.page.getByTestId('input-edit-linkedin-refresh-token').fill(refreshToken)
		}
	}

	async saveEdit(): Promise<void> {
		await this.saveButton.click()
		// Wait for success or error
		await Promise.race([
			this.page.locator('div.bg-green-50').first().waitFor({ state: 'visible', timeout: 15000 }),
			this.page.locator('div.bg-red-50').first().waitFor({ state: 'visible', timeout: 15000 })
		])
	}

	// ========== DELETE CREDENTIAL ==========

	async clickDeleteByAccountName(accountName: string): Promise<void> {
		// Find the credential row containing this account name and click its delete button
		const credentialRow = this.page.locator('[data-testid^="credential-row-"]').filter({
			hasText: accountName
		})
		await credentialRow.getByTestId('delete-button').click()
		// Wait for dialog
		await this.page.locator('dialog[open]').waitFor({ state: 'visible' })
	}

	async clickDelete(credentialId?: string): Promise<void> {
		if (credentialId) {
			await this.page
				.locator(`[data-testid="credential-row-${credentialId}"]`)
				.getByTestId('delete-button')
				.click()
		} else {
			await this.page.getByTestId('delete-button').first().click()
		}
		// Wait for dialog
		await this.page.locator('dialog[open]').waitFor({ state: 'visible' })
	}

	async confirmDelete(): Promise<void> {
		await this.confirmDeleteButton.click()
		await this.page.waitForLoadState('networkidle')
	}

	async deleteCredential(credentialId?: string): Promise<void> {
		await this.clickDelete(credentialId)
		await this.confirmDelete()
	}

	async deleteCredentialByAccountName(accountName: string): Promise<void> {
		await this.clickDeleteByAccountName(accountName)
		await this.confirmDelete()
	}

	// ========== TOGGLE ACTIVE ==========

	async toggleActiveByAccountName(accountName: string): Promise<void> {
		// Find the credential row containing this account name and click its toggle button
		const credentialRow = this.page.locator('[data-testid^="credential-row-"]').filter({
			hasText: accountName
		})
		await credentialRow.getByTestId('toggle-active-button').click()
		await this.page.waitForLoadState('networkidle')
	}

	async toggleActive(credentialId?: string): Promise<void> {
		if (credentialId) {
			await this.page
				.locator(`[data-testid="credential-row-${credentialId}"]`)
				.getByTestId('toggle-active-button')
				.click()
		} else {
			await this.page.getByTestId('toggle-active-button').first().click()
		}
		await this.page.waitForLoadState('networkidle')
	}

	async getToggleButtonTextByAccountName(accountName: string): Promise<string> {
		const credentialRow = this.page.locator('[data-testid^="credential-row-"]').filter({
			hasText: accountName
		})
		return (await credentialRow.getByTestId('toggle-active-button').textContent()) ?? ''
	}

	// ========== ASSERTIONS ==========

	async expectCredentialsPage(): Promise<void> {
		await expect(this.page).toHaveURL('/admin/social/credentials')
		await expect(this.page.getByRole('heading', { name: /Platform Credentials/i })).toBeVisible()
	}

	async expectEncryptionWarning(): Promise<void> {
		await expect(this.encryptionWarning).toBeVisible()
	}

	async expectNoEncryptionWarning(): Promise<void> {
		await expect(this.encryptionWarning).not.toBeVisible()
	}

	async expectCredentialWithAccountName(name: string): Promise<void> {
		await expect(this.page.getByText(name)).toBeVisible()
	}

	async expectNoCredentialWithAccountName(name: string): Promise<void> {
		await expect(this.page.getByText(name)).not.toBeVisible()
	}

	async expectSuccessMessage(): Promise<void> {
		await expect(this.page.locator('div.bg-green-50').first()).toBeVisible()
	}

	async expectErrorMessage(): Promise<void> {
		await expect(this.page.locator('div.bg-red-50').first()).toBeVisible()
	}

	async expectActiveStatus(credentialId: string): Promise<void> {
		await expect(
			this.page
				.locator(`[data-testid="credential-row-${credentialId}"]`)
				.getByTestId('status-active')
		).toBeVisible()
	}

	async expectInactiveStatus(credentialId: string): Promise<void> {
		await expect(
			this.page
				.locator(`[data-testid="credential-row-${credentialId}"]`)
				.getByTestId('status-inactive')
		).toBeVisible()
	}

	async expectNoPlatformCredentials(platform: 'twitter' | 'bluesky' | 'linkedin'): Promise<void> {
		await expect(this.page.getByTestId(`no-credentials-${platform}`)).toBeVisible()
	}

	async getCredentialCount(): Promise<number> {
		return await this.page.locator('[data-testid^="credential-row-"]').count()
	}
}
