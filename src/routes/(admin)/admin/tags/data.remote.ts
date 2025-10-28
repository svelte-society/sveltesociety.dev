import { query, form } from '$app/server'
import { getRequestEvent } from '$app/server'
import { error, redirect } from '@sveltejs/kit'
import { z } from 'zod/v4'

// Query for paginated tags list
export const getTags = query(
	z.object({
		page: z.number().min(1).default(1)
	}),
	async ({ page }) => {
		const { locals } = getRequestEvent()

		// Authorization check
		if (!locals.user || locals.user.role !== 1) {
			throw error(403, 'Forbidden')
		}

		const perPage = 10
		const offset = (page - 1) * perPage

		// SAME service calls as before - no changes to service layer
		const tags = locals.tagService.getTags({ limit: perPage, offset }) || []
		const count = locals.tagService.getTagsCount()

		return {
			tags,
			pagination: {
				count,
				perPage,
				currentPage: page
			}
		}
	}
)

// Form for deleting a tag
export const deleteTag = form(
	z.object({ id: z.string() }),
	async (data, invalid) => {
		const { locals } = getRequestEvent()

		if (!locals.user || locals.user.role !== 1) {
			throw error(403, 'Forbidden')
		}

		if (!data.id) {
			invalid(invalid.id('No tag id provided'))
		}

		locals.tagService.deleteTag(data.id)

		// Single-flight mutation: refresh ONLY the tags query
		await getTags({ page: 1 }).refresh()

		redirect(303, '/admin/tags')
	}
)
