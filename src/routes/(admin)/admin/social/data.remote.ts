import { query, form, getRequestEvent } from '$app/server'
import { redirect } from '@sveltejs/kit'
import { z } from 'zod/v4'
import { checkAdminAuth } from '../authorization.remote'
import type { SocialPostStatus, SocialPostType, SocialPlatform } from '$lib/types/social'

// ============================================
// Schemas
// ============================================

const postFiltersSchema = z.object({
	status: z.enum(['draft', 'scheduled', 'published', 'failed', 'all']).default('all'),
	post_type: z.enum(['content', 'sponsor', 'job', 'custom', 'all']).default('all'),
	platform: z.enum(['twitter', 'bluesky', 'linkedin', 'all']).default('all'),
	search: z.string().optional(),
	page: z.number().int().positive().default(1),
	perPage: z.number().int().positive().default(20)
})

const postIdSchema = z.object({
	id: z.string().min(1, 'Post ID is required')
})

// Helper to parse HTML checkbox value ("on" or missing)
const checkboxBoolean = z
	.union([z.literal('on'), z.literal('true'), z.boolean()])
	.optional()
	.transform((val) => val === 'on' || val === 'true' || val === true)

const createPostSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	post_type: z.enum(['content', 'sponsor', 'job', 'custom']),
	content_id: z.string().optional(),
	sponsor_id: z.string().optional(),
	job_id: z.string().optional(),
	link_url: z.string().url().optional().or(z.literal('')),
	// Platform-specific text
	twitter_text: z.string().optional(),
	bluesky_text: z.string().optional(),
	linkedin_text: z.string().optional(),
	// Which platforms to enable (HTML checkboxes send "on" when checked)
	enable_twitter: checkboxBoolean,
	enable_bluesky: checkboxBoolean,
	enable_linkedin: checkboxBoolean
})

const updatePostSchema = z.object({
	id: z.string().min(1, 'Post ID is required'),
	title: z.string().min(1, 'Title is required'),
	link_url: z.string().url().optional().or(z.literal('')),
	utm_source: z.string().optional(),
	utm_medium: z.string().optional(),
	utm_campaign: z.string().optional(),
	// Platform-specific text
	twitter_text: z.string().optional(),
	bluesky_text: z.string().optional(),
	linkedin_text: z.string().optional()
})

const schedulePostSchema = z.object({
	id: z.string().min(1, 'Post ID is required'),
	scheduled_at: z.string().min(1, 'Schedule date is required')
})

// ============================================
// Helper Functions
// ============================================

function getFiltersFromUrl(url: URL) {
	const sp = url.searchParams
	return {
		search: sp.get('search') || undefined,
		status: (sp.get('status') || 'all') as 'draft' | 'scheduled' | 'published' | 'failed' | 'all',
		post_type: (sp.get('post_type') || 'all') as 'content' | 'sponsor' | 'job' | 'custom' | 'all',
		platform: (sp.get('platform') || 'all') as 'twitter' | 'bluesky' | 'linkedin' | 'all',
		page: parseInt(sp.get('page') || '1')
	}
}

// ============================================
// Queries
// ============================================

/**
 * Get filtered list of social posts
 */
export const getPosts = query(postFiltersSchema, async (filters) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	const { search, status, post_type, platform, page, perPage } = filters

	const result = locals.socialPostService.listPosts({
		search: search || undefined,
		status: status !== 'all' ? (status as SocialPostStatus) : undefined,
		post_type: post_type !== 'all' ? (post_type as SocialPostType) : undefined,
		platform: platform !== 'all' ? (platform as SocialPlatform) : undefined,
		limit: perPage,
		offset: (page - 1) * perPage
	})

	return {
		posts: result.posts,
		pagination: {
			count: result.total,
			perPage
		}
	}
})

/**
 * Get a single post by ID with all platform details
 */
export const getPost = query(postIdSchema, async ({ id }) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	const post = locals.socialPostService.getPostWithContent(id)
	return post
})

/**
 * Get upcoming scheduled posts
 */
