import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

/**
 * Parse datalist selection format "label (type)" into components.
 * Returns null if the format doesn't match.
 */
function parseDatalistSelection(q: string): { label: string; type: string } | null {
	const match = q.match(/^(.+)\s+\((category|tag|author)\)$/)
	if (match) {
		return { label: match[1], type: match[2] }
	}
	return null
}

/**
 * Handles URL normalization and backwards compatibility.
 *
 * 1. Converts legacy comma-separated tags format (?tags=a,b) to repeated params (?tags=a&tags=b)
 * 2. Handles no-JS fallback for OmniSearch form submissions
 * 3. Parses datalist selections in "label (type)" format
 */
export const load: PageServerLoad = ({ url }) => {
	// Check for legacy comma-separated tags format and convert to repeated params
	const tagsParam = url.searchParams.get('tags')
	if (tagsParam && tagsParam.includes(',')) {
		const params = new URLSearchParams()

		// Copy all params except tags
		url.searchParams.forEach((value, key) => {
			if (key !== 'tags') {
				params.append(key, value)
			}
		})

		// Split comma-separated tags into repeated params
		const tags = tagsParam.split(',').filter(Boolean)
		for (const tag of tags) {
			params.append('tags', tag.trim())
		}

		const queryString = params.toString()
		redirect(301, queryString ? `/?${queryString}` : '/')
	}

	// Handle no-JS fallback for OmniSearch
	const q = url.searchParams.get('q')
	const type = url.searchParams.get('type')

	if (q && type) {
		const params = new URLSearchParams(url.searchParams)

		// Remove the omni-search specific params
		params.delete('q')
		params.delete('type')

		// Check if q matches datalist format "label (type)"
		const datalistSelection = parseDatalistSelection(q)

		if (datalistSelection) {
			// User selected from datalist - apply the specific filter
			if (datalistSelection.type === 'category') {
				params.append('type', datalistSelection.label.toLowerCase())
			} else if (datalistSelection.type === 'tag') {
				params.append('tags', datalistSelection.label.toLowerCase())
			} else if (datalistSelection.type === 'author') {
				params.append('authors', datalistSelection.label)
			}
		} else {
			// Regular search - convert based on search type button clicked
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
		}

		const queryString = params.toString()
		redirect(303, queryString ? `/?${queryString}` : '/')
	}

	return
}
