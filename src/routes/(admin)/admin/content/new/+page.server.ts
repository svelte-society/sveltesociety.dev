import { superValidate, message } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

import { createContentSchema } from '$lib/schema/content'

export const load: PageServerLoad = async ({ locals }) => {
	// Create a new form with default values
	const form = await superValidate(zod(createContentSchema))

	// Get all tags for the tag selector
	const tags = locals.tagService.getAllTags()

	return {
		form,
		tags
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
			// Create new content using service
			locals.contentService.addContent({
				...form.data,
				body: form.data.body,
				tags: form.data.tags.map((tag) => tag.id)
			})

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
