import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { Content } from '$lib/types/content'

export const load = (async ({ locals, url }) => {
	if (!locals?.user?.id) redirect(302, '/')

	try {
		// Get pagination parameters
		const page = parseInt(url.searchParams.get('page') || '1')
		const limit = 20

		// Get saved content using ContentService
		const { content, count } = locals.contentService.getSavedContent(locals.user.id, page, limit)

		// If no saved content, return early with empty array
		if (count === 0) {
			return { content: [], count: 0 }
		}

		// Get user interactions
		const { userLikes, userSaves } = locals.interactionsService.getUserLikesAndSaves(
			locals.user.id,
			content.map((c) => c.id.toString())
		)

		return {
			content: content.map((c) => ({
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
