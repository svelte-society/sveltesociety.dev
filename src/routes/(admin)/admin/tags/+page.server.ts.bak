import type { PageServerLoad, Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod4 } from 'sveltekit-superforms/adapters'
import { z } from 'zod/v4'

const deleteSchema = z.object({
	id: z.string()
})

export const load: PageServerLoad = async ({ url, locals }) => {
	// Get pagination parameters from URL
	const page = parseInt(url.searchParams.get('page') || '1', 10)
	const perPage = 10
	const offset = (page - 1) * perPage

	// Get paginated tags and total count
	const tags = locals.tagService.getTags({ limit: perPage, offset }) || []
	const count = locals.tagService.getTagsCount()
	const form = await superValidate(zod4(deleteSchema))

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
		const form = await superValidate(event, zod4(deleteSchema))

		if (!form.valid) {
			return fail(400, { form })
		}

		event.locals.tagService.deleteTag(form.data.id)
		redirect(302, '/admin/tags')
	}
}
