import type { PageServerLoad } from './$types'
import { fail } from '@sveltejs/kit'
import { get_all_content, delete_content, get_content, get_content_count } from '$lib/server/db/content'

export const load: PageServerLoad = async ({ url }) => {
	const page = parseInt(url.searchParams.get('page') || '1', 10)
	const perPage = 10
	const offset = (page - 1) * perPage

	// Get paginated content
	const content = get_content({ limit: perPage, offset })

	if (!content) {
		fail(400, { message: 'Error getting content' })
	}

	// Get total count for pagination
	const count = get_content_count()

	return { 
		content,
		pagination: {
			count,
			perPage,
			currentPage: page
		}
	}
}

export const actions = {
	delete: async ({ request }) => {
		const formData = await request.formData()
		const id = formData.get('id') as string

		if (!id) {
			return
		}

		try {
			delete_content(parseInt(id))
			return { success: true }
		} catch (err) {
			return fail(500, { message: 'Failed to delete content' })
		}
	}
}
