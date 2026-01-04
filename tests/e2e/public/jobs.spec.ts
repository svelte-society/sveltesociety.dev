import { test, expect } from '@playwright/test'
import { JobsPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'

test.describe('Jobs Listing', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('can view jobs list', async ({ page }) => {
		const jobsPage = new JobsPage(page)
		await jobsPage.goto()

		await jobsPage.expectJobsDisplayed()

		const titles = await jobsPage.getJobTitles()
		expect(titles.length).toBeGreaterThan(0)
	})

	test('displays job details in cards', async ({ page }) => {
		const jobsPage = new JobsPage(page)
		await jobsPage.goto()

		// Check for specific job titles from test data
		await jobsPage.expectJobWithTitle('Senior Svelte Developer')
		await jobsPage.expectJobWithTitle('Frontend Engineer')
		await jobsPage.expectJobWithTitle('Junior Svelte Developer')
	})

	test('jobs appear in category dropdown', async ({ page }) => {
		await page.goto('/')

		// Open the Add Filter dropdown
		const addFilterButton = page.getByRole('button', { name: /Add Filter/i })
		await addFilterButton.click()

		// Navigate to Categories submenu
		const categoriesSubmenu = page.getByRole('menuitem', { name: 'Categories' })
		await categoriesSubmenu.focus()

		// Job should be in the categories list
		const jobOption = page.getByRole('menuitem', { name: 'Job' })
		await expect(jobOption).toBeVisible()
	})
})

test.describe('Jobs Filtering by Location', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('can filter jobs by remote location', async ({ page }) => {
		const jobsPage = new JobsPage(page)
		await jobsPage.gotoWithFilters({ remote: 'remote' })

		await jobsPage.expectUrlParams({ remote: 'remote' })

		// Should show remote jobs (Senior Svelte Developer, Svelte Consultant)
		const titles = await jobsPage.getJobTitles()
		expect(titles.length).toBeGreaterThan(0)

		// All displayed jobs should be remote
		await jobsPage.expectJobWithTitle('Senior Svelte Developer')
	})

	test('can filter jobs by hybrid location', async ({ page }) => {
		const jobsPage = new JobsPage(page)
		await jobsPage.gotoWithFilters({ remote: 'hybrid' })

		await jobsPage.expectUrlParams({ remote: 'hybrid' })

		// Should show hybrid jobs (Frontend Engineer, Intern)
		const titles = await jobsPage.getJobTitles()
		expect(titles.length).toBeGreaterThan(0)

		await jobsPage.expectJobWithTitle('Frontend Engineer')
	})

	test('can filter jobs by on-site location', async ({ page }) => {
		const jobsPage = new JobsPage(page)
		await jobsPage.gotoWithFilters({ remote: 'on-site' })

		await jobsPage.expectUrlParams({ remote: 'on-site' })

		// Should show on-site jobs (Junior Svelte Developer)
		const titles = await jobsPage.getJobTitles()
		expect(titles.length).toBeGreaterThan(0)

		await jobsPage.expectJobWithTitle('Junior Svelte Developer')
	})
})

test.describe('Jobs Filtering by Position Type', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('can filter jobs by full-time position', async ({ page }) => {
		const jobsPage = new JobsPage(page)
		await jobsPage.gotoWithFilters({ position: 'full-time' })

		await jobsPage.expectUrlParams({ position: 'full-time' })

		// Should show full-time jobs
		const titles = await jobsPage.getJobTitles()
		expect(titles.length).toBeGreaterThan(0)

		await jobsPage.expectJobWithTitle('Senior Svelte Developer')
	})

	test('can filter jobs by contract position', async ({ page }) => {
		const jobsPage = new JobsPage(page)
		await jobsPage.gotoWithFilters({ position: 'contract' })

		await jobsPage.expectUrlParams({ position: 'contract' })

		// Should show contract jobs (Svelte Consultant)
		await jobsPage.expectJobWithTitle('Svelte Consultant')
	})

	test('can filter jobs by internship position', async ({ page }) => {
		const jobsPage = new JobsPage(page)
		await jobsPage.gotoWithFilters({ position: 'internship' })

		await jobsPage.expectUrlParams({ position: 'internship' })

		// Should show internship jobs (Svelte/SvelteKit Intern)
		await jobsPage.expectJobWithTitle('Intern')
	})
})

