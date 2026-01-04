import { getRequestEvent, query, form } from '$app/server'
import { fail, redirect } from '@sveltejs/kit'
import { z } from 'zod/v4'
import { parseSearchParams } from 'zod-search-params/v4'

// Input schema for job listing filters
const jobsFilterSchema = z.object({
	page: z.coerce.number().default(1),
	remote: z.enum(['all', 'remote', 'hybrid', 'on-site']).default('all'),
	position: z.enum(['all', 'full-time', 'part-time', 'contract', 'internship']).default('all'),
	level: z.enum(['all', 'entry', 'junior', 'mid', 'senior', 'principal']).default('all')
})

const jobListingInputSchema = z.object({
	url: z.instanceof(URL)
})

/**
 * Get all published job listings with optional filters
 */
export const getJobListings = query(jobListingInputSchema, async ({ url }) => {
	const { locals } = getRequestEvent()

	const parsedFilters = parseSearchParams(jobsFilterSchema, url.searchParams)
	const filters = {
		page: parsedFilters?.page ?? 1,
		remote: parsedFilters?.remote ?? 'all',
		position: parsedFilters?.position ?? 'all',
		level: parsedFilters?.level ?? 'all'
	} as const
	const perPage = 20
	const offset = (filters.page - 1) * perPage

	// Search for job content
	const searchResults = locals.searchService.search({
		type: 'job',
		status: 'published',
		limit: perPage,
		offset
	})

	// Get full job data with metadata
	let jobs = searchResults.hits
		.map((hit) => locals.contentService.getContentById(hit.id))
		.filter((job) => job !== null)

	// Apply additional filters on metadata
	if (filters.remote !== 'all') {
		jobs = jobs.filter((job) => job.metadata?.remote_status === filters.remote)
	}

	if (filters.position !== 'all') {
		jobs = jobs.filter((job) => job.metadata?.position_type === filters.position)
	}

	if (filters.level !== 'all') {
		jobs = jobs.filter((job) => job.metadata?.seniority_level === filters.level)
	}

	// Filter out expired jobs
	const now = new Date().toISOString()
	jobs = jobs.filter((job) => {
		const expiresAt = job.metadata?.expires_at
		return !expiresAt || expiresAt > now
	})

	return {
		jobs,
		count: jobs.length,
		totalCount: searchResults.count,
		filters,
		meta: {
			title: 'Svelte Jobs - Find Your Next Svelte Position',
			description: 'Browse job opportunities in the Svelte ecosystem. Find full-time, part-time, contract, and remote positions.',
			url: '/jobs'
		}
	}
})

/**
 * Get a single job by slug
 */
export const getJobBySlug = query(z.object({ slug: z.string() }), async ({ slug }) => {
	const { locals } = getRequestEvent()

	const job = locals.contentService.getContentBySlug(slug)

	if (!job || job.type !== 'job') {
		return null
	}

	// Check if job is expired
	const now = new Date().toISOString()
	const isExpired = job.metadata?.expires_at && job.metadata.expires_at < now

	// Get application count
	const applicationCount = locals.jobApplicationService.getApplicationCount(job.id)

	return {
		job,
		isExpired,
		applicationCount
	}
})

/**
 * Get job tiers for the pricing page
 */
export const getJobTiers = query(async () => {
	const { locals } = getRequestEvent()
	return locals.jobTierService.getActiveTiers()
})

/**
 * Check if user has already applied to a job
 */
export const checkApplicationStatus = query(z.object({ jobId: z.string() }), async ({ jobId }) => {
	const { locals } = getRequestEvent()

	if (!locals.user) {
		return { hasApplied: false, isLoggedIn: false }
	}

	const hasApplied = locals.jobApplicationService.hasApplied(jobId, locals.user.id)

	return { hasApplied, isLoggedIn: true }
})

// Schema for job application
const applyToJobSchema = z.object({
	jobId: z.string(),
	message: z.string().optional()
})

/**
 * Apply to a job
 */
export const applyToJob = form(applyToJobSchema, async (data) => {
	const { locals } = getRequestEvent()

	if (!locals.user) {
		return fail(401, {
			error: 'Authentication required',
			message: 'You must be logged in to apply for jobs.'
		})
	}

	if (!locals.user.email) {
		return fail(400, {
			error: 'Email required',
			message: 'Your account must have an email address to apply for jobs.'
		})
	}

	// Get the job
	const job = locals.contentService.getContentById(data.jobId)
	if (!job || job.type !== 'job') {
		return fail(404, {
			error: 'Job not found',
			message: 'The job you are trying to apply for does not exist.'
		})
	}

	// Check if job is expired
	const now = new Date().toISOString()
	if (job.metadata?.expires_at && job.metadata.expires_at < now) {
		return fail(400, {
			error: 'Job expired',
			message: 'This job posting has expired and is no longer accepting applications.'
		})
	}

	// Check if user has already applied
	if (locals.jobApplicationService.hasApplied(data.jobId, locals.user.id)) {
		return fail(400, {
			error: 'Already applied',
			message: 'You have already applied for this position.'
		})
	}

	try {
		// Create the application
		locals.jobApplicationService.createApplication({
			job_id: data.jobId,
			applicant_id: locals.user.id,
			applicant_email: locals.user.email,
			message: data.message
		})

		// Send notification email to employer
		const employerEmail = job.metadata?.employer_email
		if (employerEmail) {
			await locals.plunkService.sendJobApplicationNotification({
				employerEmail,
				jobTitle: job.title,
				applicantName: locals.user.name || locals.user.username,
				applicantEmail: locals.user.email,
				applicantProfileUrl: `https://sveltesociety.dev/user/${locals.user.username}`,
				applicationMessage: data.message
			})
		}

		return { success: true, message: 'Application submitted successfully!' }
	} catch (error) {
		console.error('Error creating job application:', error)
		return fail(500, {
			error: 'Application failed',
			message: 'Failed to submit your application. Please try again.'
		})
	}
})
