import { error } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { message, superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { updateCollectionSchema } from '$lib/schema/content'

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
		children: content.children?.map((child) => child.id),
		tags: content.tags?.map((tag) => tag.id)
	}

	const form = await superValidate(formData, zod(updateCollectionSchema))

	// Get all content for the selector
	const allContent = locals.contentService.getFilteredContent({})
	// Get all tags for the selector
	const allTags = locals.tagService.getAllTags()

	return {
		form,
		content: allContent,
		tags: allTags
	}
}

export const actions: Actions = {
	default: async ({ request, locals, params }) => {
		// Validate form data
		const form = await superValidate(request, zod(updateCollectionSchema))
		if (!form.valid) {
			return message(form, {
				success: false,
				text: 'Invalid form data. Please check the form and try again.'
			})
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

			return message(form, { success: true, text: 'Successfully updated collection.' })
		} catch (e) {
			if (e instanceof Response) throw e
			console.error('Failed to update collection:', e)
			return message(form, {
				success: false,
				text: 'Something went wrong, please try again.'
			})
		}
	}
}
