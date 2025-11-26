import { z } from 'zod'
import { command, getRequestEvent } from '$app/server'
import { error } from '@sveltejs/kit'
import { getData } from '../../routes/(app)/(public)/[...type]/data.remote'

const idSchema = z.string().min(1)

export const toggleLike = command(idSchema, async (contentId) => {
	const { locals, url, params } = getRequestEvent()

	if (!locals.user) {
		error(401, 'Unauthorized')
	}

	const result = locals.interactionsService.toggleInteraction('like', locals.user.id, contentId)

	const currentContentData = locals.searchService.getContentById(contentId)!
	if (result.action === 'add') {
		locals.searchService.update(contentId, {
			...currentContentData,
			likes: currentContentData.likes + 1
		})
	} else {
		locals.searchService.update(contentId, {
			...currentContentData,
			likes: currentContentData.likes - 1
		})
	}

	// Refresh the query cache to ensure liked state stays in sync
	getData({ url, type: params.type }).refresh()

	return result
})

export const toggleSave = command(idSchema, async (contentId) => {
	const { locals, url, params } = getRequestEvent()

	if (!locals.user) {
		error(401, 'Unauthorized')
	}

	const result = locals.interactionsService.toggleInteraction('save', locals.user.id, contentId)

	const currentContentData = locals.searchService.getContentById(contentId)!
	if (result.action === 'add') {
		locals.searchService.update(contentId, {
			...currentContentData,
			saves: currentContentData.saves + 1
		})
	} else {
		locals.searchService.update(contentId, {
			...currentContentData,
			saves: currentContentData.saves - 1
		})
	}

	// Refresh the query cache to ensure saved state stays in sync
	getData({ url, type: params.type }).refresh()

	return result
})
