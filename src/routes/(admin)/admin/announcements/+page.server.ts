import { superValidate, message } from 'sveltekit-superforms/server'
import { fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'

const toggleSchema = z.object({
	id: z.string().min(1, 'Placement ID is required')
})

const deleteSchema = z.object({
	id: z.string().min(1, 'Placement ID is required')
})

export const load = (async ({ locals }) => {
	const announcements = locals.contentService.getFilteredContent({
		type: 'announcement',
		status: 'published'
	})

	const placements = locals.announcementService.getAllPlacements()

	const toggleForm = await superValidate(zod(toggleSchema))
	const deleteForm = await superValidate(zod(deleteSchema))

	return {
		announcements,
		placements,
		toggleForm,
		deleteForm,
		meta: {
			title: 'Announcement Placements - Admin',
			description: 'Manage announcement placements'
		}
	}
}) satisfies PageServerLoad

export const actions = {
	toggle: async ({ request, locals }) => {
		const form = await superValidate(request, zod(toggleSchema))

		if (!form.valid) {
			return fail(400, { form })
		}

		try {
			const result = locals.announcementService.togglePlacementStatus(form.data.id)
			if (!result) {
				return message(form, {
					success: false,
					text: 'Placement not found or could not be updated.'
				})
			}

			return message(form, {
				success: true,
				text: `Placement ${result.is_active ? 'activated' : 'deactivated'} successfully!`
			})
		} catch (error) {
			console.error('Error toggling placement status:', error)
			return message(form, {
				success: false,
				text: 'An error occurred while updating the placement status.'
			})
		}
	},

	delete: async ({ request, locals }) => {
		const form = await superValidate(request, zod(deleteSchema))

		if (!form.valid) {
			return fail(400, { form })
		}

		try {
			const success = locals.announcementService.deletePlacement(form.data.id)
			if (!success) {
				return message(form, {
					success: false,
					text: 'Placement not found or could not be deleted.'
				})
			}

			return message(form, {
				success: true,
				text: 'Placement deleted successfully!'
			})
		} catch (error) {
			console.error('Error deleting placement:', error)
			return message(form, {
				success: false,
				text: 'An error occurred while deleting the placement.'
			})
		}
	}
} satisfies Actions