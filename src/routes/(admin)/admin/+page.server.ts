import type { PageServerLoad } from './$types'
import { ModerationStatus } from '$lib/server/services/moderation'

export const load = (async ({ locals }) => {
	const users = locals.userService.getUserCount()
	const content = locals.contentService.getFilteredContentCount({ status: 'published' })
	const moderation_queue = locals.moderationService.getModerationQueueCount(ModerationStatus.PENDING)

	return {
		users,
		content,
		moderation_queue
	}
}) satisfies PageServerLoad
