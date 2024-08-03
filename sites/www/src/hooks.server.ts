import type { Handle } from '@sveltejs/kit';
import { get_user } from '$lib/server/db/user';
import { validate_session_id } from '$lib/server/db/session';
import { sequence } from '@sveltejs/kit/hooks';
import { redirect } from '@sveltejs/kit';

const USER_ROUTES = ['/account', '/auth/logout'];

const add_user_data: Handle = async ({ event, resolve }) => {
	const { cookies } = event;

	const session_id = cookies.get('session_id');

	if (!session_id) {
		return await resolve(event);
	}

	const { user_id } = validate_session_id(session_id);

	if (user_id === undefined) {
		redirect(302, '/');
	}

	const user = get_user(user_id)

	if (user) {
		event.locals.user = user;
	}

	const response = await resolve(event);
	return response;
};

const protect_routes: Handle = async ({ event, resolve }) => {
	const { user } = event.locals;

	if (USER_ROUTES.includes(event.url.pathname)) {
		if (!user) {
			throw redirect(302, '/');
		}
	}

	// Add logic to protect routes.
	// if (user) {
	// 	for (const route of routePermissions) {
	// 		if (event.url.pathname.startsWith(route.path)) {
	// 			if (!user.role || !route.allowedRoles.includes(user.role.name)) {
	// 				// User doesn't have permission, redirect to homepage
	// 				throw redirect(303, '/');
	// 			}
	// 			break; // Exit the loop if we've found a matching route
	// 		}
	// 	}
	// }

	const response = await resolve(event);
	return response;
};

export const handle = sequence(add_user_data);