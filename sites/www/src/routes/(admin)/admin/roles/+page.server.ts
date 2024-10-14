import { get_roles, delete_role } from '$lib/server/db/role'
import { fail } from '@sveltejs/kit'

export const load = async () => {
	return {
		roles: get_roles()
	}
}

export const actions = {
	delete: async ({ request }) => {
		const data = await request.formData()
		const id = data.get('id') as unknown as number

		if (!id) {
			return fail(400, { message: 'No role id provided.' })
		}

		const deleted_role = delete_role(id)

		if (!deleted_role) {
			return { message: 'Something went wrong.' }
		}

		return { message: `Role deleted.` }
	}
}
