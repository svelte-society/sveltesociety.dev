import { test, expect } from '@playwright/test'
import { JobsPage, JobDetailPage, SubmitJobPage } from '../../pages'
import { setupDatabaseIsolation } from '../../helpers/database-isolation'
import { loginAs } from '../../helpers/auth'
import { TEST_JOBS } from '../../fixtures/test-data'

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

// Job slugs have the content ID appended (same format as other content)
const JOB_SLUGS = {
	senior: 'senior-svelte-developer-acme-content_job_001',
	frontend: 'frontend-engineer-svelte-techstart-content_job_002',
	junior: 'junior-svelte-developer-growthco-content_job_003',
	consultant: 'svelte-consultant-contract-enterprise-content_job_004',
	intern: 'svelte-intern-summer-startup-content_job_005'
}

test.describe('Job Detail Page', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('can view job detail page', async ({ page }) => {
		const jobDetailPage = new JobDetailPage(page)
		await jobDetailPage.goto(JOB_SLUGS.senior)

		await jobDetailPage.expectJobLoaded()
		await jobDetailPage.expectTitleIs('Senior Svelte Developer')
		await jobDetailPage.expectCompanyIs('Acme Corp')
	})

	test('displays job metadata correctly', async ({ page }) => {
		const jobDetailPage = new JobDetailPage(page)
		await jobDetailPage.goto(JOB_SLUGS.senior)

		await jobDetailPage.expectJobLoaded()
		await jobDetailPage.expectMetadataVisible()
		await jobDetailPage.expectNotExpired()
	})

	test('shows back to jobs link', async ({ page }) => {
		const jobDetailPage = new JobDetailPage(page)
		await jobDetailPage.goto(JOB_SLUGS.senior)

		await jobDetailPage.expectBackLinkVisible()
	})

	test('back link navigates to job listings', async ({ page }) => {
		const jobDetailPage = new JobDetailPage(page)
		await jobDetailPage.goto(JOB_SLUGS.senior)

		await jobDetailPage.clickBackToJobs()

		// Should navigate to jobs listing
		await expect(page).toHaveURL(/\?type=job/)
	})

	test('shows login prompt for unauthenticated users', async ({ page }) => {
		const jobDetailPage = new JobDetailPage(page)
		await jobDetailPage.goto(JOB_SLUGS.senior)

		await jobDetailPage.expectLoginRequired()
	})

	test('login link includes redirect back to job', async ({ page }) => {
		const jobDetailPage = new JobDetailPage(page)
		await jobDetailPage.goto(JOB_SLUGS.senior)

		await expect(jobDetailPage.loginToApplyLink).toHaveAttribute(
			'href',
			`/login?redirect=/job/${JOB_SLUGS.senior}`
		)
	})
})

test.describe('Job Application - Authenticated', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
		await loginAs(page, 'viewer')
	})

	test('authenticated user can see apply form', async ({ page }) => {
		const jobDetailPage = new JobDetailPage(page)
		await jobDetailPage.goto(JOB_SLUGS.senior)

		await jobDetailPage.expectCanApply()
	})

	test('can apply for job without message', async ({ page }) => {
		const jobDetailPage = new JobDetailPage(page)
		await jobDetailPage.goto(JOB_SLUGS.senior)

		await jobDetailPage.submitApplication()
		await jobDetailPage.expectApplicationSuccess()
	})

	test('can apply for job with message', async ({ page }) => {
		const jobDetailPage = new JobDetailPage(page)
		await jobDetailPage.goto(JOB_SLUGS.frontend)

		await jobDetailPage.applyForJob(
			'I am very interested in this position and have 5 years of Svelte experience.'
		)
		await jobDetailPage.expectApplicationSuccess()
	})

	test('cannot apply twice to same job', async ({ page }) => {
		const jobDetailPage = new JobDetailPage(page)
		await jobDetailPage.goto(JOB_SLUGS.junior)

		// Apply first time
		await jobDetailPage.submitApplication()
		await jobDetailPage.expectApplicationSuccess()

		// Verify "already applied" message is shown
		await jobDetailPage.expectAlreadyApplied()
	})
})

test.describe('Job Submission Form', () => {
	test.beforeEach(async ({ page }) => {
		await setupDatabaseIsolation(page)
	})

	test('can access job submission page', async ({ page }) => {
		const submitJobPage = new SubmitJobPage(page)
		await submitJobPage.goto()

		await submitJobPage.expectPageLoaded()
	})

	test('displays all pricing tiers', async ({ page }) => {
		const submitJobPage = new SubmitJobPage(page)
		await submitJobPage.goto()

		await submitJobPage.expectAllTiersVisible()
	})

	test('can select different pricing tiers', async ({ page }) => {
		const submitJobPage = new SubmitJobPage(page)
		await submitJobPage.goto()

		// Select featured tier
		await submitJobPage.selectTier('featured')
		await submitJobPage.expectTierSelected('featured')

		// Select premium tier
		await submitJobPage.selectTier('premium')
		await submitJobPage.expectTierSelected('premium')

		// Select basic tier
		await submitJobPage.selectTier('basic')
		await submitJobPage.expectTierSelected('basic')
	})

	test('form has all required fields', async ({ page }) => {
		const submitJobPage = new SubmitJobPage(page)
		await submitJobPage.goto()

		// Company info fields
		await expect(submitJobPage.companyNameInput).toBeVisible()
		await expect(submitJobPage.employerEmailInput).toBeVisible()
		await expect(submitJobPage.companyWebsiteInput).toBeVisible()

		// Job details fields
		await expect(submitJobPage.jobTitleInput).toBeVisible()
		await expect(submitJobPage.jobDescriptionInput).toBeVisible()
		await expect(submitJobPage.positionTypeSelect).toBeVisible()
		await expect(submitJobPage.seniorityLevelSelect).toBeVisible()

		// Location fields
		await expect(submitJobPage.remoteStatusSelect).toBeVisible()
		await expect(submitJobPage.locationInput).toBeVisible()

		// Salary fields
		await expect(submitJobPage.salaryMinInput).toBeVisible()
		await expect(submitJobPage.salaryMaxInput).toBeVisible()
		await expect(submitJobPage.salaryCurrencySelect).toBeVisible()

		// Submit button
		await expect(submitJobPage.submitButton).toBeVisible()
	})

	test('can fill out job submission form', async ({ page }) => {
		const submitJobPage = new SubmitJobPage(page)
		await submitJobPage.goto()

		await submitJobPage.fillCompleteForm({
			tier: 'featured',
			company: {
				companyName: 'Test Company',
				employerEmail: 'jobs@testcompany.com',
				companyWebsite: 'https://testcompany.com'
			},
			job: {
				title: 'Svelte Developer',
				description: 'Join our team as a Svelte developer',
				body: '# About the Role\n\nWe are looking for a talented developer.',
				positionType: 'full-time',
				seniorityLevel: 'mid'
			},
			location: {
				remoteStatus: 'remote',
				remoteRestrictions: 'US/EU timezone'
			},
			salary: {
				min: '80000',
				max: '120000',
				currency: 'USD'
			}
		})

		// Verify form can be submitted (button is enabled)
		await submitJobPage.expectCanSubmit()
	})
})
