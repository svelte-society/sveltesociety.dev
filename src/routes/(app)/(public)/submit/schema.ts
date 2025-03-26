import { z } from 'zod'

const types = {
	article: 'Article',
	component: 'Component',
	recipe: 'Recipe',
	tutorial: 'Tutorial',
	snippet: 'Code Snippet',
	other: 'Other'
} as const

export const options = Object.entries(types).map(([value, label]) => ({ value, label }))

type ContentType = keyof typeof types

export const schema = z.object({
	title: z.string().min(5, { message: 'Title must be at least 5 characters long' }),
	description: z.string().min(10, { message: 'Description must be at least 10 characters long' }),
	type: z.enum(Object.keys(types) as [ContentType, ...ContentType[]]),
	tags: z.array(z.string()).min(1, { message: 'Please select at least one tag' }),
	url: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
	github_repo: z.string().optional().or(z.literal('')),
	author_name: z.string().min(2, { message: 'Author name must be at least 2 characters long' }),
	author_email: z.string().email({ message: 'Please enter a valid email address' }),
	notes: z.string().optional().or(z.literal(''))
})
