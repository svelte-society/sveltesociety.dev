import { create_content, get_content } from '$lib/server/db/content'
import { get_tags } from '$lib/server/db/tags'
import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'

import { schema } from './schema.js'

export const load = async () => {
	const tags = get_tags()
	const content = get_content({})
	
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
	default: async ({ request }) => {
		const form = await superValidate(request, zod(schema))

		if (!form.valid) {
			return fail(400, { form })
		}

		const result = create_content({
			title: form.data.title,
			description: form.data.description,
			children: form.data.children,
			slug: form.data.slug,
			type: 'collection'
		})

		if (result) {
			redirect(303, '/admin/collections')
		} else {
			error(500, 'Failed to create collection')
		}
	}
}
