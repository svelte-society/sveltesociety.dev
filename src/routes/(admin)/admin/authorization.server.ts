import { getRequestEvent } from '$app/server'
import {
	ADMIN_AND_MODERATOR,
	ADMIN_ONLY,
	CONTENT_MANAGERS,
	assertRoles,
	type AdminRole
} from './authorization'

export { ADMIN_AND_MODERATOR, ADMIN_ONLY, CONTENT_MANAGERS }

export function requireRoles(allowedRoles: readonly AdminRole[]): void {
	const { locals } = getRequestEvent()
	const role = locals.user ? locals.roleService.getRoleById(locals.user.role) : undefined
	assertRoles(locals.user, role, allowedRoles)
}
