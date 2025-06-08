import { ModerationStatus } from '$lib/server/services/moderation'
import type { PageServerLoad, Actions } from './$types'
import { fail } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ url, locals }) => {
	try {
		const page = Math.max(1, Number(url.searchParams.get('page') || '1'))
		const itemsPerPage = 10
		const offset = (page - 1) * itemsPerPage

		const totalItems = locals.moderationService.getModerationQueueCount(ModerationStatus.PENDING)
		const totalPages = Math.ceil(totalItems / itemsPerPage)

		const items = locals.moderationService.getModerationQueuePaginated({
			status: ModerationStatus.PENDING,
			limit: itemsPerPage,
			offset
		})

		// Fetch submitter information for each item
		const itemsWithSubmitters = items.map((item) => {
			const submitter = locals.userService.getUser(item.submitted_by)
			return {
				...item,
				submitter_name: submitter?.name || 'Unknown',
				submitter_username: submitter?.username || null
			}
		})

		return {
			items: itemsWithSubmitters,
			page,
			totalPages,
			totalItems
		}
	} catch (error) {
		console.error('Error loading moderation queue:', error)
		return {
			items: [],
			page: 1,
			totalPages: 0,
			totalItems: 0
		}
	}
}

export const actions: Actions = {
	approve: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { success: false, message: 'Unauthorized' })
		}

		try {
			const data = await request.formData()
			const id = data.get('id') as string
			if (!id) return fail(400, { success: false, message: 'Missing ID' })

			await locals.moderationService.updateModerationStatus(
				id,
				ModerationStatus.APPROVED,
				locals.user.id
			)
			return { success: true }
		} catch (error) {
			console.error('Error approving item:', error)
			return fail(500, { success: false, message: 'Failed to approve item' })
		}
	},
	reject: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { success: false, message: 'Unauthorized' })
		}

		try {
			const data = await request.formData()
			const id = data.get('id') as string
			if (!id) return fail(400, { success: false, message: 'Missing ID' })

			await locals.moderationService.updateModerationStatus(
				id,
				ModerationStatus.REJECTED,
				locals.user.id
			)
			return { success: true }
		} catch (error) {
			console.error('Error rejecting item:', error)
			return fail(500, { success: false, message: 'Failed to reject item' })
		}
	},
	bulk_reject: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { success: false, message: 'Unauthorized' })
		}

		try {
			const data = await request.formData()
			const ids = JSON.parse(data.get('ids') as string) as string[]
			for (const id of ids) {
				await locals.moderationService.updateModerationStatus(
					id,
					ModerationStatus.REJECTED,
					locals.user.id
				)
			}
			return { success: true }
		} catch (error) {
			console.error('Error bulk rejecting items:', error)
			return fail(500, { success: false, message: 'Failed to bulk reject items' })
		}
	}
}
