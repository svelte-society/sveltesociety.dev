import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'

import { schema } from './schema.js'

export const load: PageServerLoad = async ({ locals }) => {
	const tags = locals.tagService.getTags()
	const content = locals.contentService.getFilteredContent({})
	
	// Initialize form with empty data
	const formData = {
		title: '',
		description: '',
		children: [],
		slug: '',
		tags: []
	};
	
	const form = await superValidate(formData, zod(schema))

	return {
		form,
		content,
		tags
	}
}

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(schema))

		if (!form.valid) {
			return fail(400, { form })
		}

		// Create the collection using the database directly since we need specific functionality
		// This will be refactored once we fully migrate to service methods
		const insertStmt = locals.db.prepare(`
			INSERT INTO content (title, slug, description, type, content, status)
			VALUES (?, ?, ?, 'collection', ?, 'published')
			RETURNING id
		`);

		const collectionContent = JSON.stringify({ children: form.data.children });
		const result = insertStmt.get(
			form.data.title,
			form.data.slug,
			form.data.description,
			collectionContent
		) as { id: string } | undefined;

		if (result?.id) {
			redirect(303, '/admin/collections')
		} else {
			error(500, 'Failed to create collection')
		}
	}
}
