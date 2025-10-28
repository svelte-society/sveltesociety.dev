import { query, form, command } from '$app/server'
import { getRequestEvent } from '$app/server'
import { error, redirect } from '@sveltejs/kit'
import { z } from 'zod'

// Query for paginated users list
export const getUsers = query(
	z.object({
		page: z.number().min(1).default(1)
	}),
	async ({ page }) => {
		const { locals } = getRequestEvent()

		if (!locals.user || locals.user.role !== 1) {
			throw error(403, 'Forbidden')
		}

		const perPage = 10
		const offset = (page - 1) * perPage

		// SAME service calls as before - no changes to service layer
		const users = locals.userService.getUsers({ limit: perPage, offset })
		const totalUsers = locals.userService.getUserCount()

		// Get role names for each user
		const usersWithRoles = users.map((user) => {
			const role = locals.roleService.getRoleById(user.role)
			return {
				...user,
				role_name: role?.name || 'Unknown'
			}
		})

		return {
			users: usersWithRoles,
			pagination: {
				count: totalUsers,
				perPage,
				currentPage: page
			}
		}
	}
)

// Form for deleting a user
export const deleteUser = form(
	z.object({
		id: z.string()
	}),
	async (data, invalid) => {
		const { locals } = getRequestEvent()

		if (!locals.user || locals.user.role !== 1) {
			throw error(403, 'Forbidden')
		}

		if (!data.id) {
			invalid(invalid.id('No user id provided'))
		}

		// SAME service call as before
		const deleted_user = locals.userService.deleteUser(data.id)

		if (!deleted_user) {
			return { success: false, message: 'Something went wrong.' }
		}

		// Single-flight mutation: refresh ONLY the users query
		await getUsers({ page: 1 }).refresh()

		return { success: true, message: 'User deleted.' }
	}
)

// Command for clearing user sessions
export const clearSessions = command(z.string(), async (userId) => {
	const { locals } = getRequestEvent()

	if (!locals.user || locals.user.role !== 1) {
		throw error(403, 'Forbidden')
	}

	if (!userId) {
		throw error(400, 'No user id provided')
	}

	// SAME service call as before
	const deletedCount = locals.sessionService.deleteSessionsByUserId(userId)

	if (deletedCount === 0) {
		return { deletedCount: 0, message: 'No sessions found for this user.' }
	}

	// Redirect to the landing page after clearing sessions
	redirect(303, '/admin/users')
})
