import { z } from 'zod'
import { tagSchema } from './tags'

export const typeSchema = z.enum(['recipe', 'video', 'library', 'announcement', 'showcase', 'collection'])

const baseContentSchema = z.object({
	id: z.string(),
	title: z.string(),
	slug: z.string(),
	description: z.string().min(10),
	type: typeSchema,
	status: z.string(),
	body: z.string().optional(),
	rendered_body: z.string(),
	author: z.string(),
	tags: z.array(tagSchema),
	created_at: z.string(),
	updated_at: z.string(),
	published_at: z.string().nullable(),
	likes: z.number(),
	saves: z.number(),
	liked: z.boolean(),
	saved: z.boolean(),
	views: z.number(),
	metadata: z.object({
		videoId: z.string().optional(),
		npm: z.string().optional()
	}).optional()
})

export const contentSchema = baseContentSchema.extend({
	children: baseContentSchema.array()
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

export const updateCollectionSchema = updateContentSchema.extend({
	children: z.array(z.string()),
	tags: z.array(z.string())
})

export const createCollectionSchema = createContentSchema.extend({
	children: z.array(z.string()),
	tags: z.array(z.string())
})