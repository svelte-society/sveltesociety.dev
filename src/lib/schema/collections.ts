import { z } from 'zod'
import { contentSchema } from './content'

export const collectionSchema = contentSchema.extend({
	type: z.literal('collection'),
	children: z.array(contentSchema)
}).omit({
	body: true,
	metadata: true
})

export const createCollectionSchema = collectionSchema.omit({
	id: true,
	created_at: true,
	updated_at: true
}).extend({
	tags: z.array(z.string())
})

export const updateCollectionSchema = collectionSchema.omit({
	id: true,
	created_at: true,
	updated_at: true
}).extend({
	tags: z.array(z.string())
})
