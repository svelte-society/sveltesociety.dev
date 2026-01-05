import { error } from '@sveltejs/kit'
import { buildContentMeta, generateBreadcrumbSchema, SEO_CONFIG } from '$lib/seo'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals, params, url }) => {
	const job = locals.contentService.getContentBySlug(params.slug)

	if (!job || job.type !== 'job') {
		throw error(404, { message: 'Job not found' })
	}

	// Check if job is expired
	const now = new Date().toISOString()
	const isExpired = job.metadata?.expires_at && job.metadata.expires_at < now

	// Get application count
	const applicationCount = locals.jobApplicationService.getApplicationCount(job.id)

	// Check if current user has applied
	let hasApplied = false
	if (locals.user) {
		hasApplied = locals.jobApplicationService.hasApplied(job.id, locals.user.id)
	}

	// Build SEO meta
	const meta = buildContentMeta(job, url.toString())

	// Build breadcrumb schema
	const schemas = [
		generateBreadcrumbSchema([
			{ name: 'Home', url: SEO_CONFIG.siteUrl },
			{ name: 'Jobs', url: `${SEO_CONFIG.siteUrl}/jobs` },
			{ name: job.title, url: url.toString() }
		])
	]

	return {
		job,
		isExpired,
		applicationCount,
		hasApplied,
		meta,
		schemas
	}
}
