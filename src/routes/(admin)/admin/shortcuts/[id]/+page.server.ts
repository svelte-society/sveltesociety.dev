import { superValidate, message } from 'sveltekit-superforms/server'
import { fail, redirect, error } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { zod4 } from 'sveltekit-superforms/adapters'
import { shortcutSchema } from '../schema'

export const load = (async ({ params, locals }) => {
	const shortcut = locals.shortcutService.getShortcutById(params.id)

	if (!shortcut) {
		error(404, 'Shortcut not found')
	}

	const formData = {
		content_id: shortcut.content_id,
		label: shortcut.label || undefined,
		priority: shortcut.priority,
		is_active: Boolean(shortcut.is_active)
	}
	const form = await superValidate(formData, zod4(shortcutSchema))

	const allContent = locals.contentService.getFilteredContent({
		status: 'published'
	})

	const existingShortcuts = locals.shortcutService.getAllShortcuts()
	const existingContentIds = new Set(
		existingShortcuts.filter((s) => s.id !== params.id).map((s) => s.content_id)
	)

	const availableContent = allContent.filter(
		(c) => c.id === shortcut.content_id || !existingContentIds.has(c.id)
	)

	return {
		form,
		shortcut,
		availableContent,
		meta: {
			title: 'Edit Sidebar Shortcut - Admin',
			description: 'Update sidebar shortcut settings'
		}
	}
}) satisfies PageServerLoad

export const actions = {
	default: async ({ request, params, locals }) => {
		const form = await superValidate(request, zod4(shortcutSchema))

		if (!form.valid) {
			return fail(400, { form })
		}

		try {
			const shortcut = locals.shortcutService.updateShortcut(params.id, form.data)

			if (!shortcut) {
				return fail(500, {
					form,
					error: 'Failed to update sidebar shortcut. Please try again.'
				})
			}

			redirect(303, '/admin/shortcuts')
		} catch (error) {
			console.error('Error updating sidebar shortcut:', error)
			return message(form, {
				success: false,
				text: 'An unexpected error occurred. Please try again.'
			})
		}
	}
} satisfies Actions
