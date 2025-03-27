import { z } from 'zod'
import { packageNameRegex } from 'package-name-regex'

export const schema = z.object({
	title: z.string().min(1, 'Title is required'),
	type: z.enum(['recipe', 'video', 'library', 'announcement', 'showcase']),
	body: z.string().min(1, 'Body is required'),
	slug: z.string().min(1, 'Slug is required'),
	description: z.string().min(1, 'Description is required'),
	tags: z.array(z.object({ id: z.string(), slug: z.string(), name: z.string(), color: z.string().optional().nullable() })).min(1, 'At least one tag is required'),
	status: z.enum(['draft', 'published', 'archived']).default('draft'),
	metadata: z.union([
		z.object({
			videoId: z
				.string()
				.regex(/^[a-zA-Z0-9_-]+$/)
				.optional(),
			npm: z.string().regex(packageNameRegex).optional()
		}),
		z.record(z.string().regex(/^[a-z0-9]+$/i), z.string())
	])
}) 