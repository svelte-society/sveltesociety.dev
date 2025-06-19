import { superValidate, message } from 'sveltekit-superforms'
import { zod4 } from 'sveltekit-superforms/adapters'
import { fail, redirect } from '@sveltejs/kit'
import { updateRoleSchema } from '$lib/schema/roles'

export const load = async ({ params, locals }) => {
	const role = locals.roleService.getRoleById(parseInt(params.id))

	if (!role) {
		redirect(302, '/admin/roles')
	}

	const form = await superValidate(role, zod4(updateRoleSchema))
	return {
		form
	}
}
export const actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod4(updateRoleSchema))

		if (!form.valid) {
			return fail(400, { form })
		}

		const updated_role = locals.roleService.updateRole(form.data)

		if (!updated_role) {
			return message(form, 'Something went wrong.')
		}

		// Display a success status message
		redirect(302, '/admin/roles')
	}
}