export const getUpcomingPosts = query(
	z.object({ limit: z.number().optional() }),
	async ({ limit }) => {
		checkAdminAuth()
		const { locals } = getRequestEvent()

		return locals.socialPostService.getUpcomingPosts(limit ?? 5)
	}
)

/**
 * Get recent posts
 */
export const getRecentPosts = query(
	z.object({ limit: z.number().optional() }),
	async ({ limit }) => {
		checkAdminAuth()
		const { locals } = getRequestEvent()

		return locals.socialPostService.getRecentPosts(limit ?? 10)
	}
)

/**
 * Get posts for calendar view
 */
export const getCalendarPosts = query(
	z.object({
		startDate: z.string(),
		endDate: z.string()
	}),
	async ({ startDate, endDate }) => {
		checkAdminAuth()
		const { locals } = getRequestEvent()

		return locals.socialPostService.getPostsForCalendar(startDate, endDate)
	}
)

/**
 * Get all templates grouped by content type
 */
export const getTemplates = query('unchecked', async () => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	const result = locals.socialTemplateService.list({ limit: 100 })
	return result.templates
})

/**
 * Get content items for linking (videos, libraries, recipes, etc.)
 */
export const getContentItems = query(
	z.object({
		type: z.string().optional(),
		search: z.string().optional(),
		limit: z.number().optional()
	}),
	async ({ type, search, limit }) => {
		checkAdminAuth()
		const { locals } = getRequestEvent()

		const items = locals.contentService.getFilteredContent({
			type: type as 'video' | 'library' | 'recipe' | 'resource' | undefined,
			search: search || undefined,
			status: 'published',
			limit: limit ?? 50
		})

		return items.map((item) => ({
			id: item.id,
			title: item.title,
			type: item.type,
			slug: item.slug
		}))
	}
)

/**
 * Get active sponsors for linking
 */
export const getSponsors = query('unchecked', async () => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	const sponsors = locals.sponsorService.getActiveSponsors()
	return sponsors.map((s) => ({
		id: s.id,
		company_name: s.company_name,
		logo_url: s.logo_url
	}))
})

/**
 * Get published jobs for linking
 */
export const getJobs = query('unchecked', async () => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	const jobs = locals.contentService.getFilteredContent({
		type: 'job',
		status: 'published',
		limit: 50
	})

	return jobs.map((job) => {
		let company = ''
		if (job.metadata) {
			try {
				const meta = JSON.parse(job.metadata)
				company = meta.company_name || ''
			} catch {
				// ignore
			}
		}
		return {
			id: job.id,
			title: job.title,
			company
		}
	})
})

// ============================================
// Forms (Mutations)
// ============================================

/**
 * Create a new social post
 */
export const createPost = form(createPostSchema, async (data) => {
	checkAdminAuth()
	const { locals, url } = getRequestEvent()

	if (!locals.user) {
		return { success: false, text: 'User not authenticated' }
	}

	// Build platforms array based on enabled platforms
	const platforms: { platform: SocialPlatform; text: string; media_urls?: string[] }[] = []

	if (data.enable_twitter && data.twitter_text) {
		platforms.push({ platform: 'twitter', text: data.twitter_text })
	}
	if (data.enable_bluesky && data.bluesky_text) {
		platforms.push({ platform: 'bluesky', text: data.bluesky_text })
	}
	if (data.enable_linkedin && data.linkedin_text) {
		platforms.push({ platform: 'linkedin', text: data.linkedin_text })
	}

	if (platforms.length === 0) {
		return { success: false, text: 'At least one platform must be enabled with text' }
	}

	const post = locals.socialPostService.createPost({
		title: data.title,
		post_type: data.post_type,
		content_id: data.content_id || null,
		sponsor_id: data.sponsor_id || null,
		job_id: data.job_id || null,
		link_url: data.link_url || null,
		created_by: locals.user.id,
		platforms
	})

	if (!post) {
		return { success: false, text: 'Failed to create post' }
	}

	redirect(303, `/admin/social/${post.id}`)
})

/**
 * Update an existing social post
 */
