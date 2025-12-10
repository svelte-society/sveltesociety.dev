import { getRequestEvent, query } from '$app/server'
import { redirect } from '@sveltejs/kit'

export const checkAdminAuth = query(() => {
	const { locals } = getRequestEvent()
	if (!locals.user) {
		redirect(303, '/login')
	}
	const userRole = locals.roleService.getRoleById(locals.user.role)
	const isAuthorized =
		userRole && userRole.active && (userRole.value === 'admin' || userRole.value === 'moderator')
	if (!isAuthorized) {
		redirect(303, '/')
	}
})
