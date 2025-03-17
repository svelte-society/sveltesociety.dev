import { ModerationStatus } from '$lib/server/db/moderation'
import type { PageServerLoad, Actions } from './$types'
import { fail } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ url, locals }) => {
	const page = Number(url.searchParams.get('page') || '1')
	const itemsPerPage = 10
	const offset = (page - 1) * itemsPerPage

	const totalItems = locals.moderationService.getModerationQueueCount(ModerationStatus.PENDING)
	const totalPages = Math.ceil(totalItems / itemsPerPage)

	const items = locals.moderationService.getModerationQueuePaginated({
		status: ModerationStatus.PENDING,
		limit: itemsPerPage,
		offset
	})

	return {
		items,
		page,
		totalPages,
		totalItems
	}
}

export const actions: Actions = {
	approve: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { success: false, message: 'Unauthorized' })
		}

		const data = await request.formData()
		const id = data.get('id') as string
		if (!id) return fail(400, { success: false, message: 'Missing ID' })

		locals.moderationService.updateModerationStatus(id, ModerationStatus.APPROVED, locals.user.id)
		return { success: true }
	},
	reject: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { success: false, message: 'Unauthorized' })
		}

		const data = await request.formData()
		const id = data.get('id') as string
		if (!id) return fail(400, { success: false, message: 'Missing ID' })

		locals.moderationService.updateModerationStatus(id, ModerationStatus.REJECTED, locals.user.id)
		return { success: true }
	},
	bulk_reject: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { success: false, message: 'Unauthorized' })
		}

		const data = await request.formData()
		const ids = JSON.parse(data.get('ids') as string) as string[]
		for (const id of ids) {
			locals.moderationService.updateModerationStatus(id, ModerationStatus.REJECTED, locals.user.id)
		}
		return { success: true }
	}
}
