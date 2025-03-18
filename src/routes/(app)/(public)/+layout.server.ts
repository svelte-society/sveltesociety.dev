import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals }) => {
	const tags = locals.tagService.getTags({ limit: 100 }) // Get up to 100 tags for the sidebar
	
	// Get current user from locals if available
	const user = locals.user
	
	// Check if user is an admin (role === 1 based on schema.sql)
	const isAdmin = user?.role === 1
	
	return {
		tags,
		user,
		isAdmin
	}
}
