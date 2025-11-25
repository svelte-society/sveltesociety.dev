import { z } from 'zod'
import { form, getRequestEvent } from '$app/server'
import { fail } from '@sveltejs/kit'

const likeSchema = z.object({
	id: z.string().min(1)
})

const saveSchema = z.object({
	id: z.string().min(1)
})

export const toggleLike = form(likeSchema, async (data, invalid) => {
	const { locals } = getRequestEvent()

	if (!locals.user) {
		return fail(401, { message: 'Unauthorized' })
	}

	const result = locals.interactionsService.toggleInteraction('like', locals.user.id, data.id)

	const currentContentData = locals.searchService.getContentById(data.id)!
	if (result.action === 'add') {
		locals.searchService.update(data.id, {
			...currentContentData,
			likes: currentContentData.likes + 1
		})
	} else {
		locals.searchService.update(data.id, {
			...currentContentData,
			likes: currentContentData.likes - 1
		})
	}
})

export const toggleSave = form(saveSchema, async (data, invalid) => {
	const { locals } = getRequestEvent()

	if (!locals.user) {
		return fail(401, { message: 'Unauthorized' })
	}

	const result = locals.interactionsService.toggleInteraction('save', locals.user.id, data.id)

	const currentContentData = locals.searchService.getContentById(data.id)!
	if (result.action === 'add') {
		locals.searchService.update(data.id, {
			...currentContentData,
			saves: currentContentData.saves + 1
		})
	} else {
		locals.searchService.update(data.id, {
			...currentContentData,
			saves: currentContentData.saves - 1
		})
	}
})
