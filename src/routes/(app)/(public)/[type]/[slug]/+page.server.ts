import { error } from '@sveltejs/kit'

export const load = async ({ locals, params }) => {
	const start = performance.now()
	
	const content = locals.contentService.getFilteredContent({
		type: params.type,
		status: 'published'
	}).find(item => item.slug === params.slug)

	if (!content) {
		throw error(404, { message: 'Content not found' })
	}

	// If we have a logged-in user, get their likes and saves
	if (locals.user) {
		const { userLikes, userSaves } = locals.interactionsService.getUserLikesAndSaves(
			locals.user.id,
			[content.id]
		)
		content.liked = userLikes.has(content.id)
		content.saved = userSaves.has(content.id)
	}

	const stop = performance.now()
	console.log('Loading content took: ', stop - start)
	
	return { content }
}
