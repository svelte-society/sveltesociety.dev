import type { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * Page Object Model for the Submit page
 */
export class SubmitPage extends BasePage {
	readonly submitHeading: Locator

	constructor(page: Page) {
		super(page)
		this.submitHeading = page.locator('h1')
	}

	async goto(): Promise<void> {
		await this.page.goto('/submit')
	}

	async expectSubmitHeading(): Promise<void> {
		await this.submitHeading.waitFor({ state: 'visible' })
	}
}
