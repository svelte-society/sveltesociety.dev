import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'

export const load: PageServerLoad = async ({ params, locals }) => {
	const id = params.id
	const content = locals.contentService.getContentById(id)

	if (!content || content.status !== 'pending_review') {
		redirect(302, '/admin/moderation')
	}

	const submitter = content.author_id ? locals.userService.getUser(content.author_id) : null

	if (!submitter) {
		error(404, 'Submitter not found')
	}

	const role = locals.roleService.getRoleById(submitter.role)

	// Cast content to any to work around type mismatch
	// (ContentService returns Tag[] but type says string[])
	const contentAny = content as any

	// Fetch all tags and create a map of ID to name
	const allTags = locals.tagService.getTags({ limit: 100 })
	const tagMap = new Map(allTags.map((tag) => [tag.id, tag.name]))

	// Map tag IDs to names - handle both Tag[] and string[] cases
	const tags = contentAny.tags || []
	const tagNames = tags.map((tag: any) =>
		typeof tag === 'string' ? tagMap.get(tag) || tag : tagMap.get(tag.id) || tag.name
	)
	const tagIds = tags.map((tag: any) => (typeof tag === 'string' ? tag : tag.id))

	return {
		item: {
			id: content.id,
			title: content.title,
			type: content.type,
			status: 'pending', // UI expects 'pending' not 'pending_review'
			submitted_at: content.created_at,
			submitted_by: content.author_id,
			parsedData: {
				title: content.title,
				type: content.type, // Include type for UI checks
				description: content.description,
				body: contentAny.body || '',
				tags: tagIds,
				tagNames,
				notes: content.metadata?.submitter_notes,
				// Type-specific data
				url: content.metadata?.watchUrl || content.metadata?.embedUrl,
				github_repo: content.metadata?.github,
				link: content.metadata?.link,
				image: content.metadata?.image || content.metadata?.thumbnail
			}
		},
		submitter: { ...submitter, role: role?.name }
	}
}

export const actions: Actions = {
	approve: async ({ params, locals }) => {
		if (!locals.user) {
			redirect(302, '/login')
		}

		const id = params.id
		const content = locals.contentService.getContentById(id)

		if (!content) {
			error(404, 'Content not found')
		}

		if (content.status !== 'pending_review') {
			error(400, 'Content is not pending review')
		}

		// Simply change status from pending_review to draft
		// Convert tags from Tag[] objects to string[] IDs for updateContent
		const tagIds = (content.tags || []).map((tag: any) =>
			typeof tag === 'string' ? tag : tag.id
		)

		locals.contentService.updateContent({
			...content,
			id,
			status: 'draft',
			tags: tagIds,
			metadata: {
				...content.metadata,
				moderated_by: locals.user.id,
				moderated_at: new Date().toISOString()
			}
		})

		return getNextItem(locals.contentService, id)
	},

	reject: async ({ params, locals }) => {
		if (!locals.user) {
			redirect(302, '/login')
		}

		const id = params.id
		const content = locals.contentService.getContentById(id)

		if (!content) {
			error(404, 'Content not found')
		}

		if (content.status !== 'pending_review') {
			error(400, 'Content is not pending review')
		}

		// Change status to archived with rejection metadata
		// Convert tags from Tag[] objects to string[] IDs for updateContent
		const tagIds = (content.tags || []).map((tag: any) =>
			typeof tag === 'string' ? tag : tag.id
		)

		locals.contentService.updateContent({
			...content,
			id,
			status: 'archived',
			tags: tagIds,
			metadata: {
				...content.metadata,
				rejected_at: new Date().toISOString(),
				rejected_by: locals.user.id
			}
		})

		return getNextItem(locals.contentService, id)
	}
}

function getNextItem(contentService: App.Locals['contentService'], currentId: string) {
	const nextItems = contentService.getFilteredContent({
		status: 'pending_review',
		limit: 1,
		sort: 'oldest'
	})

	if (nextItems.length > 0 && nextItems[0].id !== currentId) {
		redirect(302, `/admin/moderation/${nextItems[0].id}`)
	}

	redirect(302, '/admin/moderation')
}
