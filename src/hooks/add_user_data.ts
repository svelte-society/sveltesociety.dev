import { validate_session_id } from '$lib/server/db/session'
import { get_user } from '$lib/server/db/user'
import type { Handle } from '@sveltejs/kit'

export const add_user_data: Handle = async ({ event, resolve }) => {
	const { cookies } = event

	const session_id = cookies.get('session_id')

	if (!session_id) {
		return await resolve(event)
	}

	const sessionResult = validate_session_id(session_id)

	if (!sessionResult.valid || !sessionResult.user_id) {
		// Remove invalid session cookie
		cookies.delete('session_id', { path: '/' })
		return await resolve(event)
	}

	const user = get_user(sessionResult.user_id)

	if (user) {
		event.locals.user = user
	}

	const response = await resolve(event)
	return response
}
