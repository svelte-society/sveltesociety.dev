import type { PageServerLoad } from './$types'

export const load = (async ({ locals }) => {
	const users = locals.userService.getUserCount()
	const published = locals.contentService.getFilteredContentCount({ status: 'published' })
	const pending_review = locals.contentService.getFilteredContentCount({
		status: 'pending_review'
	})

	// Fetch subscriber count from Plunk (may fail if API is down)
	let subscribers = 0
	try {
		subscribers = await locals.emailService.getContactCount()
	} catch (error) {
		console.error('Failed to fetch subscriber count:', error)
	}

	return {
		users,
		published,
		pending_review,
		subscribers
	}
}) satisfies PageServerLoad
