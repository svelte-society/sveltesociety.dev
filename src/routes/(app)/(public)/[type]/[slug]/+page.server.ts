import { get_content_by_slug, get_tags_for_content } from '$lib/server/db/content'
import { get_user_likes_and_saves } from '$lib/server/db/interactions'
import { fail } from '@sveltejs/kit'

export const load = async ({ locals, params }) => {
	const start = performance.now()
	const content = get_content_by_slug(params.slug, locals.user?.id || '')

	if (!content) {
		fail(400, { message: 'Error getting content' })
	}

	const stop = performance.now()
	console.log('Loading content took: ', stop - start)
	return { content }
}
