import type { PageServerLoad } from './$types'

export const load = (async ({ locals }) => {
	const users = locals.userService.getUserCount()
	const published = locals.contentService.getFilteredContentCount({ status: 'published' })
	const pending_review = locals.contentService.getFilteredContentCount({
		status: 'pending_review'
	})

	return {
		users,
		published,
		pending_review
	}
}) satisfies PageServerLoad
