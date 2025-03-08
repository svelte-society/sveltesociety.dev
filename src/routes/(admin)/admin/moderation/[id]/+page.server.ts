import {
	get_moderation_queue_item,
	update_moderation_status,
	get_moderation_queue_paginated
} from '$lib/server/db/moderation'
import { get_user } from '$lib/server/db/user'
import { get_role_by_id } from '$lib/server/db/role'
import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'

export const load: PageServerLoad = async ({ params }) => {
	const id = parseInt(params.id)
	const item = get_moderation_queue_item(id)

	if (!item) {
		throw error(404, 'Item not found')
	}

	const submitter = get_user(item.submitted_by)

	if (!submitter) {
		throw error(404, 'Submitter not found')
	}

	const role = get_role_by_id(submitter.role)

	return { item, submitter: { ...submitter, role: role?.name } }
}

export const actions: Actions = {
	approve: async ({ params, request }) => {
		const id = parseInt(params.id)
		update_moderation_status(id, 'approved', 1) // Replace 1 with actual user ID
		return await getNextItem(id)
	},
	reject: async ({ params, request }) => {
		const id = parseInt(params.id)
		update_moderation_status(id, 'rejected', 1) // Replace 1 with actual user ID
		return await getNextItem(id)
	}
}

async function getNextItem(currentId: number) {
	const nextItems = await get_moderation_queue_paginated({
		status: 'pending',
		limit: 1,
		offset: 0
	})

	if (nextItems.length > 0 && nextItems[0].id !== currentId) {
		throw redirect(302, `/moderation/${nextItems[0].id}`)
	} else {
		throw redirect(302, '/admin/moderation')
	}
}
