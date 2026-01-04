import type { Locator } from '@playwright/test'
import { expect } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * JobsPage - Page Object Model for the jobs listing page
 *
 * Represents the /jobs page that displays job listings
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
 * await jobsPage.filterByLocation('remote')
 * await jobsPage.expectJobsDisplayed()
 */
export class JobsPage extends BasePage {
	/**
	 * Navigate to the jobs listing page
	 */
	async goto(): Promise<void> {
		await this.page.goto('/jobs')
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
		if (filters.remote) params.set('remote', filters.remote)
		if (filters.position) params.set('position', filters.position)
		if (filters.level) params.set('level', filters.level)

		const queryString = params.toString()
		await this.page.goto(`/jobs${queryString ? `?${queryString}` : ''}`)
	}

	// Selectors

	/**
	 * Job listings container
	 */
	get jobListings(): Locator {
		return this.page.getByTestId('job-listings')
	}

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
	 * No jobs found message
	 */
	get noJobsMessage(): Locator {
		return this.page.getByTestId('no-jobs-message')
	}

	/**
	 * Post a Job button
	 */
	get postJobButton(): Locator {
		return this.page.getByTestId('post-job-button')
	}

	/**
	 * Location filter dropdown (remote/hybrid/on-site)
	 */
	get locationFilter(): Locator {
		return this.page.locator('select[name="remote"], a[href*="remote="]').first()
	}

	/**
	 * Position type filter dropdown (full-time/part-time/contract/internship)
	 */
	get positionFilter(): Locator {
		return this.page.locator('select[name="position"], a[href*="position="]').first()
	}

	/**
	 * Level filter dropdown (entry/junior/mid/senior/principal)
	 */
	get levelFilter(): Locator {
		return this.page.locator('select[name="level"], a[href*="level="]').first()
	}

	// Actions

	/**
	 * Filter jobs by location using LinkSelect
	 * @param value - Location value (remote, hybrid, on-site, all)
	 */
	async filterByLocation(value: 'all' | 'remote' | 'hybrid' | 'on-site'): Promise<void> {
		// LinkSelect uses anchor tags for navigation
		const link = this.page.locator(`a[href*="remote=${value}"]`).first()
		if (await link.isVisible()) {
			await link.click()
		} else {
			// Fallback to navigating directly
			const currentUrl = new URL(this.page.url())
			if (value === 'all') {
				currentUrl.searchParams.delete('remote')
			} else {
				currentUrl.searchParams.set('remote', value)
			}
			await this.page.goto(currentUrl.toString())
		}
	}

	/**
	 * Filter jobs by position type using LinkSelect
	 * @param value - Position type value (full-time, part-time, contract, internship, all)
	 */
	async filterByPosition(
		value: 'all' | 'full-time' | 'part-time' | 'contract' | 'internship'
	): Promise<void> {
		const link = this.page.locator(`a[href*="position=${value}"]`).first()
		if (await link.isVisible()) {
			await link.click()
		} else {
			const currentUrl = new URL(this.page.url())
			if (value === 'all') {
				currentUrl.searchParams.delete('position')
			} else {
				currentUrl.searchParams.set('position', value)
			}
			await this.page.goto(currentUrl.toString())
		}
	}

	/**
	 * Filter jobs by experience level using LinkSelect
	 * @param value - Level value (entry, junior, mid, senior, principal, all)
	 */
	async filterByLevel(
		value: 'all' | 'entry' | 'junior' | 'mid' | 'senior' | 'principal'
	): Promise<void> {
		const link = this.page.locator(`a[href*="level=${value}"]`).first()
		if (await link.isVisible()) {
			await link.click()
		} else {
			const currentUrl = new URL(this.page.url())
			if (value === 'all') {
				currentUrl.searchParams.delete('level')
			} else {
				currentUrl.searchParams.set('level', value)
			}
			await this.page.goto(currentUrl.toString())
		}
	}

	/**
	 * Click on a job card by index
	 * @param index - Zero-based index of the card to click
	 */
	async clickJobCard(index: number): Promise<void> {
		await this.jobCard(index).click()
	}

	/**
	 * Click the "Post a Job" button
	 */
	async clickPostJob(): Promise<void> {
		await this.postJobButton.click()
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
	 * Check if no jobs message is displayed
	 * @returns true if no jobs message is visible
	 */
	async hasNoJobsMessage(): Promise<boolean> {
		try {
			await this.noJobsMessage.waitFor({ state: 'visible', timeout: 2000 })
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
		await expect(this.noJobsMessage).toBeVisible()
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
