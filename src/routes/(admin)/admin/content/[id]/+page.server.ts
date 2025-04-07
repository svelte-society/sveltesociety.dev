import { superValidate, message } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
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
		body: content.body,
		tags: content.tags?.map((tag) => tag.id)
	}

	// Pre-populate form with existing content
	const form = await superValidate(formData, zod(updateContentSchema))

	// Get all tags for the tag selector
	const tags = await locals.tagService.getTags()

	return {
		form,
		tags,
		contentId: params.id
	}
}

export const actions: Actions = {
	default: async ({ request, params, locals }) => {
		// Get form data and validate
		const form = await superValidate(request, zod(updateContentSchema))

		if (!form.valid) {
			return message(form, {
				success: false,
				text: 'Invalid form data. Please check the form and try again.'
			})
		}

		try {
			// Update existing content
			locals.contentService.updateContent(params.id, {
				...form.data,
				body: form.data.body || '',
				tags: form.data.tags
			})

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
