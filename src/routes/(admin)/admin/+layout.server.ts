import type { LayoutServerLoad } from './$types'
import { get_moderation_queue_count_filtered } from '$lib/server/db/moderation'
import { ModerationStatus } from '$lib/server/db/moderation'

export const load: LayoutServerLoad = async () => {
	const moderation_count = get_moderation_queue_count_filtered({ status: ModerationStatus.PENDING })

	return {
		moderation_count
	}
}
