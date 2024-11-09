import { get_content_by_tag } from '$lib/server/db/content'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ params, locals }) => {
	const start = performance.now()
	const content = get_content_by_tag({ slug: params.slug }, locals.user?.id || '')

	const stop = performance.now()

	console.log('Loading tag content took: ', stop - start)
	return { content }
}
