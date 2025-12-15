import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals }) => {
	// Get user role
	const userRole = locals.user ? locals.roleService.getRoleById(locals.user.role) : null

	return {
		userRole: userRole?.value || null
	}
}
