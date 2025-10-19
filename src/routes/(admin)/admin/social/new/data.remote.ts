import { query, form } from '$app/server'
import { redirect } from '@sveltejs/kit'
import { getRequestEvent } from '$app/server'
import { z } from 'zod/v4'
import { createSocialPostSchema } from '$lib/schema/social'
import { generatePostsForContent } from '$lib/server/services/post-generator'

// Get published content for dropdown
export const getPublishedContent = query(async () => {
	const { locals } = getRequestEvent()
	return locals.contentService.getFilteredContent({ status: 'published', limit: 100 })
})

// Get active accounts
export const getActiveAccounts = query(async () => {
	const { locals } = getRequestEvent()
	return locals.socialService.getAccounts().filter((account: any) => account.is_active)
})

// Generate post preview for selected content
export const generatePostPreview = query(
	z.object({
		contentId: z.string(),
		platform: z.string()
	}),
	async ({ contentId, platform }) => {
		const { locals } = getRequestEvent()

		const content = locals.contentService.getContentById(contentId)
		if (!content) {
			throw new Error('Content not found')
		}

		const generatedPosts = await generatePostsForContent(
			contentId,
			content.type,
			locals.socialService,
			locals.contentService
		)

		const postForPlatform = generatedPosts.find((p) => p.platform === platform)
		return postForPlatform || null
	}
)

// Create a new social post
export const createPost = form(createSocialPostSchema, async (data, invalid) => {
	const { locals } = getRequestEvent()
	const user = locals.user

	try {
		const post = locals.socialService.createPost({
			content_id: data.content_id,
			account_id: data.account_id,
			platform: data.platform,
			post_text: data.post_text,
			post_data: data.post_data,
			scheduled_at: data.scheduled_at,
			created_by: user?.id
		})

		redirect(303, '/admin/social')
	} catch (error: any) {
		invalid(invalid.post_text('Failed to create post: ' + error.message))
	}
})