export const updatePost = form(updatePostSchema, async (data) => {
	checkAdminAuth()
	const { locals, url } = getRequestEvent()

	try {
		// Update the main post
		const post = locals.socialPostService.updatePost(data.id, {
			title: data.title,
			link_url: data.link_url || null,
			utm_source: data.utm_source || null,
			utm_medium: data.utm_medium || null,
			utm_campaign: data.utm_campaign || null
		})

		if (!post) {
			return { success: false, text: 'Post not found' }
		}

		// Update platform-specific text
		const existingPost = locals.socialPostService.getPostWithPlatforms(data.id)
		if (existingPost) {
			for (const platform of existingPost.platforms) {
				let newText: string | undefined
				if (platform.platform === 'twitter') newText = data.twitter_text
				if (platform.platform === 'bluesky') newText = data.bluesky_text
				if (platform.platform === 'linkedin') newText = data.linkedin_text

				if (newText !== undefined) {
					locals.socialPostService.updatePlatform(platform.id, { text: newText })
				}
			}
		}

		await getPosts(getFiltersFromUrl(url)).refresh()
		await getPost({ id: data.id }).refresh()

		return { success: true, text: 'Post updated successfully!' }
	} catch (error) {
		console.error('Error updating social post:', error)
		return { success: false, text: 'An error occurred while updating the post' }
	}
})

/**
 * Schedule a post
 */
export const schedulePost = form(schedulePostSchema, async (data) => {
	checkAdminAuth()
	const { locals, url } = getRequestEvent()

	try {
		const post = locals.socialPostService.schedulePost(data.id, data.scheduled_at)

		if (!post) {
			return { success: false, text: 'Failed to schedule post. Make sure it is a draft.' }
		}

		await getPosts(getFiltersFromUrl(url)).refresh()
		await getPost({ id: data.id }).refresh()

		return { success: true, text: 'Post scheduled successfully!' }
	} catch (error) {
		console.error('Error scheduling post:', error)
		return { success: false, text: 'An error occurred while scheduling the post' }
	}
})

/**
 * Unschedule a post (back to draft)
 */
export const unschedulePost = form(postIdSchema, async (data) => {
	checkAdminAuth()
	const { locals, url } = getRequestEvent()

	try {
		const post = locals.socialPostService.unschedulePost(data.id)

		if (!post) {
			return { success: false, text: 'Failed to unschedule post' }
		}

		await getPosts(getFiltersFromUrl(url)).refresh()
		await getPost({ id: data.id }).refresh()

		return { success: true, text: 'Post unscheduled and returned to draft!' }
	} catch (error) {
		console.error('Error unscheduling post:', error)
		return { success: false, text: 'An error occurred while unscheduling the post' }
	}
})

/**
 * Delete a post
 */
export const deletePost = form(postIdSchema, async (data) => {
	checkAdminAuth()
	const { locals, url } = getRequestEvent()

	const success = locals.socialPostService.deletePost(data.id)

	if (!success) {
		return { success: false, text: 'Post not found' }
	}

	await getPosts(getFiltersFromUrl(url)).refresh()

	redirect(303, '/admin/social')
})

/**
 * Add a platform to an existing post
 */
export const addPlatform = form(
	z.object({
		post_id: z.string().min(1),
		platform: z.enum(['twitter', 'bluesky', 'linkedin']),
		text: z.string().min(1, 'Text is required')
	}),
	async (data) => {
		checkAdminAuth()
		const { locals, url } = getRequestEvent()

		try {
			const platform = locals.socialPostService.addPlatform(data.post_id, data.platform, data.text)

			if (!platform) {
				return { success: false, text: 'Failed to add platform' }
			}

			await getPost({ id: data.post_id }).refresh()

			return { success: true, text: `${data.platform} added successfully!` }
		} catch (error) {
			console.error('Error adding platform:', error)
			return { success: false, text: 'An error occurred while adding the platform' }
		}
	}
)

/**
 * Remove a platform from a post
 */
export const removePlatform = form(
	z.object({
		platform_id: z.string().min(1),
		post_id: z.string().min(1)
	}),
	async (data) => {
		checkAdminAuth()
		const { locals } = getRequestEvent()

		try {
			const success = locals.socialPostService.removePlatform(data.platform_id)

			if (!success) {
				return { success: false, text: 'Platform not found' }
			}

			await getPost({ id: data.post_id }).refresh()

			return { success: true, text: 'Platform removed successfully!' }
		} catch (error) {
			console.error('Error removing platform:', error)
			return { success: false, text: 'An error occurred while removing the platform' }
		}
	}
)

