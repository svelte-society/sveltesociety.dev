import { z } from 'zod/v4'

const types = {
	recipe: 'Recipe',
	video: 'Video',
	library: 'Library',
	resource: 'Resource'
} as const

type ContentType = keyof typeof types

export const options = Object.entries(types).map(([value, label]) => ({
	value,
	label,
	type: value as ContentType
}))

// Base schema with common fields (no title - videos/libraries get title from API, recipes define their own)
const baseSchema = z.object({
	type: z.enum(Object.keys(types) as [ContentType, ...ContentType[]]),
	tags: z.array(z.string()).min(1, { message: 'Please select at least one tag' }),
	description: z.string().min(10, { message: 'Description must be at least 10 characters long' }),
	notes: z.string().optional()
})

const videoSchema = baseSchema.extend({
	type: z.literal('video'),
	url: z.string().url({ message: 'Please enter a valid YouTube URL' })
})

const librarySchema = baseSchema.extend({
	type: z.literal('library'),
	github_repo: z
		.string()
		.min(1, { message: 'GitHub repository is required for library submissions' })
		.refine(
			(val) => {
				// Accept: owner/repo, owner/repo/path, or full GitHub URLs
				const urlPattern = /^https?:\/\/github\.com\/([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+)(?:\/tree\/[^/]+\/(.+))?/
				const repoPattern = /^([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+)(?:\/(.+))?$/
				return urlPattern.test(val) || repoPattern.test(val)
			},
			{ message: 'Must be a valid GitHub repository (owner/repo or owner/repo/path for monorepos)' }
		)
})

const recipeSchema = baseSchema.extend({
	type: z.literal('recipe'),
	title: z.string().min(5, { message: 'Title must be at least 5 characters long' }),
	body: z.string().min(10, { message: 'Recipe content must be at least 10 characters long' })
})

const resourceSchema = baseSchema.extend({
	type: z.literal('resource'),
	title: z.string().min(5, { message: 'Title must be at least 5 characters long' }),
	link: z.string().url({ message: 'Please enter a valid URL' }),
	image: z
		.string()
		.url({ message: 'Please enter a valid image URL' })
		.optional()
		.or(z.literal(''))
})

export const schema = z.union([videoSchema, librarySchema, recipeSchema, resourceSchema])
