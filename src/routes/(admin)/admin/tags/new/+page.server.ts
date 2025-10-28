import { superValidate } from 'sveltekit-superforms'
import { zod4 } from 'sveltekit-superforms/adapters'
import { fail, redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'
import { tagSchema } from '$lib/schema/tags'
import { ADMIN_ROUTES } from '$lib/admin'

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(tagSchema))
	return { form }
}

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod4(tagSchema))

		if (!form.valid) {
			return fail(400, { form })
		}

		try {
			locals.tagService.createTag(form.data)
			redirect(303, ADMIN_ROUTES.tags.list)
		} catch (error) {
			console.error('Error creating tag:', error)
			return fail(500, { form })
		}
	}
}
