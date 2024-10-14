import type { PageServerLoad } from './$types'
import { fail } from '@sveltejs/kit'
import { get_all_content, delete_content } from '$lib/server/db/content'

export const load: PageServerLoad = async () => {
	const content = get_all_content()

	if (!content) {
		fail(400, { message: 'Error getting content' })
	}

	return { content }
}

export const actions = {
	delete: async ({ request }) => {
		const formData = await request.formData()
		const id = formData.get('id') as string

		if (!id) {
			return
		}

		try {
			delete_content(parseInt(id))
			return { success: true }
		} catch (err) {
			return fail(500, { message: 'Failed to delete content' })
		}
	}
}
