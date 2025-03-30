import { z } from 'zod'
import { TagSchema } from './tags'

export const typeSchema = z.enum(['recipe', 'video', 'library', 'announcement', 'showcase', 'collection'])

export const contentSchema = z.object({
	id: z.string(),
	title: z.string(),
	slug: z.string(),
	description: z.string(),
	type: typeSchema,
	status: z.string(),
	content: z.string(),
	body: z.string(),
	rendered_body: z.string(),
	author: z.string(),
	tags: z.array(TagSchema),
	created_at: z.string(),
	updated_at: z.string(),
	published_at: z.string().nullable(),
	likes: z.number(),
	saves: z.number(),
	liked: z.boolean(),
	saved: z.boolean(),
	children: z.array(z.string()),
	views: z.number(),
	metadata: z.object({
		videoId: z.string().optional(),
		npm: z.string().optional()
	}).optional()
})

export const updateContentSchema = contentSchema.omit({
	created_at: true,
	updated_at: true,
	published_at: true,
	likes: true,
	saves: true,
	liked: true,
	saved: true,
	views: true,
	children: true,
})

export const createContentSchema = updateContentSchema.omit({
	id: true,
})