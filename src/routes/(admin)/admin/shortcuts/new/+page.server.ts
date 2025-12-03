import { superValidate, message } from 'sveltekit-superforms/server'
import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { zod4 } from 'sveltekit-superforms/adapters'
import { shortcutSchema } from '../schema'

export const load = (async ({ locals }) => {
	const form = await superValidate(zod4(shortcutSchema))

	const allContent = locals.contentService.getFilteredContent({
		status: 'published'
	})

	const existingShortcuts = locals.shortcutService.getAllShortcuts()
	const existingContentIds = new Set(existingShortcuts.map((s) => s.content_id))

	const availableContent = allContent.filter((c) => !existingContentIds.has(c.id))

	return {
		form,
		availableContent,
		meta: {
			title: 'Add Sidebar Shortcut - Admin',
			description: 'Create a new sidebar shortcut'
		}
	}
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod4(shortcutSchema))

		if (!form.valid) {
			return fail(400, { form })
		}

		try {
			const shortcut = locals.shortcutService.createShortcut({
				...form.data,
				created_by: locals.user?.id || null
			})

			if (!shortcut) {
				return fail(500, {
					form,
					error: 'Failed to create sidebar shortcut. Please try again.'
				})
			}

			redirect(303, '/admin/shortcuts')
		} catch (error) {
			console.error('Error creating sidebar shortcut:', error)
			return message(form, {
				success: false,
				text: 'An unexpected error occurred. Please try again.'
			})
		}
	}
} satisfies Actions
