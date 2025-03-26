import { z } from 'zod'
import { packageNameRegex } from 'package-name-regex'

export const contentSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	type: z.enum(['recipe', 'video', 'library', 'announcement', 'showcase']),
	body: z.string().min(1, 'Body is required'),
	slug: z.string().min(1, 'Slug is required'),
	description: z.string().min(1, 'Description is required'),
	tags: z.array(z.string()).min(1, 'At least one tag is required'),
	status: z.enum(['draft', 'published', 'archived']).default('draft'),
	metadata: z
		.object({
			videoId: z.string().optional(),
			npm: z.string().optional()
		})
		.optional()
		.default({})
})
