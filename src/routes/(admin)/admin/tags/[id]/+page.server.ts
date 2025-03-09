import { get_tag, update_tag } from '$lib/server/db/tags'
import { error, fail, redirect } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'
import { zod } from 'sveltekit-superforms/adapters'
import type { PageServerLoad, Actions } from './$types'
import { z } from 'zod'

const schema = z.object({
	id: z.string(),
	name: z.string().min(1, 'Name is required'),
	slug: z.string().min(1, 'Slug is required')
})

export const load: PageServerLoad = async ({ params }) => {
	const tag = get_tag(params.id)

	if (!tag) {
		throw error(404, 'Tag not found')
	}

	const form = await superValidate(tag, zod(schema))

	return { form }
}

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(schema))

		if (!form.valid) {
			return fail(400, { form })
		}

		update_tag(form.data)

		redirect(302, '/admin/tags')
	}
}
