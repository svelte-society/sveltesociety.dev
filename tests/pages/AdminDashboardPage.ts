import type { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * Page Object Model for Admin Dashboard and admin pages
 */
export class AdminDashboardPage extends BasePage {
	readonly dashboardHeading: Locator
	readonly contentManagementHeading: Locator
	readonly userMenuTrigger: Locator

	constructor(page: Page) {
		super(page)
		this.dashboardHeading = page.locator('h1', { hasText: 'Dashboard' })
		this.contentManagementHeading = page.getByRole('heading', { name: 'Content Management' })
		this.userMenuTrigger = page.getByTestId('user-menu-trigger')
	}

	async gotoDashboard(): Promise<void> {
		await this.page.goto('/admin', { waitUntil: 'networkidle' })
	}

	async gotoContentManagement(): Promise<void> {
		await this.page.goto('/admin/content', { waitUntil: 'networkidle' })
	}

	async gotoUserManagement(): Promise<void> {
		await this.page.goto('/admin/users', { waitUntil: 'networkidle' })
	}

	async expectDashboardHeading(): Promise<void> {
		await this.dashboardHeading.waitFor({ state: 'visible', timeout: 30000 })
	}

	async expectContentManagementHeading(): Promise<void> {
		await this.contentManagementHeading.waitFor({ state: 'visible', timeout: 30000 })
	}

	async expectUserMenuVisible(): Promise<void> {
		await this.userMenuTrigger.waitFor({ state: 'visible' })
	}
}
