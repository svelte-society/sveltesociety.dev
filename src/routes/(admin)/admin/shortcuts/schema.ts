import { z } from 'zod/v4'

export const shortcutSchema = z.object({
	content_id: z.string().min(1, 'Content is required'),
	label: z.string().optional(),
	priority: z.number().int().min(0).default(0),
	is_active: z.boolean().default(true)
})
