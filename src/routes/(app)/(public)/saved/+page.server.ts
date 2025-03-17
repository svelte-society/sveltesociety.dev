import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { ContentItem } from '$lib/types/content'

export const load = (async ({ locals, url }) => {
	if (!locals?.user?.id) redirect(302, '/')

	try {
		// Get pagination parameters
		const page = parseInt(url.searchParams.get('page') || '1')
		const limit = 20
		const offset = (page - 1) * limit

		// Get total count of saved content
		const countQuery = locals.db.prepare(`
			SELECT COUNT(1) as count 
			FROM saves s
			JOIN content c ON s.target_id = c.id
			WHERE s.user_id = ? AND c.status = 'published'
		`)
		const { count } = countQuery.get(locals.user.id) as { count: number }

		// If no saved content, return early with empty array
		if (count === 0) {
			return { content: [], count: 0 }
		}

		// Get paginated saved content IDs
		const savedContentQuery = locals.db.prepare(`
			SELECT s.target_id 
			FROM saves s
			JOIN content c ON s.target_id = c.id
			WHERE s.user_id = ? AND c.status = 'published'
			ORDER BY s.created_at DESC
			LIMIT ? OFFSET ?
		`)
		const savedContentIds = savedContentQuery.all(locals.user.id, limit, offset).map(row => (row as { target_id: string }).target_id)

		// Get content details for the paginated IDs
		const content = savedContentIds.map(id => locals.contentService.getContentById(id)).filter(Boolean) as ContentItem[]

		// Get user interactions
		const { userLikes, userSaves } = locals.interactionsService.getUserLikesAndSaves(
			locals.user.id,
			content.map(c => c.id.toString())
		)

		return {
			content: content.map(c => ({
				...c,
				liked: userLikes.has(c.id.toString()),
				saved: userSaves.has(c.id.toString())
			})),
			count
		}
	} catch (err) {
		console.error('Error fetching saved content:', err)
		throw error(500, 'An error occurred while fetching saved content')
	}
}) satisfies PageServerLoad
