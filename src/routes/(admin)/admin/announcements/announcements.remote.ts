import { form, getRequestEvent, query } from '$app/server'
import { error, isRedirect, redirect } from '@sveltejs/kit'
import { z } from 'zod/v4'
import { checkAdminAuth } from '../authorization.remote'

const placementSchema = z.object({
	content_id: z.string().min(1, 'Announcement is required'),
	placement_location_id: z.string().min(1, 'Placement location is required'),
	start_date: z.string().optional(),
	end_date: z.string().optional(),
	priority: z.coerce.number().int().min(0).default(0),
	is_active: z.coerce.boolean().default(true)
})

const toggleSchema = z.object({
	id: z.string().min(1, 'Placement ID is required')
})

const deleteSchema = z.object({
	id: z.string().min(1, 'Placement ID is required')
})

export const getPlacements = query(() => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	return locals.announcementService.getAllPlacements()
})

export const getPlacementById = query(z.string(), (id) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	const placement = locals.announcementService.getPlacementById(id)
	if (!placement) error(404, 'Placement not found')
	return placement
})

export const getAnnouncements = query(() => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	const announcements = locals.contentService.getFilteredContent({
		type: 'announcement',
		status: 'published'
	})
	return announcements.map((a: { id: string; title: string }) => ({
		value: a.id,
		label: a.title
	}))
})

export const getLocations = query(() => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	const locations = locals.announcementService.getActiveLocations()
	return locations.map((l: { id: string; name: string }) => ({
		value: l.id,
		label: l.name
	}))
})

export const createPlacement = form(placementSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	try {
		const placementData = {
			content_id: data.content_id,
			placement_location_id: data.placement_location_id,
			start_date: data.start_date,
			end_date: data.end_date,
			priority: data.priority,
			is_active: data.is_active,
			created_by: locals.user?.id || null
		} as any

		const placement = locals.announcementService.createPlacement(placementData)

		if (!placement) {
			return {
				success: false,
				text: 'Failed to create announcement placement. Please try again.'
			}
		}

		redirect(303, '/admin/announcements')
	} catch (error) {
		if (isRedirect(error)) throw error
		console.error('Error creating announcement placement:', error)
		return {
			success: false,
			text: 'An unexpected error occurred. Please try again.'
		}
	}
})

export const updatePlacement = form(
	z.object({
		id: z.string().min(1),
		content_id: z.string().min(1, 'Announcement is required'),
		placement_location_id: z.string().min(1, 'Placement location is required'),
		start_date: z.string().optional(),
		end_date: z.string().optional(),
		priority: z.coerce.number().int().min(0).default(0),
		is_active: z.coerce.boolean().default(true)
	}),
	async (data) => {
		checkAdminAuth()
		const { locals } = getRequestEvent()

		try {
			const updateData = {
				content_id: data.content_id,
				placement_location_id: data.placement_location_id,
				start_date: data.start_date,
				end_date: data.end_date,
				priority: data.priority,
				is_active: data.is_active
			} as any

			const placement = locals.announcementService.updatePlacement(String(data.id), updateData)

			if (!placement) {
				return {
					success: false,
					text: 'Failed to update announcement placement. Please try again.'
				}
			}

			redirect(303, '/admin/announcements')
		} catch (error) {
			if (isRedirect(error)) throw error
			console.error('Error updating announcement placement:', error)
			return {
				success: false,
				text: 'An unexpected error occurred. Please try again.'
			}
		}
	}
)

export const togglePlacement = form(toggleSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	try {
		const result = locals.announcementService.togglePlacementStatus(data.id)
		if (!result) {
			return {
				success: false,
				text: 'Placement not found or could not be updated.'
			}
		}

		await getPlacements().refresh()
		return {
			success: true,
			text: `Placement ${result.is_active ? 'activated' : 'deactivated'} successfully!`
		}
	} catch (error) {
		console.error('Error toggling placement status:', error)
		return {
			success: false,
			text: 'An error occurred while updating the placement status.'
		}
	}
})

export const deletePlacement = form(deleteSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	try {
		const success = locals.announcementService.deletePlacement(data.id)
		if (!success) {
			return {
				success: false,
				text: 'Placement not found or could not be deleted.'
			}
		}

		await getPlacements().refresh()
		return {
			success: true,
			text: 'Placement deleted successfully!'
		}
	} catch (error) {
		console.error('Error deleting placement:', error)
		return {
			success: false,
			text: 'An error occurred while deleting the placement.'
		}
	}
})
