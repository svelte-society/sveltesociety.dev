import type { Locator } from '@playwright/test'
import { expect } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * JobsPage - Page Object Model for the jobs listing on homepage
 *
 * Represents the homepage filtered by type=job that displays job listings
 * with filters for location, position type, and experience level.
 *
 * Provides methods for:
 * - Viewing job listings
 * - Filtering jobs by location (remote, hybrid, on-site)
 * - Filtering jobs by position type (full-time, part-time, contract, internship)
 * - Filtering jobs by experience level (entry, junior, mid, senior, principal)
 *
 * @example
 * const jobsPage = new JobsPage(page)
 * await jobsPage.goto()
 * await jobsPage.gotoWithFilters({ remote: 'remote' })
 * await jobsPage.expectJobsDisplayed()
 */
export class JobsPage extends BasePage {
	/**
	 * Navigate to the jobs listing (homepage with type=job filter)
	 */
	async goto(): Promise<void> {
		await this.page.goto('/?type=job')
	}

	/**
	 * Navigate to jobs page with specific filters
	 * @param filters - Object containing filter values
	 */
	async gotoWithFilters(filters: {
		remote?: string
		position?: string
		level?: string
	}): Promise<void> {
		const params = new URLSearchParams()
		params.set('type', 'job')
		if (filters.remote) params.set('remote', filters.remote)
		if (filters.position) params.set('position', filters.position)
		if (filters.level) params.set('level', filters.level)

		await this.page.goto(`/?${params.toString()}`)
	}

	// Selectors

	/**
	 * All job cards on the page
	 */
	get jobCards(): Locator {
		return this.page.getByTestId('content-card')
	}

	/**
	 * Job card at a specific index
	 * @param index - Zero-based index of the job card
	 */
	jobCard(index: number): Locator {
		return this.jobCards.nth(index)
	}

	/**
	 * No content message
	 */
	get noContentMessage(): Locator {
		return this.page.getByTestId('no-content-message')
	}

	// Actions

	/**
	 * Click on a job card by index
	 * @param index - Zero-based index of the card to click
	 */
	async clickJobCard(index: number): Promise<void> {
		await this.jobCard(index).click()
	}

	// Getters

	/**
	 * Get the number of job cards displayed
	 * @returns Count of job cards
	 */
	async getJobCount(): Promise<number> {
		return await this.jobCards.count()
	}

	/**
	 * Get all job titles displayed on the page
	 * @returns Array of job titles
	 */
	async getJobTitles(): Promise<string[]> {
		// Wait for job cards to load
		const count = await this.jobCards.count()
		if (count === 0) return []

		await this.jobCards.first().waitFor({ state: 'visible', timeout: 10000 })

		const titleElements = this.page.getByTestId('content-title')
		const titles = await titleElements.allTextContents()

		return titles.map((title) => title.trim()).filter((title) => title.length > 0)
	}

	/**
	 * Check if no content message is displayed
	 * @returns true if no content message is visible
	 */
	async hasNoContentMessage(): Promise<boolean> {
		try {
			await this.noContentMessage.waitFor({ state: 'visible', timeout: 2000 })
			return true
		} catch {
			return false
		}
	}

	// Assertions

	/**
	 * Verify that jobs are displayed
	 */
	async expectJobsDisplayed(): Promise<void> {
		const count = await this.getJobCount()
		if (count === 0) {
			throw new Error('Expected jobs to be displayed, but found 0 job cards')
		}
	}

	/**
	 * Verify specific job exists by title
	 * @param title - Title to search for (partial match)
	 */
	async expectJobWithTitle(title: string): Promise<void> {
		const titles = await this.getJobTitles()
		if (!titles.some((t) => t.includes(title))) {
			throw new Error(
				`Expected to find job with title containing "${title}", but found: ${titles.join(', ')}`
			)
		}
	}

	/**
	 * Verify job count matches expected
	 * @param expected - Expected number of jobs
	 */
	async expectJobCount(expected: number): Promise<void> {
		const count = await this.getJobCount()
		expect(count).toBe(expected)
	}

	/**
	 * Verify no jobs are found (empty state)
	 */
	async expectNoJobs(): Promise<void> {
		await expect(this.noContentMessage).toBeVisible()
	}

	/**
	 * Verify URL contains expected filter params
	 * @param params - Expected URL params
	 */
	async expectUrlParams(params: {
		remote?: string
		position?: string
		level?: string
	}): Promise<void> {
		const url = new URL(this.page.url())
		expect(url.searchParams.get('type')).toBe('job')
		if (params.remote) {
			expect(url.searchParams.get('remote')).toBe(params.remote)
		}
		if (params.position) {
			expect(url.searchParams.get('position')).toBe(params.position)
		}
		if (params.level) {
			expect(url.searchParams.get('level')).toBe(params.level)
		}
	}
}
