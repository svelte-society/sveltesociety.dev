import { query } from '$app/server'
import { getRequestEvent } from '$app/server'

export const getTags = query(async () => {
	const { locals } = getRequestEvent()
	const tags = locals.tagService.getAllTags()
	return tags
})
