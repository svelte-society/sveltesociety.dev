import { superValidate, message } from 'sveltekit-superforms/server'
import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { zod4 } from 'sveltekit-superforms/adapters'
import { placementSchema } from '../schema'

export const load = (async ({ locals }) => {
	const form = await superValidate(zod4(placementSchema))

	const announcements = locals.contentService.getFilteredContent({
		type: 'announcement',
		status: 'published'
	})

	const locations = locals.announcementService.getActiveLocations()

	return {
		form,
		announcements,
		locations,
		meta: {
			title: 'Add Announcement Placement - Admin',
			description: 'Create a new announcement placement'
		}
	}
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod4(placementSchema))

		if (!form.valid) {
			return fail(400, { form })
		}

		try {
			const placement = locals.announcementService.createPlacement({
				...form.data,
				created_by: locals.user?.id || null
			})

			if (!placement) {
				return fail(500, {
					form,
					error: 'Failed to create announcement placement. Please try again.'
				})
			}

			redirect(303, '/admin/announcements')
		} catch (error) {
			console.error('Error creating announcement placement:', error)
			return message(form, {
				success: false,
				text: 'An unexpected error occurred. Please try again.'
			})
		}
	}
} satisfies Actions
