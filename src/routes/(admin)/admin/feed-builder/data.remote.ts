import { form, getRequestEvent, query } from '$app/server'
import { error, isRedirect, redirect } from '@sveltejs/kit'
import { z } from 'zod/v4'
import { checkAdminAuth } from '../authorization.remote'

const feedItemSchema = z
	.object({
		content_id: z.string().optional(),
		item_type: z.enum(['cta', 'ad', 'featured']),
		title: z.string().optional(),
		description: z.string().optional(),
		button_text: z.string().optional(),
		button_href: z.string().optional(),
		position_type: z.enum(['fixed', 'random']).default('random'),
		position_fixed: z.coerce.number().int().min(0).optional(),
		position_range_min: z.coerce.number().int().min(0).default(3),
		position_range_max: z.coerce.number().int().min(0).default(7),
		start_date: z.string().optional(),
		end_date: z.string().optional(),
		is_active: z.coerce.boolean().default(true),
		priority: z.coerce.number().int().min(0).default(0)
	})
	.refine((data) => data.position_range_min <= data.position_range_max, {
		message: 'Min position must be less than or equal to max position',
		path: ['position_range_min']
	})

const toggleSchema = z.object({
	id: z.string().min(1, 'Feed item ID is required')
})

const deleteSchema = z.object({
	id: z.string().min(1, 'Feed item ID is required')
})

export const getFeedItems = query(() => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	return locals.feedItemService.getAllFeedItems()
})

export const getFeedItemById = query(z.object({ id: z.string() }), ({ id }) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	const feedItem = locals.feedItemService.getFeedItemById(id)
	if (!feedItem) error(404, 'Feed item not found')
	return feedItem
})

export const getPublishedContent = query(() => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	const content = locals.contentService.getFilteredContent({
		status: 'published'
	})
	return content.map((c: { id: string; title: string; type: string }) => ({
		value: c.id,
		label: `${c.title} (${c.type})`
	}))
})

export const createFeedItem = form(feedItemSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	try {
		const feedItemData = {
			content_id: data.content_id || null,
			item_type: data.item_type,
			title: data.title || null,
			description: data.description || null,
			button_text: data.button_text || null,
			button_href: data.button_href || null,
			position_type: data.position_type,
			position_fixed: data.position_type === 'fixed' ? data.position_fixed : null,
			position_range_min: data.position_type === 'random' ? data.position_range_min : null,
			position_range_max: data.position_type === 'random' ? data.position_range_max : null,
			start_date: data.start_date || null,
			end_date: data.end_date || null,
			is_active: data.is_active,
			priority: data.priority,
			created_by: locals.user?.id || null
		}

		const feedItem = locals.feedItemService.createFeedItem(feedItemData)

		if (!feedItem) {
			return {
				success: false,
				text: 'Failed to create feed item. Please try again.'
			}
		}

		redirect(303, '/admin/feed-builder')
	} catch (err) {
		if (isRedirect(err)) throw err
		console.error('Error creating feed item:', err)
		return {
			success: false,
			text: 'An unexpected error occurred. Please try again.'
		}
	}
})

export const updateFeedItem = form(
	z
		.object({
			id: z.string().min(1),
			content_id: z.string().optional(),
			item_type: z.enum(['cta', 'ad', 'featured']),
			title: z.string().optional(),
			description: z.string().optional(),
			button_text: z.string().optional(),
			button_href: z.string().optional(),
			position_type: z.enum(['fixed', 'random']).default('random'),
			position_fixed: z.coerce.number().int().min(0).optional(),
			position_range_min: z.coerce.number().int().min(0).default(3),
			position_range_max: z.coerce.number().int().min(0).default(7),
			start_date: z.string().optional(),
			end_date: z.string().optional(),
			is_active: z.coerce.boolean().default(true),
			priority: z.coerce.number().int().min(0).default(0)
		})
		.refine((data) => data.position_range_min <= data.position_range_max, {
			message: 'Min position must be less than or equal to max position',
			path: ['position_range_min']
		}),
	async (data) => {
		checkAdminAuth()
		const { locals } = getRequestEvent()

		try {
			const updateData = {
				content_id: data.content_id || null,
				item_type: data.item_type,
				title: data.title || null,
				description: data.description || null,
				button_text: data.button_text || null,
				button_href: data.button_href || null,
				position_type: data.position_type,
				position_fixed: data.position_type === 'fixed' ? data.position_fixed : null,
				position_range_min: data.position_type === 'random' ? data.position_range_min : null,
				position_range_max: data.position_type === 'random' ? data.position_range_max : null,
				start_date: data.start_date || null,
				end_date: data.end_date || null,
				is_active: data.is_active,
				priority: data.priority
			}

			const feedItem = locals.feedItemService.updateFeedItem(data.id, updateData)

			if (!feedItem) {
				return {
					success: false,
					text: 'Failed to update feed item. Please try again.'
				}
			}

			redirect(303, '/admin/feed-builder')
		} catch (err) {
			if (isRedirect(err)) throw err
			console.error('Error updating feed item:', err)
			return {
				success: false,
				text: 'An unexpected error occurred. Please try again.'
			}
		}
	}
)

export const toggleFeedItem = form(toggleSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	try {
		const result = locals.feedItemService.toggleFeedItemStatus(data.id)
		if (!result) {
			return {
				success: false,
				text: 'Feed item not found or could not be updated.'
			}
		}

		return {
			success: true,
			text: `Feed item ${result.is_active ? 'activated' : 'deactivated'} successfully!`
		}
	} catch (err) {
		console.error('Error toggling feed item status:', err)
		return {
			success: false,
			text: 'An error occurred while updating the feed item status.'
		}
	}
})

export const deleteFeedItem = form(deleteSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	try {
		const success = locals.feedItemService.deleteFeedItem(data.id)
		if (!success) {
			return {
				success: false,
				text: 'Feed item not found or could not be deleted.'
			}
		}

		return {
			success: true,
			text: 'Feed item deleted successfully!'
		}
	} catch (err) {
		console.error('Error deleting feed item:', err)
		return {
			success: false,
			text: 'An error occurred while deleting the feed item.'
		}
	}
})
