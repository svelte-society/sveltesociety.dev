import { form, getRequestEvent, query } from '$app/server'
import { z } from 'zod/v4'
import { checkAdminAuth } from '../authorization.remote'

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