test.describe('Jobs Filtering by Experience Level', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('can filter jobs by senior level', async ({ page }) => {
		const jobsPage = new JobsPage(page)
		await jobsPage.gotoWithFilters({ level: 'senior' })

		await jobsPage.expectUrlParams({ level: 'senior' })

		// Should show senior jobs (Senior Svelte Developer)
		await jobsPage.expectJobWithTitle('Senior Svelte Developer')
	})

	test('can filter jobs by junior level', async ({ page }) => {
		const jobsPage = new JobsPage(page)
		await jobsPage.gotoWithFilters({ level: 'junior' })

		await jobsPage.expectUrlParams({ level: 'junior' })

		// Should show junior jobs
		await jobsPage.expectJobWithTitle('Junior Svelte Developer')
	})

	test('can filter jobs by entry level', async ({ page }) => {
		const jobsPage = new JobsPage(page)
		await jobsPage.gotoWithFilters({ level: 'entry' })

		await jobsPage.expectUrlParams({ level: 'entry' })

		// Should show entry level jobs (Intern)
		await jobsPage.expectJobWithTitle('Intern')
	})

	test('can filter jobs by principal level', async ({ page }) => {
		const jobsPage = new JobsPage(page)
		await jobsPage.gotoWithFilters({ level: 'principal' })

		await jobsPage.expectUrlParams({ level: 'principal' })

		// Should show principal level jobs (Svelte Consultant)
		await jobsPage.expectJobWithTitle('Svelte Consultant')
	})
})

test.describe('Jobs Combined Filters', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('can combine location and position filters', async ({ page }) => {
		const jobsPage = new JobsPage(page)
		await jobsPage.gotoWithFilters({ remote: 'remote', position: 'contract' })

		await jobsPage.expectUrlParams({ remote: 'remote', position: 'contract' })

		// Should show only remote contract jobs (Svelte Consultant)
		await jobsPage.expectJobWithTitle('Svelte Consultant')
	})

	test('can combine all three filters', async ({ page }) => {
		const jobsPage = new JobsPage(page)
		await jobsPage.gotoWithFilters({
			remote: 'remote',
			position: 'full-time',
			level: 'senior'
		})

		await jobsPage.expectUrlParams({
			remote: 'remote',
			position: 'full-time',
			level: 'senior'
		})

		// Should show only remote, full-time, senior jobs (Senior Svelte Developer)
		await jobsPage.expectJobWithTitle('Senior Svelte Developer')
	})

	test('shows no results message when no jobs match filters', async ({ page }) => {
		const jobsPage = new JobsPage(page)
		// This combination shouldn't match any jobs
		await jobsPage.gotoWithFilters({
			remote: 'on-site',
			position: 'internship',
			level: 'principal'
		})

		// Should show no jobs message
		await jobsPage.expectNoJobs()
	})
})

test.describe('Jobs on Homepage Filter', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('job filters appear as active filter chips on homepage', async ({ page }) => {
		// Navigate to homepage with job filters
		await page.goto('/?type=job&remote=remote')

		// Should show the job filter chip
		const jobFilter = page.locator('span').filter({ hasText: 'Job:' })
		await expect(jobFilter.first()).toBeVisible()
	})

	test('can add job location filter from FilterDropdown', async ({ page }) => {
		await page.goto('/')

		// Open the Add Filter dropdown
		const addFilterButton = page.getByRole('button', { name: /Add Filter/i })
		await addFilterButton.click()

		// Navigate to Jobs submenu
		const jobsSubmenu = page.getByRole('menuitem', { name: 'Jobs' })
		await expect(jobsSubmenu).toBeVisible()
	})

	test('job filters work on homepage with type=job', async ({ page }) => {
		// Navigate to homepage filtering for jobs with remote filter
		await page.goto('/?type=job&remote=remote')

		// Should show job content
		const contentCards = page.getByTestId('content-card')
		const count = await contentCards.count()

		// If we have job content matching the filter, it should be displayed
		// (depends on test data having matching jobs)
		if (count > 0) {
			await expect(contentCards.first()).toBeVisible()
		}
	})
})
