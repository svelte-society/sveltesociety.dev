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

// Homepage: uses type from query params for multi-type filtering
export const getHomeData = query(homeDataInputSchema, async ({ url }) => {
	const { locals } = getRequestEvent()

	// Parse with zod-search-params - handles type coercion automatically
	const data = parseSearchParams(schema, url.searchParams)

	const perPage = 30
	const offset = (data.page - 1) * perPage

	const searchResults = locals.searchService.search({
		query: data.query || undefined,
		tags: data.tags.length > 0 ? data.tags : undefined,
		type: data.type.length === 1 ? data.type[0] : undefined, // Single type
		types: data.type.length > 1 ? data.type : undefined, // Multiple types
		authors: data.authors.length > 0 ? data.authors : undefined,
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

	const searchResults = locals.searchService.search({
		query: data.query || undefined,
		tags: data.tags.length > 0 ? data.tags : undefined,
		type, // From path param
		authors: data.authors.length > 0 ? data.authors : undefined,
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
