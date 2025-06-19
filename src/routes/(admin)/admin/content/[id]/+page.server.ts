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

	const formData = {
		title: content.title,
		description: content.description || '',
		slug: content.slug,
		body: content.body || '',
		type: content.type,
		status: content.status,
		metadata: content.metadata || {},
		tags: content.tags?.map((tag) => tag.id) || [],
		children:
			content.type === 'collection' && content.children
				? Array.isArray(content.children)
					? content.children.map((child) => child.id)
					: []
				: undefined
	}

	// Pre-populate form with existing content
	const form = await superValidate(formData, zod4(updateContentSchema))

	// Get all tags for the tag selector
	const tags = locals.tagService.getAllTags()

	// Get available content for collection children selector (exclude collections and current item)
	const availableContent = locals.contentService
		.getFilteredContent({
			status: 'all'
		})
		.filter((item) => item.type !== 'collection' && item.id !== params.id)

	return {
		form,
		tags,
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
			// Get existing content to preserve metadata for imported content
			const existingContent = locals.contentService.getContentById(params.id)

			// Merge metadata - preserve external source info for imported content
			let metadata = form.data.metadata || {}
			if (existingContent?.metadata?.externalSource) {
				metadata = {
					...existingContent.metadata,
					...metadata
				}
			}

			// Prepare update data
			const updateData = {
				...form.data,
				body: form.data.body || '',
				metadata,
				tags: form.data.tags
			}

			// For collections, add children data
			if (form.data.type === 'collection' && form.data.children) {
				updateData.children = JSON.stringify(form.data.children)
			}

			// Update existing content
			locals.contentService.updateContent(params.id, updateData)

			const content = locals.contentService.getContentById(params.id) as Content

			if (content.status === 'draft') {
				locals.searchService.remove(params.id)
			}

			if (content.status === 'published') {
				locals.searchService.update(params.id, {
					id: content.id,
					title: content.title,
					description: content.description,
					tags: content.tags?.map((tag) => tag.slug),
					type: content.type,
					created_at: content.created_at,
					likes: content.likes,
					saves: content.saves
				})
			}

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
