import type { Handle } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'
import type { Role } from '$lib/server/services/role'

interface RoutePermission {
	path: string
	allowedRoles: string[]
}

const routePermissions: RoutePermission[] = [
	// Admin-only routes
	{ path: '/admin/users', allowedRoles: ['admin'] },
	{ path: '/admin/roles', allowedRoles: ['admin'] },
	{ path: '/admin/statistics', allowedRoles: ['admin'] },
	
	// Admin and Moderator routes
	{ path: '/admin/moderation', allowedRoles: ['admin', 'moderator'] },
	{ path: '/admin/tags', allowedRoles: ['admin', 'moderator'] },
	{ path: '/admin/external-content', allowedRoles: ['admin', 'moderator'] },
	{ path: '/admin/bulk-import', allowedRoles: ['admin', 'moderator'] },
	
	// Admin, Moderator, and Editor routes
	{ path: '/admin/content', allowedRoles: ['admin', 'moderator', 'editor'] },
	{ path: '/admin/collections', allowedRoles: ['admin', 'moderator', 'editor'] },
	{ path: '/admin/analytics', allowedRoles: ['admin', 'moderator', 'editor'] },
	
	// General admin access (catch-all for admin dashboard)
	{ path: '/admin', allowedRoles: ['admin', 'moderator', 'editor'] },
	
	// Account pages - all logged in users
	{ path: '/account', allowedRoles: ['admin', 'moderator', 'editor', 'user'] }
]

export const protect_routes: Handle = async ({ event, resolve }) => {
	const { user, roleService } = event.locals

	const currentPath = event.url.pathname
	
	// Sort routes by specificity (longer paths first) to match most specific route
	const sortedPermissions = [...routePermissions].sort((a, b) => b.path.length - a.path.length)
	const restrictedRoute = sortedPermissions.find((route) => currentPath.startsWith(route.path))

	if (restrictedRoute) {
		if (!user) {
			// User is not logged in, redirect to login page
			throw redirect(302, '/') // Adjust the login route as needed
		}

		// Get all roles to build the role map
		const roles = roleService.getRoles()
		const roleMap = new Map(roles.map((role: Role) => [role.id, role]))

		const userRole = roleMap.get(user.role)

		if (!userRole || !userRole.active) {
			// User's role is not valid or not active
			throw redirect(303, '/')
		}

		if (!restrictedRoute.allowedRoles.includes(userRole.value)) {
			// User doesn't have permission, redirect to homepage
			throw redirect(303, '/')
		}
	}

	return await resolve(event)
}
