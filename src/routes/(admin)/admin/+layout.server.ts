import type { LayoutServerLoad } from './$types'
import { ModerationStatus } from '$lib/server/services/moderation'

export const load: LayoutServerLoad = async ({ locals }) => {
	const moderation_count = locals.moderationService.getModerationQueueCount(
		ModerationStatus.PENDING
	)

	// Get user role
	const userRole = locals.user ? locals.roleService.getRoleById(locals.user.role) : null

	return {
		moderation_count,
		userRole: userRole?.value || null
	}
}
