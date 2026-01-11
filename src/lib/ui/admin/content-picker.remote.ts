import { getRequestEvent, query } from '$app/server'
import { z } from 'zod/v4'

const searchSchema = z.object({
	search: z.string().transform((s) => s.trim()),
	limit: z.number().int().min(1).max(50).default(20)
})

export const searchContent = query(searchSchema, ({ search, limit }) => {
	const { locals } = getRequestEvent()

	const content = locals.contentService.getFilteredContent({
		status: 'published',
		search: search.trim(),
		limit
	})

	return content.map((c) => ({
		id: c.id,
		title: c.title,
		type: c.type,
		description: c.description
	}))
})
