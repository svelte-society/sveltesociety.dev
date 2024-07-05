type Role = 'admin' | 'user' | 'editor';

interface RoutePermission {
	path: string;
	allowedRoles: Role[];
}

export const routePermissions: RoutePermission[] = [
	{ path: '/admin', allowedRoles: ['admin'] }
	// Add more routes and permissions as needed
];
