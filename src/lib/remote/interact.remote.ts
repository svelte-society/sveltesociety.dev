import { z } from 'zod'
import { command, getRequestEvent } from '$app/server'
import { error } from '@sveltejs/kit'
import { getHomeData, getCategoryData } from '../../routes/(app)/(public)/data.remote'

const idSchema = z.string().min(1)

// Helper to refresh the appropriate query cache based on route
function refreshDataCache(url: URL, type: string | undefined) {
	if (type) {
		getCategoryData({ url, type }).refresh()
	} else {
		getHomeData({ url }).refresh()
	}
}

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
	refreshDataCache(url, params.type)

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
	refreshDataCache(url, params.type)

	return result
})
