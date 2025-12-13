import { form, query, getRequestEvent } from '$app/server'
import { redirect } from '@sveltejs/kit'
import { z } from 'zod/v4'
import { checkAdminAuth } from '../authorization.remote'

// Helper to transform comma-separated array values from form submission
// When using hidden inputs with array values, they may serialize as "a,b,c" instead of ["a","b","c"]
const commaSeparatedArray = z.preprocess((val) => {
	if (Array.isArray(val)) {
		return val.flatMap((s) => (typeof s === 'string' ? s.split(',').filter(Boolean) : s))
	}
	if (typeof val === 'string') {
		return val.split(',').filter(Boolean)
	}
	return val
}, z.array(z.string()))

// Admin create form schema - simplified for the types admins can create directly
const adminCreateContentSchema = z
	.object({
		title: z.string().min(1, 'Title is required'),
		slug: z.string().min(1, 'Slug is required'),
		description: z.string().min(1, 'Description is required'),
		status: z.enum(['draft', 'published', 'archived']),
		type: z.enum(['recipe', 'announcement', 'collection', 'resource']),
		tags: commaSeparatedArray.pipe(z.array(z.string()).min(1, 'At least one tag is required')),
		body: z.string().optional(),
		children: commaSeparatedArray.optional(),
		metadata: z
			.object({
				link: z.string().url().optional(),
				image: z.string().url().optional()
			})
			.optional()
	})
	.superRefine((data, ctx) => {
		// Body is required for recipe, announcement, collection
		if (['recipe', 'announcement', 'collection'].includes(data.type) && !data.body) {
			ctx.addIssue({
				code: 'custom',
				path: ['body'],
				message: 'Body is required'
			})
		}
		// Children required for collection
		if (data.type === 'collection' && (!data.children || data.children.length === 0)) {
			ctx.addIssue({
				code: 'custom',
				path: ['children'],
				message: 'At least one child is required'
			})
		}
		// Link required for resource
		if (data.type === 'resource' && !data.metadata?.link) {
			ctx.addIssue({
				code: 'custom',
				path: ['metadata', 'link'],
				message: 'Resource link is required'
			})
		}
	})

export const getTags = query(() => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	const tags = locals.tagService.getAllTags()
	return tags.map((tag: { id: string; name: string }) => ({
		value: tag.id,
		label: tag.name
	}))
})

export const getAvailableChildren = query(() => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	const content = locals.contentService
		.getFilteredContent({ status: 'published' })
		.filter((item: { type: string }) => item.type !== 'collection')
	return content.map((item: { id: string; title: string; type: string }) => ({
		value: item.id,
		label: `${item.title} (${item.type})`
	}))
})

export const createContent = form(adminCreateContentSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	const contentData = {
		title: data.title,
		slug: data.slug,
		description: data.description,
		status: data.status,
		type: data.type,
		tags: data.tags,
		published_at: data.status === 'published' ? new Date().toISOString() : null,
		...(data.body && { body: data.body }),
		...(data.children && { children: data.children }),
		...(data.metadata && { metadata: data.metadata })
	} as any

	const contentId = locals.contentService.addContent(contentData, locals.user?.id)
	redirect(303, `/admin/content/${contentId}`)
})

const contentIdSchema = z.object({
	id: z.string().min(1, 'Content ID is required')
})

export const getContentById = query(contentIdSchema, ({ id }) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	const content = locals.contentService.getContentById(id)
	if (!content) {
		redirect(303, '/admin/content')
	}
	return content
})

export const getUsers = query(() => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	const users = locals.userService.getUsers() as {
		id: string
		name: string
		username: string
		avatar_url?: string
	}[]
	return users.map((user) => ({
		value: user.id,
		label: `${user.name || user.username} (@${user.username})`,
		avatar: user.avatar_url,
		name: user.name,
		username: user.username
	}))
})

export const getAvailableChildrenForEdit = query(contentIdSchema, ({ id }) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	const content = locals.contentService
		.getFilteredContent({ status: 'all' })
		.filter((item: { type: string; id: string }) => item.type !== 'collection' && item.id !== id)
	return content.map((item: { id: string; title: string; type: string }) => ({
		value: item.id,
		label: `${item.title} (${item.type})`
	}))
})

const adminUpdateContentSchema = z.object({
	id: z.string().min(1, 'Content ID is required'),
	title: z.string().min(1, 'Title is required'),
	slug: z.string().min(1, 'Slug is required'),
	description: z.string().min(1, 'Description is required'),
	status: z.enum(['draft', 'published', 'archived']),
	type: z.enum(['video', 'library', 'recipe', 'announcement', 'collection', 'resource']),
	tags: commaSeparatedArray.pipe(z.array(z.string()).min(1, 'At least one tag is required')),
	author_id: z.string().optional(),
	body: z.string().optional(),
	children: commaSeparatedArray.optional(),
	metadata: z.any().optional()
})

export const updateContent = form(adminUpdateContentSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	const contentData = {
		id: data.id,
		title: data.title,
		slug: data.slug,
		description: data.description,
		status: data.status,
		type: data.type,
		tags: data.tags,
		author_id: data.author_id,
		published_at: data.status === 'published' ? new Date().toISOString() : null,
		...(data.body !== undefined && { body: data.body }),
		...(data.children && { children: data.children }),
		...(data.metadata && { metadata: data.metadata })
	} as any

	locals.contentService.updateContent(contentData)

	const content = locals.contentService.getContentById(data.id)
	if (content) {
		const tags = content.tags as unknown as { slug: string }[] | undefined
		locals.searchService.update(data.id, {
			id: content.id,
			title: content.title,
			description: content.description,
			tags: tags?.map((tag) => tag.slug),
			type: content.type,
			status: content.status,
			created_at: content.created_at,
			published_at: content.published_at || '',
			likes: content.likes,
			saves: content.saves,
			stars: content.metadata?.stars || 0
		})
	}

	return { success: true }
})
