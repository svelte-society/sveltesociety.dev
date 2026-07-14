import { error } from '@sveltejs/kit'
import type { Role } from '$lib/server/services/role'

export type AdminRole = 'admin' | 'moderator' | 'editor'
export const ADMIN_ONLY = ['admin'] as const satisfies readonly AdminRole[]
export const ADMIN_AND_MODERATOR = ['admin', 'moderator'] as const satisfies readonly AdminRole[]
export const CONTENT_MANAGERS = [
	'admin',
	'moderator',
	'editor'
] as const satisfies readonly AdminRole[]

type AuthenticatedUser = { role: number }
type AuthorizationRole = Pick<Role, 'active' | 'value'>

export function assertRoles(
	user: AuthenticatedUser | null,
	role: AuthorizationRole | undefined,
	allowedRoles: readonly AdminRole[]
): void {
	if (!user) error(401, 'Authentication required')
	if (!role?.active || !allowedRoles.includes(role.value as AdminRole)) {
		error(403, 'Insufficient permissions')
	}
}
