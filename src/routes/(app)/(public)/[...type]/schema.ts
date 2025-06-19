import { z } from 'zod/v4'

export const schema = z.object({
	category: z.string().optional(),
	tags: z.array(z.string()).optional(),
	query: z.string().optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
	sort: z.string().optional(),
	order: z.enum(['ASC', 'DESC']).optional()
})
