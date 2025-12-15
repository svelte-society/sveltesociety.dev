import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals }) => {
	// Count content with pending_review status
	const moderation_count = locals.contentService.getFilteredContentCount({
		status: 'pending_review'
	})

	// Get user role
	const userRole = locals.user ? locals.roleService.getRoleById(locals.user.role) : null

	return {
		moderation_count,
		userRole: userRole?.value || null
	}
}