/**
 * Update platform text
 */
export const updatePlatformText = form(
	z.object({
		platform_id: z.string().min(1),
		post_id: z.string().min(1),
		text: z.string().min(1, 'Text is required')
	}),
	async (data) => {
		checkAdminAuth()
		const { locals } = getRequestEvent()

		try {
			const platform = locals.socialPostService.updatePlatform(data.platform_id, {
				text: data.text
			})

			if (!platform) {
				return { success: false, text: 'Platform not found' }
			}

			await getPost({ id: data.post_id }).refresh()

			return { success: true, text: 'Platform text updated!' }
		} catch (error) {
			console.error('Error updating platform text:', error)
			return { success: false, text: 'An error occurred while updating the platform text' }
		}
	}
)

/**
 * Duplicate a post
 */
export const duplicatePost = form(postIdSchema, async (data) => {
	checkAdminAuth()
	const { locals, url } = getRequestEvent()

	if (!locals.user) {
		return { success: false, text: 'User not authenticated' }
	}

	const original = locals.socialPostService.getPostWithPlatforms(data.id)

	if (!original) {
		return { success: false, text: 'Original post not found' }
	}

	const newPost = locals.socialPostService.createPost({
		title: `${original.title} (Copy)`,
		post_type: original.post_type,
		content_id: original.content_id,
		sponsor_id: original.sponsor_id,
		job_id: original.job_id,
		link_url: original.link_url,
		utm_source: original.utm_source,
		utm_medium: original.utm_medium,
		utm_campaign: original.utm_campaign,
		media_urls: original.media_urls,
		tags: original.tags,
		created_by: locals.user.id,
		platforms: original.platforms.map((p) => ({
			platform: p.platform,
			text: p.text,
			media_urls: p.media_urls
		}))
	})

	if (!newPost) {
		return { success: false, text: 'Failed to duplicate post' }
	}

	await getPosts(getFiltersFromUrl(url)).refresh()

	redirect(303, `/admin/social/${newPost.id}`)
})

// ============================================
// Queue Settings
// ============================================

/**
 * Get all queue settings
 */
export const getQueueSettings = query('unchecked', async () => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	return locals.socialQueueService.getAllSettings()
})

/**
 * Get queue settings for a specific platform
 */
export const getQueueSettingsForPlatform = query(
	z.object({ platform: z.enum(['twitter', 'bluesky', 'linkedin', 'global']) }),
	async ({ platform }) => {
		checkAdminAuth()
		const { locals } = getRequestEvent()

		return locals.socialQueueService.getSettings(platform)
	}
)

/**
 * Update queue settings for a specific platform
 */
export const updateQueueSettings = form(
	z.object({
		platform: z.enum(['twitter', 'bluesky', 'linkedin', 'global']),
		posting_times: z.string().optional(), // JSON array string
		posting_days: z.string().optional(), // JSON array string
		min_gap_minutes: z.coerce.number().int().positive().optional(),
		timezone: z.string().optional(),
		is_paused: checkboxBoolean
	}),
	async (data) => {
		checkAdminAuth()
		const { locals } = getRequestEvent()

		try {
			const settings = locals.socialQueueService.updateSettings(data.platform, {
				posting_times: data.posting_times ? JSON.parse(data.posting_times) : undefined,
				posting_days: data.posting_days ? JSON.parse(data.posting_days) : undefined,
				min_gap_minutes: data.min_gap_minutes,
				timezone: data.timezone,
				is_paused: data.is_paused
			})

			if (!settings) {
				return { success: false, text: 'Failed to update settings' }
			}

			await getQueueSettings().refresh()

			return { success: true, text: 'Queue settings updated successfully!' }
		} catch (error) {
			console.error('Error updating queue settings:', error)
			return { success: false, text: 'An error occurred while updating settings' }
		}
	}
)

/**
 * Pause or resume the queue for a platform
 */
