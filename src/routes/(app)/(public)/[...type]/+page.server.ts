import { fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { schema } from './schema'
import { zod } from 'sveltekit-superforms/adapters'
import type { PageServerLoad } from './$types'
import type { Content } from '$lib/types/content'

const categories = [
	{
		label: 'All',
		value: 'all'
	},
	{
		label: 'Recipe',
		value: 'recipe'
	},
	{
		label: 'Video',
		value: 'video'
	},
	{
		label: 'Library',
		value: 'library'
	},
	{
		label: 'Announcement',
		value: 'announcement'
	},
	{
		label: 'Showcase',
		value: 'showcase'
	},
	{
		label: 'Collection',
		value: 'collection'
	}
]

const sortOptions = [
	{
		label: 'Newest',
		value: 'newest'
	},
	{
		label: 'Oldest',
		value: 'oldest'
	},
	{
		label: 'Most Likes',
		value: 'most_likes'
	},
	{
		label: 'Most Saved',
		value: 'most_saved'
	},
	{
		label: 'Most Popular',
		value: 'most_popular'
	}
]

export const load: PageServerLoad = async ({ url, locals, params }) => {
	const filters = await superValidate(url, zod(schema))

	let content = []

	const { data } = filters

	const searchResults = locals.searchService.search({...data, type: params.type})

	content = searchResults.hits.map((hit) => locals.contentService.getContentById(hit.id)) as Content[]

	const allTags = locals.tagService.getTags().map((t) => ({ label: t.name, value: t.slug }))

	let mappedContent = content
	if (locals.user?.id) {
		const contentIds = content.map((piece) => piece.id)
		const { userLikes, userSaves } = locals.interactionsService.getUserLikesAndSaves(
			locals.user.id,
			contentIds
		)

		mappedContent = content.map((piece) => ({
			...piece,
			liked: userLikes.has(piece.id),
			saved: userSaves.has(piece.id)
		}))
	}

	return {
		content: mappedContent,
		count: searchResults.count,
		tags: allTags,
		sort: sortOptions,
		categories
	}
}

export const actions = {
	interact: async ({ request, locals }) => {
		if (!locals.user) return
		const data = await request.formData()
		const type = data.get('type') as 'like' | 'save'
		const contentId = (data.get('id') as string) || null
		const action = data.get('action') as 'add' | 'remove'

		if (!['like', 'save'].includes(type) || !['add', 'remove'].includes(action) || !contentId) {
			return fail(400, { message: 'Invalid input' })
		}

		try {
			if (action === 'add') {
				locals.interactionsService.addInteraction(type, locals.user.id, contentId)
			} else {
				locals.interactionsService.removeInteraction(type, locals.user.id, contentId)
			}
			return { success: true }
		} catch (error) {
			return fail(500, { message: 'Server error' })
		}
	}
}
