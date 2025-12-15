import type { PageServerLoad } from './$types'

export const load = (async ({ locals }) => {
	const users = locals.userService.getUserCount()
	const content = locals.contentService.getFilteredContentCount({ status: 'published' })
	const moderation_queue = locals.contentService.getFilteredContentCount({
		status: 'pending_review'
	})

	return {
		users,
		content,
		moderation_queue
	}
}) satisfies PageServerLoad
