import { superValidate, message } from 'sveltekit-superforms/server'
import { fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { zod4 } from 'sveltekit-superforms/adapters'
import { z } from 'zod/v4'

const toggleSchema = z.object({
	id: z.string().min(1, 'Shortcut ID is required')
})

const deleteSchema = z.object({
	id: z.string().min(1, 'Shortcut ID is required')
})

export const load = (async ({ locals }) => {
	const shortcuts = locals.shortcutService.getAllShortcuts()

	const toggleForm = await superValidate(zod4(toggleSchema))
	const deleteForm = await superValidate(zod4(deleteSchema))

	return {
		shortcuts,
		toggleForm,
		deleteForm,
		meta: {
			title: 'Sidebar Shortcuts - Admin',
			description: 'Manage sidebar shortcuts'
		}
	}
}) satisfies PageServerLoad

export const actions = {
	toggle: async ({ request, locals }) => {
		const form = await superValidate(request, zod4(toggleSchema))

		if (!form.valid) {
			return fail(400, { form })
		}

		try {
			const result = locals.shortcutService.toggleShortcutStatus(form.data.id)
			if (!result) {
				return message(form, {
					success: false,
					text: 'Shortcut not found or could not be updated.'
				})
			}

			return message(form, {
				success: true,
				text: `Shortcut ${result.is_active ? 'activated' : 'deactivated'} successfully!`
			})
		} catch (error) {
			console.error('Error toggling shortcut status:', error)
			return message(form, {
				success: false,
				text: 'An error occurred while updating the shortcut status.'
			})
		}
	},

	delete: async ({ request, locals }) => {
		const form = await superValidate(request, zod4(deleteSchema))

		if (!form.valid) {
			return fail(400, { form })
		}

		try {
			const success = locals.shortcutService.deleteShortcut(form.data.id)
			if (!success) {
				return message(form, {
					success: false,
					text: 'Shortcut not found or could not be deleted.'
				})
			}

			return message(form, {
				success: true,
				text: 'Shortcut deleted successfully!'
			})
		} catch (error) {
			console.error('Error deleting shortcut:', error)
			return message(form, {
				success: false,
				text: 'An error occurred while deleting the shortcut.'
			})
		}
	}
} satisfies Actions
