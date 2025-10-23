import type { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * Page Object Model for the Moderation Queue pages
 * Handles both the list view (/admin/moderation) and detail view (/admin/moderation/[id])
 */
export class ModerationQueuePage extends BasePage {
	// List view selectors
	readonly queueCountText: Locator
	readonly inspectButtons: Locator

	// Detail view selectors
	readonly approveButton: Locator
	readonly rejectButton: Locator
	readonly statusBadge: Locator

	constructor(page: Page) {
		super(page)

		// List view
		this.queueCountText = page.getByTestId('moderation-queue-count')
		this.inspectButtons = page.getByTestId('moderation-inspect-button')

		// Detail view
		this.approveButton = page.getByTestId('moderation-approve-button')
		this.rejectButton = page.getByTestId('moderation-reject-button')
		this.statusBadge = page.getByTestId('moderation-item-status')
	}

	/**
	 * Navigate to the moderation queue list
	 */
	async gotoQueue(): Promise<void> {
		await this.page.goto('/admin/moderation')
	}

	/**
	 * Navigate to a specific moderation item by ID
	 */
	async gotoItem(id: string): Promise<void> {
		await this.page.goto(`/admin/moderation/${id}`)
	}

	/**
	 * Get the total number of items in the queue from the UI
	 */
	async getQueueCount(): Promise<number> {
		const text = await this.queueCountText.textContent()
		const match = text?.match(/Total items: (\d+)/)
		return match ? parseInt(match[1], 10) : 0
	}

	/**
	 * Click the first inspect button in the queue
	 */
	async inspectFirstItem(): Promise<void> {
		await this.inspectButtons.first().click()
	}

	/**
	 * Approve the current moderation item
	 */
	async approveItem(): Promise<void> {
		await this.approveButton.click()
	}

	/**
	 * Reject the current moderation item
	 */
	async rejectItem(): Promise<void> {
		await this.rejectButton.click()
	}

	/**
	 * Get the status of the current moderation item
	 */
	async getItemStatus(): Promise<string> {
		const text = await this.statusBadge.textContent()
		return text?.trim() || ''
	}

	/**
	 * Wait for navigation back to the queue after approve/reject
	 */
	async expectQueuePage(): Promise<void> {
		await this.page.waitForURL('/admin/moderation')
	}
}
