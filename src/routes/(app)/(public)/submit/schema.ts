import { z } from 'zod/v4'

// Base schema with common fields (no title - videos/libraries get title from API, recipes define their own)
const baseSchema = z.object({
	tags: z
		.array(z.string())
		.default([])
		.transform((arr) =>
			arr
				.flatMap((tag) => (tag.includes(',') ? tag.split(',') : [tag]))
				.map((tag) => tag.trim())
				.filter((tag) => tag !== '')
		)
		.refine((arr) => arr.length > 0, { message: 'Please select at least one tag' }),
	description: z.string().min(10, { message: 'Description must be at least 10 characters long' }),
	notes: z.string().optional()
})

export const videoSchema = baseSchema.extend({
	type: z.literal('video'),
	url: z.url({ message: 'Please enter a valid YouTube URL' })
})

export const librarySchema = baseSchema.extend({
	type: z.literal('library'),
	github_repo: z
		.string()
		.min(1, { message: 'GitHub repository is required for library submissions' })
		.refine(
			(val) => {
				// Accept: owner/repo, owner/repo/path, or full GitHub URLs
				const urlPattern =
					/^https?:\/\/github\.com\/([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+)(?:\/tree\/[^/]+\/(.+))?/
				const repoPattern = /^([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+)(?:\/(.+))?$/
				return urlPattern.test(val) || repoPattern.test(val)
			},
			{ message: 'Must be a valid GitHub repository (owner/repo or owner/repo/path for monorepos)' }
		)
})

export const recipeSchema = baseSchema.extend({
	type: z.literal('recipe'),
	title: z.string().min(5, { message: 'Title must be at least 5 characters long' }),
	body: z.string().min(10, { message: 'Recipe content must be at least 10 characters long' })
})

export const resourceSchema = baseSchema.extend({
	type: z.literal('resource'),
	title: z.string().min(5, { message: 'Title must be at least 5 characters long' }),
	link: z.url({ message: 'Please enter a valid URL' })
})

export const schema = z.union([videoSchema, librarySchema, recipeSchema, resourceSchema])
