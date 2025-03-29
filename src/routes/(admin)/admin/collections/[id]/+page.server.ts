import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { schema } from '../new/schema'

export const load: PageServerLoad = async ({ params, locals }) => {
	// Get the collection using ContentService
	const content = locals.contentService.getContentById(params.id)
	
	if (!content || content.type !== 'collection') {
		throw error(404, 'Collection not found')
	}

	// Create a form data object with the correct types
	const formData = {
		title: content.title,
		description: content.description || '',
		slug: content.slug,
		children: content.children?.map(child => child.id),
		tags: content.tags?.map(tag => tag.id)
	}

	const form = await superValidate(formData, zod(schema))

	// Get all content for the selector
	const allContent = locals.contentService.getFilteredContent({})

	// Get all tags for the selector
	const allTags = locals.tagService.getTags({ limit: 100 })

	return {
		form,
		content: allContent,
		tags: allTags
	}
}

export const actions: Actions = {
	default: async ({ request, locals, params }) => {
		// Validate form data
		const form = await superValidate(request, zod(schema))
		if (!form.valid) {
			return fail(400, { form })
		}

		try {
			// Update the collection using the CollectionService
			locals.collectionService.updateCollection(params.id, {
				title: form.data.title,
				slug: form.data.slug,
				description: form.data.description,
				children: form.data.children,
				tags: form.data.tags
			})

			throw redirect(303, '/admin/collections')
		} catch (e) {
			if (e instanceof Response) throw e
			console.error('Failed to update collection:', e)
			return fail(500, { 
				form,
				error: 'Failed to update collection. Please try again.'
			})
		}
	}
}
