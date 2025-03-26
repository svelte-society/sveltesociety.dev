import { superValidate, message } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { fail, redirect } from '@sveltejs/kit'
import { schema } from './schema'

export const load = async () => {
	const form = await superValidate(zod(schema))
	return {
		form
	}
}
export const actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(schema))

		if (!form.valid) {
			return fail(400, { form })
		}

		const created_role_id = locals.roleService.createRole(form.data)

		if (!created_role_id) {
			return message(form, 'Something went wrong.')
		}

		// Display a success status message
		redirect(302, '/admin/roles/')
	}
}
