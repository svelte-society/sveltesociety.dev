import { fail } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions = {
	interact: async ({ request, locals }) => {
		if (!locals.user) return
		const data = await request.formData()
		const type = data.get('type') as 'like' | 'save'
		const contentId = data.get('id') as string

		try {
			const result = locals.interactionsService.toggleInteraction(type, locals.user.id, contentId)

			const currentContentData = locals.searchService.getContentById(contentId)!
			if (result.action === 'add') {
				locals.searchService.update(contentId, {
					...currentContentData,
					...{ [type + 's']: currentContentData[type + 's'] + 1 }
				})
			} else {
				locals.searchService.update(contentId, {
					...currentContentData,
					...{ [type + 's']: currentContentData[type + 's'] - 1 }
				})
			}
			return { success: true }
		} catch (error) {
			return fail(500, { message: 'Server error' })
		}
	}
} satisfies Actions
