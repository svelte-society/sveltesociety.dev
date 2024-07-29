import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { sessionService } from '$lib/server/db/services/session';
import { redirect } from '@sveltejs/kit';
import { routePermissions } from '$lib/server/route_permissions';

const USER_ROUTES = ['/account', '/auth/logout'];

const add_user_data: Handle = async ({ event, resolve }) => {
	const { cookies } = event;

	const session_id = cookies.get('session_id');

	if (!session_id) {
		const response = await resolve(event);
		return response;
	}

	const { data, success } = await sessionService.validate_session_id(session_id);

	if (!success) {
		redirect(302, '/');
	}

	if (data?.user) {
		event.locals.user = data.user;
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

export const handle = sequence(add_user_data, protect_routes);
