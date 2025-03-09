import { get_tags, delete_tag, get_tags_count } from '$lib/server/db/tags'
import type { PageServerLoad, Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'
import { superValidate, message } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'

const deleteSchema = z.object({
	id: z.string()
})

export const load: PageServerLoad = async ({ url }) => {
	// Get pagination parameters from URL
	const page = parseInt(url.searchParams.get('page') || '1', 10)
	const perPage = 10
	const offset = (page - 1) * perPage
	
	// Get paginated tags and total count
	const tags = get_tags({ limit: perPage, offset }) || []
	const count = get_tags_count()
	const form = await superValidate(zod(deleteSchema))

	if (!tags) {
		return fail(400, { message: 'Error getting tags' })
	}

	return { 
		tags, 
		count,
		perPage,
		form 
	}
}

export const actions: Actions = {
	delete: async (event) => {
		const form = await superValidate(event, zod(deleteSchema))

		if (!form.valid) {
			return fail(400, { form })
		}

		delete_tag(form.data.id)
		redirect(302, '/admin/tags')
	}
}
