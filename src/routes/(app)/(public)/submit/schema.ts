import { z } from 'zod'

// Available content types for submission
const types = {
	recipe: 'Recipe',
	video: 'Video',
	library: 'Library',
	link: 'Link'
} as const

export const options = Object.entries(types).map(([value, label]) => ({ value, label }))

type ContentType = keyof typeof types

// Base schema with common fields
const baseSchema = z.object({
	title: z.string().min(5, { message: 'Title must be at least 5 characters long' }),
	description: z.string().min(10, { message: 'Description must be at least 10 characters long' }),
	type: z.enum(Object.keys(types) as [ContentType, ...ContentType[]]),
	tags: z.array(z.string()).min(1, { message: 'Please select at least one tag' }),
	notes: z.string().optional().or(z.literal(''))
})

// Type-specific fields
const typeSpecificFields = {
	recipe: z.object({
		body: z.string().min(10, { message: 'Recipe content must be at least 10 characters long' })
	}),
	video: z.object({
		url: z.string().url({ message: 'Please enter a valid YouTube URL' })
	}),
	library: z.object({
		github_repo: z
			.string()
			.min(1, { message: 'GitHub repository is required for library submissions' })
	}),
	link: z.object({
		url: z.string().url({ message: 'Please enter a valid URL' })
	})
}

export const schema = z.discriminatedUnion('type', [
	baseSchema.merge(typeSpecificFields.recipe).extend({ type: z.literal('recipe') }),
	baseSchema.merge(typeSpecificFields.video).extend({ type: z.literal('video') }),
	baseSchema.merge(typeSpecificFields.library).extend({ type: z.literal('library') }),
	baseSchema.merge(typeSpecificFields.link).extend({ type: z.literal('link') })
])

export type SubmissionData = z.infer<typeof schema>
