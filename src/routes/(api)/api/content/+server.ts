// src/routes/api/content/+server.ts
import { error, json } from '@sveltejs/kit'
import { z } from 'zod'
import type { RequestHandler } from './$types'

// Create a Zod schema for query parameters
const QuerySchema = z.object({
	type: z.string().optional(),
	tags: z.union([z.string(), z.array(z.string())]).optional(),
	search: z.string().optional(),
	status: z.string().optional(),
	limit: z.coerce.number().positive().optional(),
	offset: z.coerce.number().nonnegative().optional(),
	sort: z.enum(['latest', 'oldest', 'popular']).optional()
})

export const GET: RequestHandler = async ({ url, locals }) => {
	try {
		// Extract and validate query parameters
		const params: Record<string, string | string[]> = Object.fromEntries(url.searchParams)

		// Handle arrays correctly - convert comma-separated strings to arrays
		if (typeof params.tags === 'string' && params.tags.includes(',')) {
			params.tags = params.tags.split(',')
		}

		// Parse and validate with Zod
		const result = QuerySchema.safeParse(params)

		if (!result.success) {
			// Return validation errors
			return json(
				{
					success: false,
					errors: result.error.format()
				},
				{ status: 400 }
			)
		}

		// Fetch content with validated filters
		const filters = result.data
		const content = locals.contentService.getFilteredContent(filters)

		// Get total count for pagination
		const { limit, offset, sort, ...countFilters } = filters
		const total = locals.contentService.getFilteredContentCount(countFilters)

		return json({
			success: true,
			data: content,
			pagination: {
				total,
				limit: filters.limit || null,
				offset: filters.offset || 0
			}
		})
	} catch (err) {
		console.error('Error fetching content:', err)
		throw error(500, 'Internal server error')
	}
}
