import { superValidate, message } from 'sveltekit-superforms'
import { zod4 } from 'sveltekit-superforms/adapters'
import { redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

import { updateContentSchema } from '$lib/schema/content'
import type { Content } from '$lib/types/content'

export const load: PageServerLoad = async ({ params, locals }) => {
	// Load existing content for editing
	const content = locals.contentService.getContentById(params.id)

	if (!content) {
		throw redirect(303, '/admin/content')
	}

	// Extract body safely based on content type
	const bodyValue = content.type === 'recipe' && 'body' in content ? content.body || '' : ''

	// Extract children safely for collections
	const childrenValue = content.type === 'collection' && content.children
		? Array.isArray(content.children) && content.children.length > 0
			? typeof content.children[0] === 'string'
				? content.children
				: content.children.map((child) => typeof child === 'string' ? child : child.id)
			: []
		: undefined

	const formData = {
		id: params.id,
		title: content.title,
		description: content.description || '',
		slug: content.slug,
		body: bodyValue,
		type: content.type,
		status: content.status,
		metadata: content.metadata || {},
		tags: content.tags?.map((tag) => typeof tag === 'string' ? tag : tag.id) || [],
		author_id: content.author_id || '',
		children: childrenValue
	}

	const form = await superValidate(formData, zod4(updateContentSchema))

	const tags = locals.tagService.getAllTags()
	const users = locals.userService.getUsers()

	const availableContent = locals.contentService
		.getFilteredContent({
			status: 'all'
		})
		.filter((item) => item.type !== 'collection' && item.id !== params.id)

	return {
		form,
		tags,
		users,
		availableContent,
		contentId: params.id,
		content // Pass full content for additional metadata display
	}
}

export const actions: Actions = {
	default: async ({ request, params, locals }) => {
		// Get form data and validate
		const form = await superValidate(request, zod4(updateContentSchema))

		if (!form.valid) {
			return message(form, {
				success: false,
				text: 'Invalid form data. Please check the form and try again.'
			})
		}

		try {
			locals.contentService.updateContent(form.data)

			const content = locals.contentService.getContentById(form.data.id) as Content

			// Update search index regardless of status
			locals.searchService.update(form.data.id, {
				id: content.id,
				title: content.title,
				description: content.description,
				tags: content.tags?.map((tag) => typeof tag === 'string' ? tag : tag.slug),
				type: content.type,
				status: content.status,
				created_at: content.created_at,
				published_at: content.published_at || '',
				likes: content.likes,
				saves: content.saves,
				stars: content.metadata?.stars || 0
			})

			// Return with success message
			return message(form, {
				success: true,
				text: 'Content updated successfully.'
			})
		} catch (error) {
			if (error instanceof Response) throw error

			console.error('Error updating content:', error)
			return message(form, {
				success: false,
				text: 'Failed to update content. Please try again.'
			})
		}
	}
}
