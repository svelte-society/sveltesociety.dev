import { z } from 'zod'
import { superValidate, message } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { fail, redirect } from '@sveltejs/kit'

const schema = z.object({
	id: z.number(),
	name: z.string(),
	value: z.string(),
	description: z.string(),
	active: z.boolean()
})

export const load = async ({ params, locals }) => {
	const role = locals.roleService.getRoleById(parseInt(params.id))

	if (!role) {
		redirect(302, '/admin/roles')
	}

	const form = await superValidate(role as z.infer<typeof schema>, zod(schema))
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

		const updated_role = locals.roleService.updateRole(form.data)

		if (!updated_role) {
			return message(form, 'Something went wrong.')
		}

		// Display a success status message
		redirect(302, '/admin/roles')
	}
}
