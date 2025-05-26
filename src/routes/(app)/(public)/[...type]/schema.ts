import { z } from 'zod'

export const schema = z.object({
	category: z.string().optional(),
	tags: z.array(z.string()).optional(),
	query: z.string().optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
	sort: z.string().optional(),
	order: z.enum(['ASC', 'DESC']).optional()
})
