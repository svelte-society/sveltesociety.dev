import { error, fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { superValidate, message } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { createCollectionSchema } from '$lib/schema/content'

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
				return message(form, {
					success: false,
					text: 'Invalid form data. Please check the form and try again.'
				})
			}

			locals.collectionService.createCollection({
				title: form.data.title,
				slug: form.data.slug,
				description: form.data.description,
				children: form.data.children,
				tags: form.data.tags
			})

			return message(form, { success: true, text: 'Successfully created collection.'})
		} catch (err) {
			if (err instanceof Response) throw err

			console.error('Error creating collection:', err)
			return message(form, {
				success: false,
				text: 'Something went wrong, please try again.'
			})
		}
	}
}