export const toggleQueuePaused = form(
	z.object({
		platform: z.enum(['twitter', 'bluesky', 'linkedin', 'global']),
		is_paused: checkboxBoolean
	}),
	async (data) => {
		checkAdminAuth()
		const { locals } = getRequestEvent()

		try {
			const settings = locals.socialQueueService.setQueuePaused(data.platform, data.is_paused)

			if (!settings) {
				return { success: false, text: 'Failed to update queue status' }
			}

			await getQueueSettings().refresh()

			return { success: true, text: data.is_paused ? 'Queue paused' : 'Queue resumed' }
		} catch (error) {
			console.error('Error toggling queue:', error)
			return { success: false, text: 'An error occurred' }
		}
	}
)

// ============================================
// Auto-Posting Rules
// ============================================

const createRuleSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string().optional(),
	is_active: checkboxBoolean,
	trigger_type: z.enum(['content_published', 'sponsor_activated', 'job_published']),
	content_type_filter: z
		.string()
		.optional()
		.transform((v) => (v === '' ? null : v)),
	tag_filter: z
		.string()
		.optional()
		.transform((v) =>
			v
				? v
						.split(',')
						.map((t) => t.trim())
						.filter(Boolean)
				: []
		),
	platforms: z.string().transform((v) => JSON.parse(v) as SocialPlatform[]),
	template_id: z
		.string()
		.optional()
		.transform((v) => (v === '' ? null : v)),
	use_ai_generation: checkboxBoolean,
	delay_minutes: z.coerce.number().int().min(0).default(0),
	add_to_queue: checkboxBoolean,
	create_as_draft: checkboxBoolean
})

const updateRuleSchema = z.object({
	id: z.string().min(1, 'Rule ID is required'),
	name: z.string().min(1, 'Name is required'),
	description: z
		.string()
		.optional()
		.transform((v) => (v === '' ? null : v)),
	is_active: checkboxBoolean,
	content_type_filter: z
		.string()
		.optional()
		.transform((v) => (v === '' ? null : v)),
	tag_filter: z
		.string()
		.optional()
		.transform((v) =>
			v
				? v
						.split(',')
						.map((t) => t.trim())
						.filter(Boolean)
				: []
		),
	platforms: z.string().transform((v) => JSON.parse(v) as SocialPlatform[]),
	template_id: z
		.string()
		.optional()
		.transform((v) => (v === '' ? null : v)),
	use_ai_generation: checkboxBoolean,
	delay_minutes: z.coerce.number().int().min(0).default(0),
	add_to_queue: checkboxBoolean,
	create_as_draft: checkboxBoolean
})

const ruleIdSchema = z.object({
	id: z.string().min(1, 'Rule ID is required')
})

/**
 * Get all auto-posting rules
 */
export const getRules = query('unchecked', async () => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	return locals.socialAutoRuleService.list()
})

/**
 * Get a single rule by ID
 */
export const getRule = query(ruleIdSchema, async ({ id }) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	return locals.socialAutoRuleService.getById(id)
})

/**
 * Create a new auto-posting rule
 */
export const createRule = form(createRuleSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	const rule = locals.socialAutoRuleService.create({
		name: data.name,
		description: data.description || null,
		is_active: data.is_active,
		trigger_type: data.trigger_type,
		content_type_filter: data.content_type_filter,
		tag_filter: data.tag_filter,
		platforms: data.platforms,
		template_id: data.template_id,
		use_ai_generation: data.use_ai_generation,
		delay_minutes: data.delay_minutes,
		add_to_queue: data.add_to_queue,
		create_as_draft: data.create_as_draft
	})

	if (!rule) {
		return { success: false, text: 'Failed to create rule' }
	}

	redirect(303, `/admin/social/rules/${rule.id}`)
})

/**
 * Update an existing auto-posting rule
 */
