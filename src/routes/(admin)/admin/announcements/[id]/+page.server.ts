import { superValidate, message } from 'sveltekit-superforms/server'
import { fail, redirect, error } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { zod } from 'sveltekit-superforms/adapters'
import { placementSchema } from '../schema'

export const load = (async ({ params, locals }) => {
	const placement = locals.announcementService.getPlacementById(params.id)
	
	if (!placement) {
		error(404, 'Placement not found')
	}

	const form = await superValidate(placement, zod(placementSchema))
	
	const announcements = locals.contentService.getFilteredContent({
		type: 'announcement',
		status: 'published'
	})

	const locations = locals.announcementService.getActiveLocations()

	return {
		form,
		placement,
		announcements,
		locations,
		meta: {
			title: 'Edit Announcement Placement - Admin',
			description: 'Update announcement placement settings'
		}
	}
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request, params, locals }) => {
		const form = await superValidate(request, zod(placementSchema))

		if (!form.valid) {
			return fail(400, { form })
		}

		try {
			const placement = locals.announcementService.updatePlacement(params.id, form.data)

			if (!placement) {
				return fail(500, {
					form,
					error: 'Failed to update announcement placement. Please try again.'
				})
			}

			redirect(303, '/admin/announcements')
		} catch (error) {
			console.error('Error updating announcement placement:', error)
			return message(form, {
				success: false,
				text: 'An unexpected error occurred. Please try again.'
			})
		}
	}
} satisfies Actions