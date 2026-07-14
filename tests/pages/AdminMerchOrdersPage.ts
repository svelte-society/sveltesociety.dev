import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { BasePage } from './BasePage'

export class AdminMerchOrdersPage extends BasePage {
	constructor(page: Page) {
		super(page)
	}

	async goto(): Promise<void> {
		await this.page.goto('/admin/merch/orders')
	}

	get heading(): Locator {
		return this.page.getByRole('heading', { name: 'Merch Orders' })
	}

	get statusFilter(): Locator {
		return this.page.getByTestId('status-filter')
	}

	get syncAllButton(): Locator {
		return this.page.getByTestId('sync-all')
	}

	get emptyState(): Locator {
		return this.page.getByText('No orders found')
	}

	get sidebarLink(): Locator {
		return this.page.getByRole('link', { name: 'Merch Orders', exact: true })
	}

	async expectPageLoaded(): Promise<void> {
		await expect(this.heading).toBeVisible()
		await expect(this.statusFilter).toBeVisible()
		await expect(this.syncAllButton).toBeVisible()
	}
}
