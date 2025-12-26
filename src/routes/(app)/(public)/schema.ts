import { z } from 'zod/v4'

// Shared schema for URL search params - used by both homepage and category pages
// Uses zod-search-params compatible format with .catch() for defaults
export const schema = z.object({
	type: z.array(z.string()).catch([]), // Content types (homepage filter)
	tags: z.array(z.string()).catch([]), // Tags filter
	authors: z.array(z.string()).catch([]), // Author usernames
	query: z.string().catch(''), // Search query
	page: z.number().catch(1), // Pagination
	sort: z.string().optional().catch(undefined), // Sort field
	order: z.enum(['ASC', 'DESC']).optional().catch(undefined) // Sort direction
})

export type SearchParams = z.infer<typeof schema>