export const updateRule = form(updateRuleSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	try {
		const rule = locals.socialAutoRuleService.update(data.id, {
			name: data.name,
			description: data.description,
			is_active: data.is_active,
			content_type_filter: data.content_type_filter,
			tag_filter: data.tag_filter,
			platforms: data.platforms,
			template_id: data.template_id,
			use_ai_generation: data.use_ai_generation,
			delay_minutes: data.delay_minutes,
			add_to_queue: data.add_to_queue,
			create_as_draft: data.create_as_draft
		})

		if (!rule) {
			return { success: false, text: 'Rule not found' }
		}

		await getRules().refresh()
		await getRule({ id: data.id }).refresh()

		return { success: true, text: 'Rule updated successfully!' }
	} catch (error) {
		console.error('Error updating rule:', error)
		return { success: false, text: 'An error occurred while updating the rule' }
	}
})

/**
 * Delete a rule
 */
export const deleteRule = form(ruleIdSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	const success = locals.socialAutoRuleService.delete(data.id)

	if (!success) {
		return { success: false, text: 'Rule not found' }
	}

	await getRules().refresh()

	redirect(303, '/admin/social/rules')
})

/**
 * Toggle a rule's active status
 */
export const toggleRuleActive = form(
	z.object({
		id: z.string().min(1, 'Rule ID is required'),
		is_active: checkboxBoolean
	}),
	async (data) => {
		checkAdminAuth()
		const { locals } = getRequestEvent()

		try {
			const rule = locals.socialAutoRuleService.toggleActive(data.id, data.is_active)

			if (!rule) {
				return { success: false, text: 'Rule not found' }
			}

			await getRules().refresh()

			return { success: true, text: data.is_active ? 'Rule activated' : 'Rule deactivated' }
		} catch (error) {
			console.error('Error toggling rule:', error)
			return { success: false, text: 'An error occurred' }
		}
	}
)

// ============================================
// Templates
// ============================================

const templateIdSchema = z.object({
	id: z.string().min(1, 'Template ID is required')
})

const createTemplateSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string().optional(),
	content_type: z.enum(['video', 'library', 'recipe', 'resource', 'job', 'sponsor', 'custom']),
	twitter_template: z.string().min(1, 'Twitter template is required'),
	bluesky_template: z.string().min(1, 'Bluesky template is required'),
	linkedin_template: z.string().min(1, 'LinkedIn template is required'),
	is_default: checkboxBoolean
})

const updateTemplateSchema = z.object({
	id: z.string().min(1, 'Template ID is required'),
	name: z.string().min(1, 'Name is required'),
	description: z
		.string()
		.optional()
		.transform((v) => (v === '' ? null : v)),
	twitter_template: z.string().min(1, 'Twitter template is required'),
	bluesky_template: z.string().min(1, 'Bluesky template is required'),
	linkedin_template: z.string().min(1, 'LinkedIn template is required'),
	is_default: checkboxBoolean
})

/**
 * Get a single template by ID
 */
export const getTemplate = query(templateIdSchema, async ({ id }) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	return locals.socialTemplateService.getById(id)
})

/**
 * Create a new template
 */
export const createTemplate = form(createTemplateSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	const template = locals.socialTemplateService.create({
		name: data.name,
		description: data.description || null,
		content_type: data.content_type,
		twitter_template: data.twitter_template,
		bluesky_template: data.bluesky_template,
		linkedin_template: data.linkedin_template,
		is_default: data.is_default
	})

	if (!template) {
		return { success: false, text: 'Failed to create template' }
	}

	redirect(303, `/admin/social/templates/${template.id}`)
})

/**
 * Update an existing template
 */
export const updateTemplate = form(updateTemplateSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	try {
		const template = locals.socialTemplateService.update(data.id, {
			name: data.name,
			description: data.description,
			twitter_template: data.twitter_template,
			bluesky_template: data.bluesky_template,
			linkedin_template: data.linkedin_template,
			is_default: data.is_default
		})

		if (!template) {
			return { success: false, text: 'Template not found' }
		}

		await getTemplates().refresh()
		await getTemplate({ id: data.id }).refresh()

		return { success: true, text: 'Template updated successfully!' }
	} catch (error) {
		console.error('Error updating template:', error)
		return { success: false, text: 'An error occurred while updating the template' }
	}
})

/**
 * Delete a template
 */
