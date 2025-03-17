import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { schema } from './schema'

export const load: PageServerLoad = async ({ params, locals }) => {
	const userFromDb = locals.userService.getUser(params.id)
	const roles = locals.roleService.getActiveRoles()

	if (!userFromDb) {
		redirect(302, '/admin/users')
	}
	
	// Convert null values to undefined to match schema expectations
	const user = {
		...userFromDb,
		email: userFromDb.email || undefined,
		bio: userFromDb.bio || undefined,
		location: userFromDb.location || undefined,
		twitter: userFromDb.twitter || undefined,
		avatar_url: userFromDb.avatar_url || ''
	}

	const form = await superValidate(user, zod(schema))

	return {
		user: userFromDb,
		roles: roles.map((r) => ({ ...r, label: r.name, value: r.id })),
		form
	}
}

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(schema))

		if (!form.valid) {
			return fail(400, { form })
		}

		const updated_user = await locals.userService.updateUser(form.data.id, form.data)

		redirect(302, '/admin/users')
	}
}