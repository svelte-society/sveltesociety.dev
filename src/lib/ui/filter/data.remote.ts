import { getRequestEvent, query } from '$app/server'
import type { Item } from './FilterSubmenu.svelte'

// Static content types
const contentTypes: Item[] = [
	{ label: 'Recipe', value: 'recipe' },
	{ label: 'Video', value: 'video' },
	{ label: 'Library', value: 'library' },
	{ label: 'Resource', value: 'resource' },
	{ label: 'Announcement', value: 'announcement' },
	{ label: 'Collection', value: 'collection' }
]

export const getCategories = query(() => {
	return contentTypes
})

export const getTags = query(() => {
	const { locals } = getRequestEvent()
	const tags = locals.tagService.getAllTags()
	return tags.map((tag) => ({
		label: tag.name,
		value: tag.slug
	}))
})

export const getAuthors = query(() => {
	const { locals } = getRequestEvent()
	const authors = locals.userService.getAuthorsWithContent()
	return authors.map((author) => ({
		label: author.name || author.username,
		value: author.username
	}))
})