export const deleteTemplate = form(templateIdSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	const success = locals.socialTemplateService.delete(data.id)

	if (!success) {
		return { success: false, text: 'Template not found' }
	}

	await getTemplates().refresh()

	redirect(303, '/admin/social/templates')
})

// ============================================
// Analytics
// ============================================

/**
 * Get social media analytics/stats
 */
export const getAnalytics = query('unchecked', async () => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	const db = locals.db

	// Get post counts by status
	const statusCounts = db
		.prepare(
			`
		SELECT status, COUNT(*) as count
		FROM social_posts
		GROUP BY status
	`
		)
		.all() as { status: string; count: number }[]

	// Get post counts by platform
	const platformCounts = db
		.prepare(
			`
		SELECT platform, status, COUNT(*) as count
		FROM social_post_platforms
		GROUP BY platform, status
	`
		)
		.all() as { platform: string; status: string; count: number }[]

	// Get post counts by type
	const typeCounts = db
		.prepare(
			`
		SELECT post_type, COUNT(*) as count
		FROM social_posts
		GROUP BY post_type
	`
		)
		.all() as { post_type: string; count: number }[]

	// Get posts by day for last 30 days
	const postsOverTime = db
		.prepare(
			`
		SELECT
			date(created_at) as date,
			COUNT(*) as count
		FROM social_posts
		WHERE created_at >= date('now', '-30 days')
		GROUP BY date(created_at)
		ORDER BY date ASC
	`
		)
		.all() as { date: string; count: number }[]

	// Get published posts by day for last 30 days
	const publishedOverTime = db
		.prepare(
			`
		SELECT
			date(published_at) as date,
			COUNT(*) as count
		FROM social_posts
		WHERE published_at IS NOT NULL
			AND published_at >= date('now', '-30 days')
		GROUP BY date(published_at)
		ORDER BY date ASC
	`
		)
		.all() as { date: string; count: number }[]

	// Get recent posts with their platforms
	const recentPosts = db
		.prepare(
			`
		SELECT
			sp.id, sp.title, sp.status, sp.post_type, sp.created_at, sp.published_at,
			GROUP_CONCAT(spp.platform) as platforms,
			GROUP_CONCAT(spp.status) as platform_statuses
		FROM social_posts sp
		LEFT JOIN social_post_platforms spp ON sp.id = spp.post_id
		GROUP BY sp.id
		ORDER BY sp.created_at DESC
		LIMIT 10
	`
		)
		.all() as {
		id: string
		title: string
		status: string
		post_type: string
		created_at: string
		published_at: string | null
		platforms: string
		platform_statuses: string
	}[]

	// Get total counts
	const totalPosts = statusCounts.reduce((sum, s) => sum + s.count, 0)
	const publishedPosts = statusCounts.find((s) => s.status === 'published')?.count ?? 0
	const scheduledPosts = statusCounts.find((s) => s.status === 'scheduled')?.count ?? 0
	const draftPosts = statusCounts.find((s) => s.status === 'draft')?.count ?? 0
	const failedPosts = statusCounts.find((s) => s.status === 'failed')?.count ?? 0

	// Calculate platform totals
	const platformTotals: Record<string, { total: number; published: number; failed: number }> = {}
	for (const pc of platformCounts) {
		if (!platformTotals[pc.platform]) {
			platformTotals[pc.platform] = { total: 0, published: 0, failed: 0 }
		}
		platformTotals[pc.platform].total += pc.count
		if (pc.status === 'published') {
			platformTotals[pc.platform].published += pc.count
		}
		if (pc.status === 'failed') {
			platformTotals[pc.platform].failed += pc.count
		}
	}

	return {
		summary: {
			total: totalPosts,
			published: publishedPosts,
			scheduled: scheduledPosts,
			draft: draftPosts,
			failed: failedPosts
		},
		byStatus: statusCounts,
		byPlatform: Object.entries(platformTotals).map(([platform, stats]) => ({
			platform,
			...stats
		})),
		byType: typeCounts,
		postsOverTime,
		publishedOverTime,
		recentPosts: recentPosts.map((p) => ({
			...p,
			platforms: p.platforms?.split(',') ?? [],
			platform_statuses: p.platform_statuses?.split(',') ?? []
		}))
	}
})
