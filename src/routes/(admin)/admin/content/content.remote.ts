import { form, query, getRequestEvent } from '$app/server'
import { error, redirect } from '@sveltejs/kit'
import { z } from 'zod/v4'
import { checkAdminAuth } from '../authorization.remote'
import { uploadImageFile } from '$lib/server/services/s3-storage'
import { generateSlug } from '$lib/utils/slug'

// Helper to transform comma-separated array values from form submission
// When using hidden inputs with array values, they may serialize as "a,b,c" instead of ["a","b","c"]
const commaSeparatedArray = z.preprocess((val) => {
	if (Array.isArray(val)) {
		return val.flatMap((s) => (typeof s === 'string' ? s.split(',').filter(Boolean) : s))
	}
	if (typeof val === 'string') {
		return val.split(',').filter(Boolean)
	}
	return val
}, z.array(z.string()))

// Admin create form schema - simplified for the types admins can create directly
const adminCreateContentSchema = z
	.object({
		title: z.string().min(1, 'Title is required'),
		slug: z.string().min(1, 'Slug is required'),
		description: z.string().min(1, 'Description is required'),
		status: z.enum(['draft', 'pending_review', 'published', 'archived']),
		type: z.enum(['recipe', 'announcement', 'collection', 'resource']),
		tags: commaSeparatedArray.pipe(z.array(z.string()).min(1, 'At least one tag is required')),
		body: z.string().optional(),
		children: commaSeparatedArray.optional(),
		metadata: z
			.object({
				link: z.string().url().optional(),
				image: z.string().url().optional()
			})
			.optional()
	})
	.superRefine((data, ctx) => {
		// Body is required for recipe, announcement, collection
		if (['recipe', 'announcement', 'collection'].includes(data.type) && !data.body) {
			ctx.addIssue({
				code: 'custom',
				path: ['body'],
				message: 'Body is required'
			})
		}
		// Children required for collection
		if (data.type === 'collection' && (!data.children || data.children.length === 0)) {
			ctx.addIssue({
				code: 'custom',
				path: ['children'],
				message: 'At least one child is required'
			})
		}
		// Link required for resource
		if (data.type === 'resource' && !data.metadata?.link) {
			ctx.addIssue({
				code: 'custom',
				path: ['metadata', 'link'],
				message: 'Resource link is required'
			})
		}
	})

export const getTags = query(() => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	const tags = locals.tagService.getAllTags()
	return tags.map((tag: { id: string; name: string }) => ({
		value: tag.id,
		label: tag.name
	}))
})

export const getAvailableChildren = query(() => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	const content = locals.contentService
		.getFilteredContent({ status: 'published' })
		.filter((item: { type: string }) => item.type !== 'collection')
	return content.map((item: { id: string; title: string; type: string }) => ({
		value: item.id,
		label: `${item.title} (${item.type})`
	}))
})

export const createContent = form(adminCreateContentSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	const contentData = {
		title: data.title,
		slug: data.slug,
		description: data.description,
		status: data.status,
		type: data.type,
		tags: data.tags,
		published_at: data.status === 'published' ? new Date().toISOString() : null,
		...(data.body && { body: data.body }),
		...(data.children && { children: data.children }),
		...(data.metadata && { metadata: data.metadata })
	} as any

	const contentId = await locals.contentService.addContent(contentData, locals.user?.id)
	redirect(303, `/admin/content/${contentId}`)
})

const contentIdSchema = z.object({
	id: z.string().min(1, 'Content ID is required')
})

export const getContentById = query(contentIdSchema, ({ id }) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	const content = locals.contentService.getContentById(id)
	if (!content) error(404, 'Content not found')
	return content
})

export const getUsers = query(() => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	const users = locals.userService.getUsers() as {
		id: string
		name: string
		username: string
		avatar_url?: string
	}[]
	return users.map((user) => ({
		value: user.id,
		label: `${user.name || user.username} (@${user.username})`,
		avatar: user.avatar_url,
		name: user.name,
		username: user.username
	}))
})

