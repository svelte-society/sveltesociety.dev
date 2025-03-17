import type { PageServerLoad } from './$types'
import { fail, redirect } from '@sveltejs/kit'

export const load = (async ({ locals }) => {
	return {
		users: locals.userService.getUsers()
	}
}) satisfies PageServerLoad

export const actions = {
	delete: async ({ request, locals }) => {
		const data = await request.formData()
		const id = data.get('id') as string

		if (!id) {
			return fail(400, { message: 'No user id provided.' })
		}

		const deleted_user = locals.userService.deleteUser(id)

		if (!deleted_user) {
			return { message: 'Something went wrong.' }
		}

		return { message: `User deleted.` }
	},
	
	clear_sessions: async ({ request, locals }) => {
		const data = await request.formData()
		const id = data.get('id') as string

		if (!id) {
			return fail(400, { message: 'No user id provided.' })
		}

		const deletedCount = locals.sessionService.deleteSessionsByUserId(id)

		if (deletedCount === 0) {
			return { message: 'No sessions found for this user.' }
		}

		// Redirect to the landing page after clearing sessions
		redirect(303, '/admin/users')
	}
}
