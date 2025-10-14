import { query } from '$app/server'
import { getRequestEvent } from '$app/server'
import { z } from 'zod/v4'
import { platformSchema, postStatusSchema } from '$lib/schema/social'
import { generatePostsForContent } from '$lib/server/services/post-generator'

const getPostsFiltersSchema = z.object({
	status: postStatusSchema.optional(),
	platform: platformSchema.optional(),
	limit: z.number().optional()
})

export const getPosts = query(getPostsFiltersSchema, async (filters) => {
	const { locals } = getRequestEvent()
	return locals.socialService.getPosts(filters)
})

export const getAccounts = query(async () => {
	const { locals } = getRequestEvent()
	return locals.socialService.getAccounts()
})

export const generatePosts = query(z.string(), async (contentId) => {
	const { locals } = getRequestEvent()

	// Get content to determine type
	const content = locals.contentService.getContentById(contentId)
	if (!content) {
		throw new Error('Content not found')
	}

	// Generate posts for all platforms
	const generatedPosts = await generatePostsForContent(
		contentId,
		content.type,
		locals.socialService,
		locals.contentService
	)

	return generatedPosts
})
