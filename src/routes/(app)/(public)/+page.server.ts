import { filter_content_schema } from '$lib/server/filter'
import { fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, locals }) => {
	const filters = await superValidate(url, zod(filter_content_schema))
	const start = performance.now()

	let content = []
	let count = 0

	if (filters.valid) {
		content = locals.contentService.getFilteredContent({
			...filters.data,
			limit: 50
		})
		count = locals.contentService.getFilteredContentCount(filters.data)
	} else {
		content = locals.contentService.getFilteredContent({ limit: 50 })
		count = locals.contentService.getFilteredContentCount()
	}

	const end = performance.now()
	console.log('Load function: ', end - start)

	return {
		content,
		count
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
				await locals.interactionsService.addInteraction(type, locals.user.id, contentId)
			} else {
				await locals.interactionsService.removeInteraction(type, locals.user.id, contentId)
			}
			return { success: true }
		} catch (error) {
			return fail(500, { message: 'Server error' })
		}
	}
}
