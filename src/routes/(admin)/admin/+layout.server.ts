import type { LayoutServerLoad } from './$types'
import { ModerationStatus } from '$lib/server/db/moderation'

export const load: LayoutServerLoad = async ({ locals }) => {
	const moderation_count = locals.moderationService.getModerationQueueCount(ModerationStatus.PENDING)

	return {
		moderation_count
	}
}
