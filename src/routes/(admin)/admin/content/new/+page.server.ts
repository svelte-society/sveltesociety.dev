import { superValidate } from 'sveltekit-superforms'
import { fail } from '@sveltejs/kit'
import { zod } from 'sveltekit-superforms/adapters'
import type { Actions, PageServerLoad } from './$types'

import { createContentSchema } from '$lib/schema/content'

export const load: PageServerLoad = async ({ locals }) => {
	const form = await superValidate(zod(createContentSchema))

	// Get all tags for the tag selector
	const tags = locals.tagService.getAllTags()

	// Get available content for collection children selector (exclude collections to prevent nesting)
	const availableContent = locals.contentService
		.getFilteredContent({
			status: 'published'
		})
		.filter((content) => content.type !== 'collection')

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

		// Create new content using service
		const contentId = locals.contentService.addContent(form.data)
	}
}
