import { get_content } from '$lib/server/db/content'
import { add_interaction, remove_interaction } from '$lib/server/db/interactions'
import { filter_content_schema, get_filtered_content } from '$lib/server/filter'
import { fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, locals }) => {
	const filters = await superValidate(url, zod(filter_content_schema))

	let content = []

	const start = performance.now()

	if (filters.valid) {
		content = get_filtered_content(filters.data, locals.user?.id || '')
	} else {
		content = get_content({ limit: 50 }, locals.user?.id || '')
	}

	if (content.length === 0) {
		return {
			content: [],
			count: 0
		}
	}

	const end = performance.now()
	// Old result 40~
	console.log('Load function: ', end - start)

	return {
		content,
		count: 0
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
				add_interaction(type, locals.user.id, contentId)
			} else {
				remove_interaction(type, locals.user.id, contentId)
			}
			return { success: true }
		} catch (error) {
			return fail(500, { message: 'Server error' })
		}
	}
}
