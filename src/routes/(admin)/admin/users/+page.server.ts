import type { PageServerLoad } from './$types'
import { get_users, delete_user } from '$lib/server/db/user'
import { delete_sessions_by_user_id } from '$lib/server/db/session'
import { fail, redirect } from '@sveltejs/kit'

export const load = (async () => {
	return {
		users: get_users()
	}
}) satisfies PageServerLoad

export const actions = {
	delete: async ({ request }) => {
		const data = await request.formData()
		const id = data.get('id') as string

		if (!id) {
			return fail(400, { message: 'No user id provided.' })
		}

		const deleted_user = delete_user(id)

		if (!deleted_user) {
			return { message: 'Something went wrong.' }
		}

		return { message: `User deleted.` }
	},
	
	clear_sessions: async ({ request }) => {
		const data = await request.formData()
		const id = data.get('id') as string

		if (!id) {
			return fail(400, { message: 'No user id provided.' })
		}

		const deletedCount = delete_sessions_by_user_id(id)

		if (deletedCount === 0) {
			return { message: 'No sessions found for this user.' }
		}

		// Redirect to the landing page after clearing sessions
		redirect(303, '/admin/users')
	}
}
