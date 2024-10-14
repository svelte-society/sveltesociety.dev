import { get_content_by_tag, get_tags_for_content } from '$lib/server/db/content'
import { get_user_likes_and_saves } from '$lib/server/db/interactions'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ params, locals }) => {
	const start = performance.now()
	const content = get_content_by_tag({ slug: params.slug }, locals.user?.id || '')

	const stop = performance.now()

	console.log('Loading tag content took: ', stop - start)
	return { content }
}
