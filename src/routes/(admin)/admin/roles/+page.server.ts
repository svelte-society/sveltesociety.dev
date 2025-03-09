import { get_roles, delete_role } from '$lib/server/db/role'
import { fail } from '@sveltejs/kit'
import { db } from '$lib/server/db'

export const load = async ({ url }) => {
	const page = parseInt(url.searchParams.get('page') || '1', 10)
	const perPage = 10
	const offset = (page - 1) * perPage

	// Get paginated roles
	const stmt = db.prepare('SELECT * FROM roles LIMIT ? OFFSET ?')
	const roles = stmt.all(perPage, offset)

	// Get total count for pagination
	const countStmt = db.prepare('SELECT COUNT(*) as count FROM roles')
	const { count } = countStmt.get() as { count: number }

	return {
		roles,
		pagination: {
			count,
			perPage,
			currentPage: page
		}
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
