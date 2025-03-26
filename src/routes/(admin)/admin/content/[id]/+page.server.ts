import { superValidate, message } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import type { Content } from '$lib/server/db/content'
import { Status } from '$lib/server/db/common'

import { schema } from './schema'
import { contentSchema } from '$lib/schema/content'

export const load: PageServerLoad = async ({ params, locals }) => {
	// Load existing content for editing
	const content = await locals.contentService.getContentById(params.id)

	if (!content) {
		throw redirect(303, '/admin/content')
	}

	// Pre-populate form with existing content
	const form = await superValidate(content, zod(contentSchema))

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
		const form = await superValidate(request, zod(contentSchema))

		if (!form.valid) {
			return fail(400, { form })
		}

		try {
			// Update existing content
			await locals.contentService.updateContent(params.id, form.data)

			// Redirect to content listing after successful save
			throw redirect(303, '/admin/content')
		} catch (error) {
			if (error instanceof Response) throw error

			console.error('Error updating content:', error)
			return fail(500, {
				form,
				error: 'Failed to update content. Please try again.'
			})
		}
	}
}
