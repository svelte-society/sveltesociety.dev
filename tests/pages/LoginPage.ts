import type { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * Page Object Model for the Login page
 * Note: loginLink is inherited from BasePage
 */
export class LoginPage extends BasePage {
	readonly githubButton: Locator
	readonly pageHeading: Locator

	constructor(page: Page) {
		super(page)
		this.githubButton = page.locator('a[href*="/auth/github"]')
		this.pageHeading = page.locator('h1')
	}

	async goto(): Promise<void> {
		await this.page.goto('/login')
	}

	async expectGithubButtonVisible(): Promise<void> {
		await this.githubButton.waitFor({ state: 'visible' })
	}
}
