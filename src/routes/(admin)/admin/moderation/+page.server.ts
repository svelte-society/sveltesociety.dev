import type { PageServerLoad, Actions } from './$types'
import { fail } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ url, locals }) => {
	try {
		const page = Math.max(1, Number(url.searchParams.get('page') || '1'))
		const itemsPerPage = 10
		const offset = (page - 1) * itemsPerPage

		// Query content with pending_review status
		const totalItems = locals.contentService.getFilteredContentCount({
			status: 'pending_review'
		})
		const totalPages = Math.ceil(totalItems / itemsPerPage)

		const items = locals.contentService.getFilteredContent({
			status: 'pending_review',
			limit: itemsPerPage,
			offset,
			sort: 'oldest' // FIFO - oldest first
		})

		// Map to expected UI format
		const itemsWithSubmitters = items.map((item) => {
			const submitter = item.author_id ? locals.userService.getUser(item.author_id) : null
			return {
				id: item.id,
				title: item.title,
				type: item.type,
				status: 'pending', // UI expects 'pending' not 'pending_review'
				submitted_at: item.created_at,
				submitted_by: item.author_id,
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
		console.error('Error loading pending content:', error)
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

			const content = locals.contentService.getContentById(id)
			if (!content || content.status !== 'pending_review') {
				return fail(404, { success: false, message: 'Content not found or already processed' })
			}

			locals.contentService.updateContent({
				...content,
				id,
				status: 'draft',
				metadata: {
					...content.metadata,
					moderated_by: locals.user.id,
					moderated_at: new Date().toISOString()
				}
			})
			return { success: true }
		} catch (error) {
			console.error('Error approving content:', error)
			return fail(500, { success: false, message: 'Failed to approve content' })
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

			const content = locals.contentService.getContentById(id)
			if (!content || content.status !== 'pending_review') {
				return fail(404, { success: false, message: 'Content not found or already processed' })
			}

			locals.contentService.updateContent({
				...content,
				id,
				status: 'archived',
				metadata: {
					...content.metadata,
					rejected_at: new Date().toISOString(),
					rejected_by: locals.user.id
				}
			})
			return { success: true }
		} catch (error) {
			console.error('Error rejecting content:', error)
			return fail(500, { success: false, message: 'Failed to reject content' })
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
				const content = locals.contentService.getContentById(id)
				if (content && content.status === 'pending_review') {
					locals.contentService.updateContent({
						...content,
						id,
						status: 'archived',
						metadata: {
							...content.metadata,
							rejected_at: new Date().toISOString(),
							rejected_by: locals.user.id,
							rejection_reason: 'Bulk rejected'
						}
					})
				}
			}
			return { success: true }
		} catch (error) {
			console.error('Error bulk rejecting content:', error)
			return fail(500, { success: false, message: 'Failed to bulk reject content' })
		}
	}
}
