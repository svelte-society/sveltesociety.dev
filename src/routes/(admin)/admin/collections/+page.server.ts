import type { PageServerLoad } from './$types'
import { get_collections, get_collections_count } from '$lib/server/db/collections'

export const load: PageServerLoad = async ({ url }) => {
	// Get the current page from the URL params, default to 1
	const page = parseInt(url.searchParams.get('page') || '1', 10)
	const perPage = 10 // Items per page

	// Get collections with pagination
	const collections = get_collections(page, perPage)
	const totalCollections = get_collections_count()
	const totalPages = Math.ceil(totalCollections / perPage)

	return {
		collections,
		totalCollections,
		perPage,
		page,
		totalPages
	}
}
