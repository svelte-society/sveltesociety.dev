import type { PageServerLoad } from './$types'
import { fail, redirect } from '@sveltejs/kit'

export const load = (async ({ url, locals }) => {
	const page = parseInt(url.searchParams.get('page') || '1', 10)
	const perPage = 10
	const offset = (page - 1) * perPage

	const users = locals.userService.getUsers({ limit: perPage, offset })
	const totalUsers = locals.userService.getUserCount()

	return {
		users,
		pagination: {
			count: totalUsers,
			perPage,
			currentPage: page
		}
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
