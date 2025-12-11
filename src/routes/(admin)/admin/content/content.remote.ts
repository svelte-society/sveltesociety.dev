import { form, query, getRequestEvent } from '$app/server'
import { redirect } from '@sveltejs/kit'
import { z } from 'zod/v4'
import { checkAdminAuth } from '../authorization.remote'

// Admin create form schema - simplified for the types admins can create directly
const adminCreateContentSchema = z
	.object({
		title: z.string().min(1, 'Title is required'),
		slug: z.string().min(1, 'Slug is required'),
		description: z.string().min(1, 'Description is required'),
		status: z.enum(['draft', 'published', 'archived']),
		type: z.enum(['recipe', 'announcement', 'collection', 'resource']),
		tags: z.array(z.string()).min(1, 'At least one tag is required'),
		body: z.string().optional(),
		children: z.array(z.string()).optional(),
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

	// Build the content object based on type
	// Cast to any because the service expects a discriminated union but we validate with our own schema
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
