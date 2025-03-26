import type { PageServerLoad } from './$types'

const ITEMS_PER_PAGE = 12

export const load: PageServerLoad = async ({ params, locals, url }) => {
	const start = performance.now()

	const page = Math.max(1, Number(url.searchParams.get('page')) || 1)
	const offset = (page - 1) * ITEMS_PER_PAGE

	const [content, total] = await Promise.all([
		locals.contentService.getContentByTag(params.slug, ITEMS_PER_PAGE, offset),
		locals.contentService.getFilteredContentCount({ tags: params.slug })
	])

	const totalPages = Math.ceil(total / ITEMS_PER_PAGE)

	const stop = performance.now()
	console.log('Loading tag content took: ', stop - start)

	return {
		content,
		total,
		pagination: {
			currentPage: page,
			totalPages,
			hasNextPage: page < totalPages,
			hasPreviousPage: page > 1
		}
	}
}
