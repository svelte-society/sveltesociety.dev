import { ModerationService, ModerationStatus } from '$lib/server/services/moderation'
import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'

// TODO: Create and import user and role services similarly to how ModerationService is implemented

export const load: PageServerLoad = async ({ params, locals }) => {
	const id = params.id
	const item = locals.moderationService.getModerationQueueItem(id)

	if (!item) {
		throw redirect(302, '/admin/moderation')
	}

	const submitter = locals.userService.getUser(item.submitted_by)
	
	if (!submitter) {
		throw error(404, 'Submitter not found')
	}

	const role = locals.roleService.getRoleById(submitter.role)

	return { item, submitter: { ...submitter, role: role?.name } }
}

export const actions: Actions = {
	approve: async ({ params, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/login')
		}

		const id = params.id
		locals.moderationService.updateModerationStatus(id, ModerationStatus.APPROVED, locals.user.id)
		return await getNextItem(locals.moderationService, id)
	},
	reject: async ({ params, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/login')
		}

		const id = params.id
		locals.moderationService.updateModerationStatus(id, ModerationStatus.REJECTED, locals.user.id)
		return await getNextItem(locals.moderationService, id)
	}
}

async function getNextItem(moderationService: ModerationService, currentId: string) {
	const nextItems = moderationService.getModerationQueuePaginated({
		status: ModerationStatus.PENDING,
		limit: 1,
		offset: 0
	})

	if (nextItems.length > 0 && nextItems[0].id !== currentId) {
		throw redirect(302, `/admin/moderation/${nextItems[0].id}`)
	}

	throw redirect(302, '/admin/moderation')
}
