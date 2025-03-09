import {
	get_content_by_ids,
	get_tags_for_content,
	get_user_saved_content
} from '$lib/server/db/content'
import { get_user_likes_and_saves } from '$lib/server/db/interactions'
import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async ({ locals }) => {
	if (!locals?.user?.id) redirect(302, '/')

	try {
		// Get saved content
		const content = get_user_saved_content({ user_id: locals.user.id, limit: 20, offset: 0 })
		
		// If no saved content, return early with empty array
		if (!content || content.length === 0) {
			return { content: [] }
		}

		// Get tags for content
		const tags = get_tags_for_content(content.map((c) => c.id))
		const content_with_tags = content.map((c, i) => ({ ...c, tags: tags[i] || [] }))
		
		// Parse children and create a unique set of child IDs
		const allChildrenArrays = content.map(c => JSON.parse(c.children ?? '[]') as number[])
		const allChildrenFlat = allChildrenArrays.flat()
		const uniqueChildIds = [...new Set(allChildrenFlat)]
		
		// Only fetch children if there are any
		const children = uniqueChildIds.length > 0 ? get_content_by_ids(uniqueChildIds) : []

		let content_with_tags_and_children = content_with_tags.map((c) => ({
			...c,
			children: JSON.parse(c.children ?? '[]')
				.map((id: number) => children.find((child) => child.id === id))
				.filter(Boolean) // Filter out any null/undefined children
		}))

		if (locals.user) {
			// Convert string ID to number
			const userId = parseInt(locals.user.id)
			const contentIds = content.map((c) => c.id)
			
			const { user_likes, user_saves } = get_user_likes_and_saves(
				userId,
				contentIds
			)

			content_with_tags_and_children = content_with_tags_and_children.map((c) => ({
				...c,
				liked: user_likes.has(c.id),
				saved: user_saves.has(c.id)
			}))
		}

		return {
			content: content_with_tags_and_children
		}
	} catch (err) {
		console.error('Error fetching saved content:', err)
		throw error(500, 'An error occurred while fetching saved content')
	}
}) satisfies PageServerLoad
