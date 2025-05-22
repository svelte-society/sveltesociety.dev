import { fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { schema } from './schema'
import { zod } from 'sveltekit-superforms/adapters'
import type { PageServerLoad } from './$types'
import type { Content } from '$lib/types/content'

const categories = [
	{
		label: 'All',
		value: ''
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
	},
	{
		label: 'Event',
		value: 'event'
	}
]

const sortOptions = [
	{
		label: 'Newest',
		value: 'created_at'
	},
	{
		label: 'Most Likes',
		value: 'likes'
	},
	{
		label: 'Most Saved',
		value: 'saves'
	},
]

export const load: PageServerLoad = async ({ url, locals, params }) => {
	const filters = await superValidate(url, zod(schema))

	let content = []

	const { data } = filters

	const searchResults = locals.searchService.search({...data, type: params.type})

	content = searchResults.hits.map((hit) => locals.contentService.getContentById(hit.id)) as Content[]

	const allTags = locals.tagService.getTags()

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

	// Format the type for display (e.g., "blog-posts" -> "Blog Posts")
	const typeForDisplay = params.type
		? params.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
		: 'Content'

	return {
		content: mappedContent,
		count: searchResults.count,
		tags: allTags,
		sort: sortOptions,
		categories,
		meta: {
			title: `${typeForDisplay} - Svelte Society`,
			description: `Browse ${typeForDisplay.toLowerCase()} from the Svelte Society community`,
			url: url.toString()
		}
	}
}

export const actions = {
	interact: async ({ request, locals }) => {
		if (!locals.user) return
		const data = await request.formData()
		const type = data.get('type') as 'like' | 'save'
		const contentId = data.get('id') as string

		try {
			const result = locals.interactionsService.toggleInteraction(type, locals.user.id, contentId)

			const currentContentData = locals.searchService.getContentById(contentId)!
			if (result.action === 'add') {
				locals.searchService.update(contentId, {
					...currentContentData,
					...{ [type + 's']: currentContentData[type + 's'] + 1 }
				})
			} else {
				locals.searchService.update(contentId, {
					...currentContentData,
					...{ [type + 's']: currentContentData[type + 's'] - 1 }
				})
			}
			return { success: true }
		} catch (error) {
			return fail(500, { message: 'Server error' })
		}
	}
}
