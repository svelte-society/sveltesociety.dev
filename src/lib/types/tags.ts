import { z } from 'zod'

export const TagSchema = z.object({
	id: z.string(),
	name: z.string(),
	slug: z.string(),
	color: z.string().optional()
})

export type Tag = z.infer<typeof TagSchema>