import { query, form } from '$app/server'
import { getRequestEvent } from '$app/server'
import { error, redirect } from '@sveltejs/kit'
import { z } from 'zod/v4'
import { updateTagSchema } from '$lib/schema/tags'

export const getTag = query(z.object({ id: z.string() }), async ({ id }) => {
	const { locals } = getRequestEvent()

	if (!locals.user || locals.user.role !== 1) {
		throw error(403, 'Forbidden')
	}

	const tag = locals.tagService.getTag(id)

	if (!tag) {
		throw error(404, 'Tag not found')
	}

	return { tag }
})

export const updateTag = form(updateTagSchema, async (data, invalid) => {
	const { locals } = getRequestEvent()

	if (!locals.user || locals.user.role !== 1) {
		throw error(403, 'Forbidden')
	}

	if (!data.name) {
		invalid(invalid.name('Name is required'))
	}

	if (!data.slug) {
		invalid(invalid.slug('Slug is required'))
	}

	locals.tagService.updateTag(data)

	redirect(303, '/admin/tags')
})
