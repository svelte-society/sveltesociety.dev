import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { createCollectionSchema } from '$lib/schema/collections'

export const load: PageServerLoad = async ({ locals }) => {
	try {
		// Create a new form with default values
		const form = await superValidate(zod(createCollectionSchema))

		// Get all content and tags for the selectors
		const content = locals.contentService.getFilteredContent({})
		const tags = locals.tagService.getTags()

		return {
			form,
			content,
			tags
		}
	} catch (err) {
		console.error('Error in collections/new load function:', err)
		throw error(500, 'Failed to load form data')
	}
}

export const actions: Actions = {
	default: async ({ request, locals }) => {
		// Initialize form outside try block so it's available in catch
		const form = await superValidate(request, zod(createCollectionSchema))

		try {
			if (!form.valid) {
				return fail(400, { form })
			}

			locals.collectionService.createCollection({
				title: form.data.title,
				slug: form.data.slug,
				description: form.data.description,
				children: form.data.children,
				tags: form.data.tags
			})

			// Redirect to collections listing after successful save
			redirect(303, '/admin/collections')
		} catch (err) {
			if (err instanceof Response) throw err

			console.error('Error creating collection:', err)
			return fail(500, {
				form,
				error: 'Failed to create collection. Please try again.'
			})
		}
	}
}