export const getAvailableChildrenForEdit = query(contentIdSchema, ({ id }) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	const content = locals.contentService
		.getFilteredContent({ status: 'all' })
		.filter((item: { type: string; id: string }) => item.type !== 'collection' && item.id !== id)
	return content.map((item: { id: string; title: string; type: string }) => ({
		value: item.id,
		label: `${item.title} (${item.type})`
	}))
})

const adminUpdateContentSchema = z.object({
	id: z.string().min(1, 'Content ID is required'),
	title: z.string().min(1, 'Title is required'),
	slug: z.string().min(1, 'Slug is required'),
	description: z.string().min(1, 'Description is required'),
	status: z.enum(['draft', 'pending_review', 'published', 'archived']),
	type: z.enum(['video', 'library', 'recipe', 'announcement', 'collection', 'resource', 'job']),
	tags: commaSeparatedArray.pipe(z.array(z.string()).min(1, 'At least one tag is required')),
	author_id: z.string().optional(),
	body: z.string().optional(),
	children: commaSeparatedArray.optional(),
	metadata: z.any().optional()
})

// Transform empty strings to undefined/null for optional fields
const optionalString = z.string().transform((val) => (val === '' ? null : val))
const optionalNumber = z.string().transform((val) => (val === '' ? null : Number(val))).pipe(
	z.number().positive().nullable()
)

// Accept File for image uploads (SvelteKit uses LazyFile internally)
const optionalFile = z
	.custom<File>((val) => {
		if (val === undefined || val === null) return true
		// Check for file-like properties (works with both File and LazyFile)
		return typeof val === 'object' && 'name' in val && 'type' in val && 'arrayBuffer' in val
	}, { message: 'Must be a valid image file' })
	.optional()

// Job-specific update schema
const adminUpdateJobSchema = z.object({
	id: z.string().min(1, 'Content ID is required'),
	// Content fields
	title: z.string().min(1, 'Title is required'),
	slug: z.string().min(1, 'Slug is required'),
	description: z.string().min(1, 'Description is required'),
	body: z.string().min(1, 'Job description is required'),
	status: z.enum(['draft', 'pending_review', 'published', 'archived']),
	// Company info
	company_name: z.string().min(1, 'Company name is required'),
	company_logo: optionalFile,
	company_website: optionalString,
	employer_email: z.email({ message: 'Valid email is required' }),
	// Job details
	position_type: z.enum(['full-time', 'part-time', 'contract', 'internship']),
	seniority_level: z.enum(['entry', 'junior', 'mid', 'senior', 'principal']),
	remote_status: z.enum(['on-site', 'hybrid', 'remote']),
	remote_restrictions: optionalString,
	location: optionalString,
	// Salary
	salary_min: optionalNumber,
	salary_max: optionalNumber,
	salary_currency: z.string().default('USD')
})

export const updateContent = form(adminUpdateContentSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	const contentData = {
		id: data.id,
		title: data.title,
		slug: data.slug,
		description: data.description,
		status: data.status,
		type: data.type,
		tags: data.tags,
		author_id: data.author_id,
		published_at: data.status === 'published' ? new Date().toISOString() : null,
		...(data.body !== undefined && { body: data.body }),
		...(data.children && { children: data.children }),
		...(data.metadata && { metadata: data.metadata })
	} as any

	await locals.contentService.updateContent(contentData)

	const content = locals.contentService.getContentById(data.id)
	if (content) {
		const tags = content.tags as unknown as { slug: string }[] | undefined
		const authors = content.authors as unknown as { name: string | null; username: string }[] | undefined
		locals.searchService.update(data.id, {
			id: content.id,
			title: content.title,
			description: content.description,
			tags: tags?.map((tag) => tag.slug),
			authors: authors?.map((author) => author.name || author.username) || [],
			type: content.type,
			status: content.status,
			created_at: content.created_at,
			published_at: content.published_at || '',
			likes: content.likes,
			saves: content.saves,
			stars: content.metadata?.stars || 0,
			// Job-specific fields (empty string for non-jobs)
			position_type: content.metadata?.position_type || '',
			seniority_level: content.metadata?.seniority_level || '',
			remote_status: content.metadata?.remote_status || ''
		})
	}

	return { success: true }
})

