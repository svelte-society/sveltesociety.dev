import { query } from '$app/server'
import { getRequestEvent } from '$app/server'
import { z } from 'zod/v4'
import { platformSchema, postStatusSchema } from '$lib/schema/social'

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
