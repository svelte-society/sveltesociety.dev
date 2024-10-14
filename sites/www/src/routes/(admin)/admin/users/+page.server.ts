import type { PageServerLoad } from './$types'
import { get_users, delete_user } from '$lib/server/db/user'
import { fail } from '@sveltejs/kit'

export const load = (async () => {
	return {
		users: get_users()
	}
}) satisfies PageServerLoad

export const actions = {
	delete: async ({ request }) => {
		const data = await request.formData()
		const id = data.get('id') as unknown as number

		if (!id) {
			return fail(400, { message: 'No user id provided.' })
		}

		const deleted_user = delete_user(id)

		if (!deleted_user) {
			return { message: 'Something went wrong.' }
		}

		return { message: `User deleted.` }
	}
}