export const updateJob = form(adminUpdateJobSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	// Get existing content to preserve metadata fields we don't edit
	const existingContent = locals.contentService.getContentById(data.id)
	if (!existingContent) error(404, 'Job not found')
	if (existingContent.type !== 'job') error(400, 'Content is not a job')

	const existingMetadata = existingContent.metadata || {}

	// Upload new logo to S3 if provided, otherwise keep existing
	let companyLogoUrl: string | null = existingMetadata.company_logo || null
	if (data.company_logo) {
		const uploadedUrl = await uploadImageFile(data.company_logo, `jobs/${generateSlug(data.company_name)}`)
		if (uploadedUrl) {
			companyLogoUrl = uploadedUrl
		}
	}

	// Build updated metadata, preserving payment/tier info
	const updatedMetadata = {
		...existingMetadata,
		company_name: data.company_name,
		company_logo: companyLogoUrl,
		company_website: data.company_website,
		employer_email: data.employer_email,
		position_type: data.position_type,
		seniority_level: data.seniority_level,
		remote_status: data.remote_status,
		remote_restrictions: data.remote_restrictions,
		location: data.location,
		salary_min: data.salary_min,
		salary_max: data.salary_max,
		salary_currency: data.salary_currency
	}

	const contentData = {
		id: data.id,
		title: data.title,
		slug: data.slug,
		description: data.description,
		body: data.body,
		status: data.status,
		type: 'job' as const,
		tags: existingContent.tags?.map((t: { id: string }) => t.id) || [],
		published_at: data.status === 'published' ? new Date().toISOString() : null,
		metadata: updatedMetadata
	}

	await locals.contentService.updateContent(contentData)

	return { success: true }
})

const approveJobSchema = z.object({
	id: z.string().min(1, 'Job ID is required')
})

/**
 * Approve a job posting - publishes it and sends notification email to employer
 */
export const approveJob = form(approveJobSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	// Get the job
	const job = locals.contentService.getContentById(data.id)
	if (!job) error(404, 'Job not found')
	if (job.type !== 'job') error(400, 'Content is not a job')
	if (job.status === 'published') error(400, 'Job is already published')

	const metadata = job.metadata || {}

	// Update status to published
	await locals.contentService.updateContent({
		id: data.id,
		title: job.title,
		slug: job.slug,
		description: job.description,
		body: job.body,
		status: 'published',
		type: 'job',
		tags: job.tags?.map((t: { id: string }) => t.id) || [],
		published_at: new Date().toISOString(),
		metadata
	})

	// Send job-live email to employer
	if (metadata.employer_email) {
		const expiresAt = metadata.expires_at
			? new Date(metadata.expires_at).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				})
			: 'N/A'

		await locals.emailService.sendJobLiveEmail({
			employerEmail: metadata.employer_email,
			jobTitle: job.title,
			companyName: metadata.company_name || 'Your company',
			expiresAt,
			jobUrl: `https://sveltesociety.dev/job/${job.slug}`
		})
	}

	return { success: true }
})

const rejectJobSchema = z.object({
	id: z.string().min(1, 'Job ID is required'),
	rejectionReason: z.string().min(1, 'Rejection reason is required')
})

/**
 * Reject a job posting - archives it and sends notification email to employer
 */
export const rejectJob = form(rejectJobSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	// Get the job
	const job = locals.contentService.getContentById(data.id)
	if (!job) error(404, 'Job not found')
	if (job.type !== 'job') error(400, 'Content is not a job')
	if (job.status === 'archived') error(400, 'Job is already archived')

	const metadata = job.metadata || {}

	// Update status to archived
	await locals.contentService.updateContent({
		id: data.id,
		title: job.title,
		slug: job.slug,
		description: job.description,
		body: job.body,
		status: 'archived',
		type: 'job',
		tags: job.tags?.map((t: { id: string }) => t.id) || [],
		published_at: null,
		metadata
	})

	// Send rejection email to employer
	if (metadata.employer_email) {
		await locals.emailService.sendJobRejectedEmail({
			employerEmail: metadata.employer_email,
			jobTitle: job.title,
			rejectionReason: data.rejectionReason
		})
	}

	return { success: true }
})
