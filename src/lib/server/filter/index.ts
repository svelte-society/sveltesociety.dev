import { z } from 'zod'

export const filter_content_schema = z
	.object({
		type: z.string().optional(),
		tags: z.array(z.string()).optional(),
		search: z.string().optional(),
		sort: z.enum(['latest', 'oldest', 'popular']).optional(),
		limit: z.number().default(20),
		offset: z.number().default(0)
	})
	.partial()
	.refine((data) => !!data.type || !!data.tags || !!data.search, 'No value was provided')

export type filter_content_schema = z.infer<typeof filter_content_schema>

