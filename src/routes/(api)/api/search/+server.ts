// src/routes/api/content/+server.ts
import { error, json } from '@sveltejs/kit'
import { z } from 'zod'
import type { RequestHandler } from './$types'

// Create a Zod schema for query parameters
const QuerySchema = z.object({
	type: z.string().optional(),
	tags: z.union([z.string(), z.array(z.string())]).optional(),
	query: z.string().optional()
})

export const GET: RequestHandler = async ({ url, locals }) => {
	try {
		const params: Record<string, string | string[]> = Object.fromEntries(url.searchParams)

		// Handle arrays correctly - convert comma-separated strings to arrays
		if (typeof params.tags === 'string' && params.tags.includes(',')) {
			params.tags = params.tags.split(',')
		}

		const searchResults = locals.search(params)

		return json({
			success: true,
			data: searchResults.hits,
			hits: searchResults.count
		})
	} catch (err) {
		console.error('Error fetching content:', err)
		throw error(500, 'Internal server error')
	}
}
