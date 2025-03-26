import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, locals }) => {
	// Get the current page from the URL params, default to 1
	const page = parseInt(url.searchParams.get('page') || '1', 10)
	const perPage = 10 // Items per page

	// Get collections with pagination
	const collections = locals.collectionService.getCollections(page, perPage)
	const totalCollections = locals.collectionService.getCollectionsCount()
	const totalPages = Math.ceil(totalCollections / perPage)

	return {
		collections,
		totalCollections,
		perPage,
		page,
		totalPages
	}
}
