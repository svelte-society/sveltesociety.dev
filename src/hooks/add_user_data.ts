import type { Handle } from '@sveltejs/kit'

export const add_user_data: Handle = async ({ event, resolve }) => {
	const { cookies } = event
	const { sessionService, userService } = event.locals

	const session_id = cookies.get('session_id')

	if (!session_id) {
		return await resolve(event)
	}

	const sessionResult = sessionService.validateSessionId(session_id)

	if (!sessionResult.valid || !sessionResult.user_id) {
		// Remove invalid session cookie
		cookies.delete('session_id', { path: '/' })
		return await resolve(event)
	}

	const user = userService.getUser(sessionResult.user_id)

	if (user) {
		event.locals.user = user
	}

	const response = await resolve(event)
	return response
}
