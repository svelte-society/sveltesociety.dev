import { error } from '@sveltejs/kit'

export const load = async ({ locals, params, url }) => {
	const start = performance.now()

	const content = locals.contentService.getContentBySlug(params.slug)

	if (!content) {
		throw error(404, { message: 'Content not found' })
	}

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
