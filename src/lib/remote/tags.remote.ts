import { getRequestEvent, query } from '$app/server'

/**
 * Shared tag query functions to avoid duplication across routes.
 * Import the variant you need based on your use case.
 */

/** Raw tags - returns full tag objects */
export const getTagsRaw = query(() => {
	const { locals } = getRequestEvent()
	return locals.tagService.getAllTags()
})

/** Tags for form selects - value is tag ID (for database storage) */
export const getTagsAsIdOptions = query(() => {
	const { locals } = getRequestEvent()
	return locals.tagService.getTags({ limit: 100 }).map((tag) => ({
		label: tag.name,
		value: tag.id
	}))
})

/** Tags for filter UI - value is tag slug (for URL parameters) */
export const getTagsAsSlugOptions = query(() => {
	const { locals } = getRequestEvent()
	return locals.tagService.getAllTags().map((tag) => ({
		label: tag.name,
		value: tag.slug
	}))
})
