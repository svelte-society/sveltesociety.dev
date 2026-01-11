import { form, getRequestEvent, query } from '$app/server'
import { error, redirect } from '@sveltejs/kit'
import {
	getUsersSchema,
	updateUserSchema,
	updateUserRoleSchema,
	deleteUserSchema,
	clearSessionsSchema
} from '$lib/schema/users'
import { checkAdminAuth } from '../authorization.remote'
import { z } from 'zod/v4'

export const getUsers = query(getUsersSchema, ({ page, perPage }) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	const offset = (page - 1) * perPage

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
})

export const getUserById = query(z.string(), (id: string) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	const user = locals.userService.getUser(id)
	if (!user) error(404, 'User not found')
	return user
})

export const getRoleOptions = query(() => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	const roles = locals.roleService.getActiveRoles()
	if (!roles) error(404, 'Roles not found')
	const roleOptions = roles.map((role) => ({
		value: role.id,
		label: role.name
	}))
	return roleOptions
})

export const updateUser = form(updateUserSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	locals.userService.updateUser(data.id, data)
	redirect(303, '/admin/users')
})

export const updateUserRole = form(updateUserRoleSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	locals.userService.updateUser(data.id, { role: data.role })
	return { success: true, text: 'Role updated successfully!' }
})

export const deleteUser = form(deleteUserSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	const deleted = locals.userService.deleteUser(data.id)

	if (!deleted) {
		return { success: false, text: 'Failed to delete user.' }
	}

	return { success: true, text: 'User deleted successfully!' }
})

export const clearUserSessions = form(clearSessionsSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	const deletedCount = locals.sessionService.deleteSessionsByUserId(data.id)

	if (deletedCount === 0) {
		return { success: false, text: 'No sessions found for this user.' }
	}

	return { success: true, text: `Cleared ${deletedCount} session(s) for this user.` }
})
