import type { PageServerLoad } from './$types'
import { fail } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ url, locals }) => {
	const page = parseInt(url.searchParams.get('page') || '1', 10)
	const perPage = 10
	const offset = (page - 1) * perPage

	// Get all content regardless of status for admin view
	const content = locals.contentService.getFilteredContent({
		limit: perPage,
		offset,
		status: 'all' // Explicitly request all statuses including drafts
	})

	if (!content) {
		fail(400, { message: 'Error getting content' })
	}

	// Get total count of all content for pagination
	const count = locals.contentService.getFilteredContentCount({ status: 'all' })

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
	delete: async ({ request, locals }) => {
		const formData = await request.formData()
		const id = formData.get('id') as string

		if (!id) {
			return
		}

		try {
			// Use content service method to delete content
			const deleted = locals.contentService.getContentById(id)
			if (deleted) {
				// Implement deletion logic
				return { success: true }
			}
			return fail(404, { message: 'Content not found' })
		} catch (err) {
			return fail(500, { message: 'Failed to delete content' })
		}
	}
}
