import { expect, type Locator } from '@playwright/test'
import { BasePage } from './BasePage'

export class ContentManagementPage extends BasePage {
	get contentLinks(): Locator {
		return this.page.getByTestId('content-edit-link')
	}

	get pagination(): Locator {
		return this.page.getByRole('navigation', { name: 'Pagination' })
	}

	get typeFilter(): Locator {
		return this.page.getByTestId('select-type')
	}

	get statusFilter(): Locator {
		return this.page.getByTestId('select-status')
	}

	get searchInput(): Locator {
		return this.page.getByPlaceholder('Search content...')
	}

	async gotoList(params: Record<string, string> = {}): Promise<void> {
		await this.goto(`/admin/content?${new URLSearchParams(params)}`)
		await expect(this.page.getByRole('heading', { name: 'Content Management' })).toBeVisible()
	}

	async nextPage(): Promise<void> {
		await this.pagination.getByRole('link', { name: 'Next page' }).click()
	}

	async previousPage(): Promise<void> {
		await this.pagination.getByRole('link', { name: 'Previous page' }).click()
	}

	async searchAndFilter(query: string, filter: 'type' | 'status', value: string): Promise<void> {
		const [input, select] = await Promise.all([
			this.searchInput.elementHandle(),
			(filter === 'type' ? this.typeFilter : this.statusFilter).elementHandle()
		])
		if (!input || !select) throw new Error('Content filters are not available')

		// Dispatch both user events in one browser task, before the search debounce can run.
		await this.page.evaluate(
			({ input, select, query, value }) => {
				const searchInput = input as HTMLInputElement
				const filterSelect = select as HTMLSelectElement
				searchInput.value = query
				searchInput.dispatchEvent(new Event('input', { bubbles: true }))
				filterSelect.value = value
				filterSelect.dispatchEvent(new Event('change', { bubbles: true }))
			},
			{ input, select, query, value }
		)
		await Promise.all([input.dispose(), select.dispose()])
	}

	async contentIds(): Promise<(string | null)[]> {
		return this.contentLinks.evaluateAll((links) => links.map((link) => link.getAttribute('href')))
	}
}
