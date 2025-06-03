import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import type { PageServerLoad, Actions } from './$types'
import { tagSchema } from '$lib/schema/tags'
import { handleFormAction, ADMIN_ROUTES } from '$lib/admin'

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(tagSchema))
	return { form }
}

export const actions: Actions = {
	default: async ({ request, locals }) => {
		return handleFormAction({
			request,
			schema: tagSchema,
			onSuccess: (data) => {
				locals.tagService.createTag(data)
			},
			redirectTo: ADMIN_ROUTES.tags.list
		})
	}
}
