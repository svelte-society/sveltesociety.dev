import { error } from '@sveltejs/kit'

export const load = async ({ locals, params, url }) => {
	const start = performance.now()

	// Get content directly by slug and type
	const content = locals.contentService.getContentBySlug(params.slug, params.type)

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

	return {
		content,
		meta: {
			title: `${content.title} - Svelte Society`,
			description: content.description || `View ${content.title} on Svelte Society`,
			url: url.toString()
		}
	}
}
