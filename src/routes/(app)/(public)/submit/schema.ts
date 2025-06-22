import { z } from 'zod/v4'

const types = {
	recipe: 'Recipe',
	video: 'Video',
	library: 'Library'
} as const

export type ContentType = keyof typeof types

export const options = Object.entries(types).map(([value, label]) => ({
	value,
	label,
	type: value as ContentType
}))

// Base schema with common fields
const baseSchema = z.object({
	title: z.string().optional(),
	type: z.enum(Object.keys(types) as [ContentType, ...ContentType[]]),
	tags: z.array(z.string()).min(1, { message: 'Please select at least one tag' }),
	description: z.string().min(10, { message: 'Description must be at least 10 characters long' }),
	notes: z.string().optional()
})

const videoSchema = baseSchema.extend({
	type: z.literal('video'),
	url: z.url({ message: 'Please enter a valid YouTube URL' })
})

const librarySchema = baseSchema.extend({
	type: z.literal('library'),
	github_repo: z
		.string()
		.min(1, { message: 'GitHub repository is required for library submissions' })
})

const recipeSchema = baseSchema.extend({
	type: z.literal('recipe'),
	title: z.string().min(5, { message: 'Title must be at least 5 characters long' }),
	body: z.string().min(10, { message: 'Recipe content must be at least 10 characters long' })
})

export const schema = z.discriminatedUnion('type', [videoSchema, librarySchema, recipeSchema])

export type SubmissionData = z.infer<typeof schema>
