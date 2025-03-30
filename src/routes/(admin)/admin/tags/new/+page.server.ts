import { superValidate, message } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { fail, redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'
import { tagSchema } from '$lib/schema/tags'

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(tagSchema))
	return { form }
}

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(tagSchema))
		if (!form.valid) {
			return fail(400, { form })
		}
		locals.tagService.createTag(form.data)
		redirect(302, '/admin/tags')
	}
}
