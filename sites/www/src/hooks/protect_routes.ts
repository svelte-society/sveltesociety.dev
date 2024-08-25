import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { get_roles } from '$lib/server/db/role';

interface RoutePermission {
	path: string;
	allowedRoles: string[];
}

const routePermissions: RoutePermission[] = [
	{ path: '/admin', allowedRoles: ['admin'] },
	{ path: '/account', allowedRoles: ['admin', 'user'] }
	// Add more routes and permissions as needed
];

export const protect_routes: Handle = async ({ event, resolve }) => {
	const { user } = event.locals;
	const roles = get_roles();
	const roleMap = new Map(roles.map((role) => [role.id, role]));

	const currentPath = event.url.pathname;
	const restrictedRoute = routePermissions.find((route) => currentPath.startsWith(route.path));

	if (restrictedRoute) {
		if (!user) {
			// User is not logged in, redirect to login page
			throw redirect(302, '/'); // Adjust the login route as needed
		}

		const userRole = roleMap.get(user.role);

		if (!userRole || !userRole.active) {
			// User's role is not valid or not active
			throw redirect(303, '/');
		}

		if (!restrictedRoute.allowedRoles.includes(userRole.value)) {
			// User doesn't have permission, redirect to homepage
			throw redirect(303, '/');
		}
	}

	// If we've reached this point, either the route is public or the user has permission
	return await resolve(event);
};
