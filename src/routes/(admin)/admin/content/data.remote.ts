import { query } from '$app/server'
import { getRequestEvent } from '$app/server'
import { z } from 'zod/v4'

// Schema for filter parameters
const contentFiltersSchema = z.object({
	type: z.enum(['video', 'library', 'announcement', 'collection', 'recipe']).optional(),
	status: z.enum(['draft', 'published', 'archived', 'all']).default('all'),
	search: z.string().optional(),
	page: z.number().int().positive().default(1),
	perPage: z.number().int().positive().default(50)
})

export const getFilteredContent = query(contentFiltersSchema, async (filters) => {
	const { locals } = getRequestEvent()
	const { page, perPage, ...serviceFilters } = filters

	const offset = (page - 1) * perPage

	const content = locals.contentService.getFilteredContent({
		...serviceFilters,
		limit: perPage,
		offset
	})

	const count = locals.contentService.getFilteredContentCount(serviceFilters)

	return {
		content,
		pagination: {
			count,
			perPage,
			currentPage: page
		}
	}
})
