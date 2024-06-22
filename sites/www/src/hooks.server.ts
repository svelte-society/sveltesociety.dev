import type { Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks';
import { get_user_by_session_id } from '$lib/server/db/user';
import { validate_session_id } from '$lib/server/db/session';
import { redirect } from '@sveltejs/kit';

const USER_ROUTES = ['/account', '/auth/logout']

const add_user_data: Handle = async ({ event, resolve }) => {
	const { cookies } = event;

	const session_id = cookies.get('session_id')

	if (!session_id) {
		const response = await resolve(event);
		return response;
	}

	if (await validate_session_id(session_id)) {
		const user = await get_user_by_session_id(session_id)
		event.locals.user = user
	}

	const response = await resolve(event);
	return response;
}

const protect_routes: Handle = async ({ event, resolve }) => {
	const { user } = event.locals;

	if (USER_ROUTES.includes(event.url.pathname)) {
		if (!user) {
			redirect(302, '/');
		}
	}


	const response = await resolve(event);
	return response;
}

export const handle = sequence(add_user_data, protect_routes)