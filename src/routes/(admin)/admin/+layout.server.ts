import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals }) => {
	// Get user role
	const userRole = locals.user ? locals.roleService.getRoleById(locals.user.role) : null

	// Get pending review count for content badge
	const pendingReviewCount = locals.contentService.getFilteredContentCount({
		status: 'pending_review'
	})

	return {
		userRole: userRole?.value || null,
		pendingReviewCount
	}
}
