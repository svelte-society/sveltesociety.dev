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
		const item = locals.moderationService.getModerationQueueItem(id)

		if (!item) {
			throw error(404, 'Moderation item not found')
		}

		// Parse the submission data
		const submissionData = JSON.parse(item.data)

		// Generate slug from title
		const slug = submissionData.title
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.trim()

		try {
			// Prepare content data based on type
			let contentData: any = {
				title: submissionData.title,
				slug: slug,
				description: submissionData.description || '',
				type: item.type,
				status: 'draft', // Set as draft when approved
				tags: submissionData.tags || [],
				author_id: item.submitted_by,
				metadata: {
					imported_from_moderation: true,
					moderated_by: locals.user.id,
					moderated_at: new Date().toISOString()
				}
			}

			// Handle type-specific fields
			if (item.type === 'video' && submissionData.url) {
				// Extract YouTube video ID from URL
				const videoIdMatch = submissionData.url.match(
					/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
				)
				const videoId = videoIdMatch ? videoIdMatch[1] : null

				contentData.body = submissionData.url
				contentData.metadata = {
					...contentData.metadata,
					url: submissionData.url,
					embedUrl: videoId ? `https://www.youtube.com/embed/${videoId}` : submissionData.url,
					thumbnail: videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null,
					videoId: videoId,
					notes: submissionData.notes || ''
				}
			} else if (item.type === 'library' && submissionData.github_repo) {
				contentData.body = submissionData.github_repo
				contentData.metadata = {
					...contentData.metadata,
					github_repo: submissionData.github_repo,
					notes: submissionData.notes || ''
				}
			} else if (item.type === 'link' && submissionData.url) {
				contentData.body = submissionData.url
				contentData.metadata = {
					...contentData.metadata,
					url: submissionData.url,
					notes: submissionData.notes || ''
				}
			} else if (item.type === 'recipe' && submissionData.body) {
				contentData.body = submissionData.body
				contentData.metadata = {
					...contentData.metadata,
					notes: submissionData.notes || ''
				}
			} else {
				// Fallback for other types
				contentData.body =
					submissionData.body || submissionData.url || submissionData.github_repo || ''
				contentData.metadata = {
					...contentData.metadata,
					...submissionData,
					notes: submissionData.notes || ''
				}
			}

			// Create the content
			const contentId = locals.contentService.addContent(contentData)

			// Update moderation status to approved and then delete from queue
			locals.moderationService.updateModerationStatus(id, ModerationStatus.APPROVED, locals.user.id)
			locals.moderationService.deleteModerationQueueItem(id)

			console.log(`Created content ${contentId} from moderation item ${id} and removed from queue`)
		} catch (error) {
			console.error('Error creating content from moderation item:', error)
			throw error
		}

		return await getNextItem(locals.moderationService, id)
	},
	reject: async ({ params, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/login')
		}

		const id = params.id
		locals.moderationService.updateModerationStatus(id, ModerationStatus.REJECTED, locals.user.id)
		locals.moderationService.deleteModerationQueueItem(id)
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
