import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

import { createContentSchema } from '$lib/schema/content'

export const load: PageServerLoad = async ({ locals }) => {
	// Create a new form with default values
	const defaultData = {
		status: 'draft' // Default to draft status
	}
	const form = await superValidate(defaultData, zod(createContentSchema))

	// Get all tags for the tag selector
	const tags = locals.tagService.getAllTags()

	// Get available content for collection children selector (exclude collections to prevent nesting)
	const availableContent = locals.contentService.getFilteredContent({
		status: 'all'
	}).filter(content => content.type !== 'collection')

	return {
		form,
		tags,
		availableContent
	}
}

export const actions: Actions = {
	default: async ({ request, locals }) => {
		// Get form data and validate
		const form = await superValidate(request, zod(createContentSchema))

		if (!form.valid) {
			return fail(400, { form })
		}

		try {
			// Prepare content data
			const contentData = {
				...form.data,
				body: form.data.body,
				tags: form.data.tags.map((tag) => tag.id),
				author_id: locals.user?.id
			}

			// For collections, add children data  
			if (form.data.type === 'collection' && form.data.children) {
				contentData.children = JSON.stringify(form.data.children)
			}

			// Create new content using service
			locals.contentService.addContent(contentData)

			// Redirect to content listing after successful save
			throw redirect(303, '/admin/content')
		} catch (error) {
			if (error instanceof Response) throw error

			console.error('Error creating content:', error)
			return fail(500, {
				form,
				error: 'Failed to create content. Please try again.'
			})
		}
	}
}
