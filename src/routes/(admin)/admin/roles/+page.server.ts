import { fail } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'

export const load: PageServerLoad = async ({ url, locals }) => {
	const page = parseInt(url.searchParams.get('page') || '1', 10)
	const perPage = 10
	const offset = (page - 1) * perPage

	// Get roles using the role service
	const roles = locals.roleService.getRoles()
	
	// Calculate total count from roles array
	const count = roles.length

	return {
		roles,
		pagination: {
			count,
			perPage,
			currentPage: page
		}
	}
}

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		const data = await request.formData()
		const id = data.get('id') as unknown as number

		if (!id) {
			return fail(400, { message: 'No role id provided.' })
		}

		const deleted_role = locals.roleService.deleteRole(id)

		if (!deleted_role) {
			return { message: 'Something went wrong.' }
		}

		return { message: `Role deleted.` }
	}
}
