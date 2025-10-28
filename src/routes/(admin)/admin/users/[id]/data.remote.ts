import { query, form } from '$app/server'
import { getRequestEvent } from '$app/server'
import { error, redirect } from '@sveltejs/kit'
import { z } from 'zod/v4'
import { schema } from './schema'
import { getUsers } from '../data.remote'

// Query for getting a single user with roles
export const getUser = query(z.object({ id: z.string() }), async ({ id }) => {
	const { locals } = getRequestEvent()

	if (!locals.user || locals.user.role !== 1) {
		throw error(403, 'Forbidden')
	}

	const userFromDb = locals.userService.getUser(id)

	if (!userFromDb) {
		throw error(404, 'User not found')
	}

	const roles = locals.roleService.getActiveRoles()

	// Convert null values to empty strings to match schema expectations
	const user = {
		...userFromDb,
		email: userFromDb.email || '',
		bio: userFromDb.bio || '',
		location: userFromDb.location || '',
		twitter: userFromDb.twitter || '',
		avatar_url: userFromDb.avatar_url || ''
	}

	return { user, roles }
})

// Form for updating a user
export const updateUser = form(schema, async (data, invalid) => {
	const { locals } = getRequestEvent()

	if (!locals.user || locals.user.role !== 1) {
		throw error(403, 'Forbidden')
	}

	if (!data.username) {
		invalid(invalid.username('Username is required'))
	}

	if (!data.email) {
		invalid(invalid.email('Email is required'))
	}

	const updated_user = await locals.userService.updateUser(data.id, data)

	// Single-flight mutation: refresh ONLY the users query
	await getUsers({ page: 1 }).refresh()

	redirect(303, '/admin/users')
})
