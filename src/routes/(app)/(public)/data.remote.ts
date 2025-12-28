import { getRequestEvent, query } from '$app/server'
import { z } from 'zod/v4'
import { parseSearchParams } from 'zod-search-params/v4'
import { schema } from './schema'
import {
	buildHomepageMeta,
	buildCategoryMeta,
	generateOrganizationSchema,
	generateWebSiteSchema
} from '$lib/seo'

// Input schemas for query functions
const homeDataInputSchema = z.object({
	url: z.instanceof(URL)
})

const categoryDataInputSchema = z.object({
	url: z.instanceof(URL),
	type: z.string()
})

export const getTags = query(() => {
	const { locals } = getRequestEvent()
	return locals.tagService.getAllTags()
})

/**
 * Expand partial author names to all matching full author names.
 * This enables partial matching for no-JS users who type "Rich" to match
 * "Rich Harris", "Rich Stevenson", etc.
 */
function expandAuthorNames(partialNames: string[], allAuthors: { name: string | null; username: string }[]): string[] {
	const expandedNames = new Set<string>()

	for (const partial of partialNames) {
		const lowerPartial = partial.toLowerCase()

		for (const author of allAuthors) {
			const authorName = author.name || author.username
			const lowerAuthorName = authorName.toLowerCase()

			// Match if the author name contains the partial search term
			if (lowerAuthorName.includes(lowerPartial)) {
				expandedNames.add(authorName)
			}
		}

		// If no matches found, keep the original (might be a valid full name not in our list)
		if (expandedNames.size === 0) {
			expandedNames.add(partial)
		}
	}

	return Array.from(expandedNames)
}

// Homepage: uses type from query params for multi-type filtering
export const getHomeData = query(homeDataInputSchema, async ({ url }) => {
	const { locals } = getRequestEvent()

	// Parse with zod-search-params - handles type coercion automatically
	const data = parseSearchParams(schema, url.searchParams)

	const perPage = 30
	const offset = (data.page - 1) * perPage

	// Expand partial author names to all matching full names
	const allAuthors = locals.userService.getAuthorsWithContent()
	const expandedAuthors = data.authors.length > 0
		? expandAuthorNames(data.authors, allAuthors)
		: undefined

	const searchResults = locals.searchService.search({
		query: data.query || undefined,
		tags: data.tags.length > 0 ? data.tags : undefined,
		type: data.type.length === 1 ? data.type[0] : undefined, // Single type
		types: data.type.length > 1 ? data.type : undefined, // Multiple types
		authors: expandedAuthors,
		sort: data.sort || undefined,
		order: data.order || undefined,
		status: 'published',
		limit: perPage,
		offset
	})

	let content = searchResults.hits
		.map((hit) => locals.contentService.getContentById(hit.id))
		.filter((piece) => piece !== null)

	if (locals.user?.id) {
		const contentIds = content.map((piece) => piece.id)
		const { userLikes, userSaves } = locals.interactionsService.getUserLikesAndSaves(
			locals.user.id,
			contentIds
		)

		content = content.map((piece) => ({
			...piece,
			liked: userLikes.has(piece.id),
			saved: userSaves.has(piece.id)
		}))
	}

	return {
		content,
		count: searchResults.count,
		meta: buildHomepageMeta(),
		schemas: [generateOrganizationSchema(), generateWebSiteSchema()]
	}
})

// Category page: uses type from path param
export const getCategoryData = query(categoryDataInputSchema, async ({ url, type }) => {
	const { locals } = getRequestEvent()

	// Parse with zod-search-params
	const data = parseSearchParams(schema, url.searchParams)

	const perPage = 30
	const offset = (data.page - 1) * perPage

	// Expand partial author names to all matching full names
	const allAuthors = locals.userService.getAuthorsWithContent()
	const expandedAuthors = data.authors.length > 0
		? expandAuthorNames(data.authors, allAuthors)
		: undefined

	const searchResults = locals.searchService.search({
		query: data.query || undefined,
		tags: data.tags.length > 0 ? data.tags : undefined,
		type, // From path param
		authors: expandedAuthors,
		sort: data.sort || undefined,
		order: data.order || undefined,
		status: 'published',
		limit: perPage,
		offset
	})

	let content = searchResults.hits
		.map((hit) => locals.contentService.getContentById(hit.id))
		.filter((piece) => piece !== null)

	if (locals.user?.id) {
		const contentIds = content.map((piece) => piece.id)
		const { userLikes, userSaves } = locals.interactionsService.getUserLikesAndSaves(
			locals.user.id,
			contentIds
		)

		content = content.map((piece) => ({
			...piece,
			liked: userLikes.has(piece.id),
			saved: userSaves.has(piece.id)
		}))
	}

	return {
		content,
		count: searchResults.count,
		meta: buildCategoryMeta(type, url.toString()),
		schemas: undefined
	}
})
