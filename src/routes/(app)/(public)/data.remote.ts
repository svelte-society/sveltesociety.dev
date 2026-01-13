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
import type { ContentWithAuthor } from '$lib/types/content'

// Re-export shared getTags (returns raw tag objects)
export { getTagsRaw as getTags } from '$lib/remote/tags.remote'

// Input schemas for query functions
const homeDataInputSchema = z.object({
	url: z.instanceof(URL)
})

const categoryDataInputSchema = z.object({
	url: z.instanceof(URL),
	type: z.string()
})

// ============================================================================
// Feed Types - Serializable data structures for the unified feed
// ============================================================================

/** CTA/Ad props */
export type CTAProps = {
	title: string
	description: string
	buttonText: string
	buttonHref: string
}

/** ContentCard props */
export type ContentProps = {
	content: ContentWithAuthor
}

/** A single entry in the unified feed - all use `props` for component spreading */
export type FeedEntry =
	| { type: 'content'; props: ContentProps }
	| { type: 'cta'; props: CTAProps }
	| { type: 'ad'; props: CTAProps }
	| { type: 'featured'; props: ContentProps }

// ============================================================================
// Feed Building Utilities (Server-side only)
// ============================================================================

/** Seeded random for SSR-consistent positioning */
function seededRandom(seed: number): () => number {
	let state = seed
	return () => {
		state = (state * 1103515245 + 12345) & 0x7fffffff
		return state / 0x7fffffff
	}
}

/** Default CTA when no feed items exist */
const DEFAULT_CTA: FeedEntry = {
	type: 'cta',
	props: {
		title: 'Hiring Svelte Developers?',
		description: 'Reach thousands of Svelte developers looking for their next opportunity.',
		buttonText: 'Post a Job Starting at $199',
		buttonHref: '/jobs/submit'
	}
}

type InsertableItem = {
	id: string
	type: 'cta' | 'ad' | 'featured'
	positionType: 'fixed' | 'random'
	positionFixed: number | null
	positionRangeMin: number
	positionRangeMax: number
	priority: number
	entry: FeedEntry
}

/** Build unified feed from content and insertable items */
function buildUnifiedFeed(
	content: ContentWithAuthor[],
	insertables: InsertableItem[],
	seed: number
): FeedEntry[] {
	// Start with content items
	const feed: FeedEntry[] = content.map((c) => ({
		type: 'content' as const,
		props: { content: c }
	}))

	if (insertables.length === 0) {
		// Add default CTA if no insertables and we have enough content
		if (feed.length >= 3) {
			const random = seededRandom(seed)
			const position = 3 + Math.floor(random() * 5) // Position 3-7
			feed.splice(Math.min(position, feed.length), 0, DEFAULT_CTA)
		}
		return feed
	}

	const random = seededRandom(seed)

	// Sort by priority (higher first) then calculate positions
	const sortedInsertables = [...insertables].sort((a, b) => b.priority - a.priority)

	const insertions: { id: string; position: number; entry: FeedEntry }[] = []

	for (const item of sortedInsertables) {
		let position: number
		if (item.positionType === 'fixed' && item.positionFixed !== null) {
			position = item.positionFixed
		} else {
			const min = item.positionRangeMin
			const max = item.positionRangeMax
			position = min + Math.floor(random() * (max - min + 1))
		}

		// Clamp to valid range
		position = Math.max(0, Math.min(position, feed.length))
		insertions.push({ id: item.id, position, entry: item.entry })
	}

	// Sort by position descending (insert from end to avoid index shifts)
	// Use id as secondary sort key for deterministic ordering when positions match
	insertions.sort((a, b) => b.position - a.position || a.id.localeCompare(b.id))
	for (const { position, entry } of insertions) {
		feed.splice(position, 0, entry)
	}

	return feed
}

/**
 * Expand partial author names to all matching full author names.
 * This enables partial matching for no-JS users who type "Rich" to match
 * "Rich Harris", "Rich Stevenson", etc.
 */
function expandAuthorNames(
	partialNames: string[],
	allAuthors: { name: string | null; username: string }[]
): string[] {
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
	const pageNum = data.page

	// Expand partial author names to all matching full names
	const allAuthors = locals.userService.getAuthorsWithContent()
	const expandedAuthors =
		data.authors.length > 0 ? expandAuthorNames(data.authors, allAuthors) : undefined

	const searchResults = locals.searchService.search({
		query: data.query || undefined,
		tags: data.tags.length > 0 ? data.tags : undefined,
		types: data.type.length > 0 ? data.type : undefined,
		authors: expandedAuthors,
		sort: data.sort || undefined,
		order: data.order || undefined,
		status: 'published',
		limit: perPage,
		offset,
		// Job-specific filters (Orama will only return jobs when these are set)
		position: data.position.length > 0 ? data.position : undefined,
		level: data.level.length > 0 ? data.level : undefined,
		remote: data.remote.length > 0 ? data.remote : undefined
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

	// Build the unified feed with insertable items
	const feedItems = locals.feedItemService.getActiveFeedItems()

	// Collect content IDs that will be featured (to dedupe from regular feed)
	const featuredContentIds = new Set<string>()

	const insertables: InsertableItem[] = feedItems
		.map((item): InsertableItem | null => {
			// For featured items, fetch full content
			if (item.item_type === 'featured') {
				if (!item.content_id) return null
				const fullContent = locals.contentService.getContentById(item.content_id)
				if (!fullContent) return null
				featuredContentIds.add(item.content_id)
				return {
					id: item.id,
					type: 'featured',
					positionType: item.position_type,
					positionFixed: item.position_fixed,
					positionRangeMin: item.position_range_min ?? 3,
					positionRangeMax: item.position_range_max ?? 7,
					priority: item.priority,
					entry: { type: 'featured', props: { content: fullContent } }
				}
			}

			// For CTA/ad items, build props
			const ctaProps: CTAProps = {
				title: item.title || item.content_title || 'Check this out',
				description: item.description || item.content_description || '',
				buttonText: item.button_text || 'Learn More',
				buttonHref:
					item.button_href ||
					(item.content_slug ? `/${item.content_type}/${item.content_slug}` : '/')
			}

			return {
				id: item.id,
				type: item.item_type as 'cta' | 'ad',
				positionType: item.position_type,
				positionFixed: item.position_fixed,
				positionRangeMin: item.position_range_min ?? 3,
				positionRangeMax: item.position_range_max ?? 7,
				priority: item.priority,
				entry: { type: item.item_type as 'cta' | 'ad', props: ctaProps }
			}
		})
		.filter((item): item is InsertableItem => item !== null)

	// Remove featured content from regular feed to avoid duplicates
	const dedupedContent = content.filter((c) => !featuredContentIds.has(c.id))

	const feed = buildUnifiedFeed(dedupedContent, insertables, pageNum)

	return {
		feed,
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
	const expandedAuthors =
		data.authors.length > 0 ? expandAuthorNames(data.authors, allAuthors) : undefined

	// Job-specific filters only apply on job category page
	const isJobPage = type === 'job'

	const searchResults = locals.searchService.search({
		query: data.query || undefined,
		tags: data.tags.length > 0 ? data.tags : undefined,
		types: [type], // From path param
		authors: expandedAuthors,
		sort: data.sort || undefined,
		order: data.order || undefined,
		status: 'published',
		limit: perPage,
		offset,
		// Job-specific filters (handled by Orama, only on job page)
		position: isJobPage && data.position.length > 0 ? data.position : undefined,
		level: isJobPage && data.level.length > 0 ? data.level : undefined,
		remote: isJobPage && data.remote.length > 0 ? data.remote : undefined
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
