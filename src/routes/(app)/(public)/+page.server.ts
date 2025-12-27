import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

/**
 * Handles the no-JS fallback for OmniSearch.
 * When the form is submitted without JavaScript, it sends `q` (query) and `type` params.
 * This converts them to the proper filter format and redirects.
 */
export const load: PageServerLoad = ({ url }) => {
	const q = url.searchParams.get('q')
	const type = url.searchParams.get('type')

	if (q && type) {
		const params = new URLSearchParams(url.searchParams)

		// Remove the omni-search specific params
		params.delete('q')
		params.delete('type')

		// Convert based on search type
		if (type === 'all') {
			// Full-text search
			params.set('query', q)
		} else if (type === 'tags') {
			// Search in tags - append to existing tags
			params.append('tags', q)
		} else if (type === 'category') {
			// Search in categories - append to type filter
			params.append('type', q)
		} else if (type === 'author') {
			// Search in authors - append to authors filter
			params.append('authors', q)
		}

		const queryString = params.toString()
		redirect(303, queryString ? `/?${queryString}` : '/')
	}

	return
}
