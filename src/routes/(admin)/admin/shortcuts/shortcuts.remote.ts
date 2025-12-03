import { form, getRequestEvent, query } from '$app/server'
import { redirect } from '@sveltejs/kit'
import { z } from 'zod/v4'

const shortcutSchema = z.object({
	content_id: z.string().min(1, 'Content is required'),
	label: z.string().optional(),
	priority: z.coerce.number().int().min(0).default(0),
	is_active: z.coerce.boolean().default(true)
})

const toggleSchema = z.object({
	id: z.string().min(1, 'Shortcut ID is required')
})

const deleteSchema = z.object({
	id: z.string().min(1, 'Shortcut ID is required')
})

export const getShortcuts = query(() => {
	const { locals } = getRequestEvent()
	return locals.shortcutService.getAllShortcuts()
})

export const getShortcutById = query(z.string(), (id) => {
	const { locals } = getRequestEvent()
	return locals.shortcutService.getShortcutById(id)
})

export const getAvailableContent = query(
	z.object({ excludeShortcutId: z.string().optional() }),
	({ excludeShortcutId }) => {
		const { locals } = getRequestEvent()

		const allContent = locals.contentService.getFilteredContent({
			status: 'published'
		})

		const existingShortcuts = locals.shortcutService.getAllShortcuts()
		const existingContentIds = new Set(
			existingShortcuts
				.filter((s) => s.id !== excludeShortcutId)
				.map((s) => s.content_id)
		)

		return allContent.filter((c) => !existingContentIds.has(c.id))
	}
)

export const createShortcut = form(shortcutSchema, async (data) => {
	const { locals } = getRequestEvent()

	let shortcut
	try {
		shortcut = locals.shortcutService.createShortcut({
			...data,
			created_by: locals.user?.id || null
		})
	} catch (error) {
		// Handle UNIQUE constraint violation
		if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
			return {
				success: false,
				text: 'This content already has a shortcut. Please select different content.'
			}
		}
		console.error('Error creating sidebar shortcut:', error)
		return {
			success: false,
			text: 'An unexpected error occurred. Please try again.'
		}
	}

	if (!shortcut) {
		return {
			success: false,
			text: 'Failed to create sidebar shortcut. Please try again.'
		}
	}

	redirect(303, '/admin/shortcuts')
})

export const updateShortcut = form(
	z.object({
		id: z.string().min(1),
		content_id: z.string().min(1, 'Content is required'),
		label: z.string().optional(),
		priority: z.coerce.number().int().min(0).default(0),
		is_active: z.coerce.boolean().default(true)
	}),
	async (data) => {
		const { locals } = getRequestEvent()

		let shortcut
		try {
			shortcut = locals.shortcutService.updateShortcut(data.id, data)
		} catch (error) {
			// Handle UNIQUE constraint violation
			if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
				return {
					success: false,
					text: 'This content already has a shortcut. Please select different content.'
				}
			}
			console.error('Error updating sidebar shortcut:', error)
			return {
				success: false,
				text: 'An unexpected error occurred. Please try again.'
			}
		}

		if (!shortcut) {
			return {
				success: false,
				text: 'Failed to update sidebar shortcut. Please try again.'
			}
		}

		redirect(303, '/admin/shortcuts')
	}
)

export const toggleShortcut = form(toggleSchema, async (data) => {
	const { locals } = getRequestEvent()

	const result = locals.shortcutService.toggleShortcutStatus(data.id)
	if (!result) {
		return {
			success: false,
			text: 'Shortcut not found or could not be updated.'
		}
	}

	return {
		success: true,
		text: `Shortcut ${result.is_active ? 'activated' : 'deactivated'} successfully!`
	}
})

export const deleteShortcut = form(deleteSchema, async (data) => {
	const { locals } = getRequestEvent()

	const success = locals.shortcutService.deleteShortcut(data.id)
	if (!success) {
		return {
			success: false,
			text: 'Shortcut not found or could not be deleted.'
		}
	}

	return {
		success: true,
		text: 'Shortcut deleted successfully!'
	}
})
