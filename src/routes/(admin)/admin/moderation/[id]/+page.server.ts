import { ModerationService, ModerationStatus } from '$lib/server/services/moderation'
import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'
import { YouTubeImporter } from '$lib/server/services/importers/youtube'
import { GitHubImporter } from '$lib/server/services/importers/github'

// TODO: Create and import user and role services similarly to how ModerationService is implemented

export const load: PageServerLoad = async ({ params, locals }) => {
	const id = params.id
	const item = locals.moderationService.getModerationQueueItem(id)

	if (!item) {
		redirect(302, '/admin/moderation')
	}

	const submitter = locals.userService.getUser(item.submitted_by)

	if (!submitter) {
		error(404, 'Submitter not found')
	}

	const role = locals.roleService.getRoleById(submitter.role)

	// Parse submission data to get tag IDs
	const submissionData = JSON.parse(item.data)

	// Fetch all tags and create a map of ID to name
	const allTags = locals.tagService.getTags({ limit: 100 })
	const tagMap = new Map(allTags.map((tag) => [tag.id, tag.name]))

	// Map tag IDs to names
	if (submissionData.tags && Array.isArray(submissionData.tags)) {
		submissionData.tagNames = submissionData.tags.map((tagId) => tagMap.get(tagId) || tagId)
	}

	return {
		item: {
			...item,
			parsedData: submissionData
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
		const item = locals.moderationService.getModerationQueueItem(id)

		if (!item) {
			error(404, 'Moderation item not found')
		}

		const submissionData = JSON.parse(item.data)

		const slug = (submissionData.title || `${item.type}-${Date.now()}`)
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.trim()

		try {
			let contentId: string

			if (item.type === 'video' && submissionData.url) {
				const videoIdMatch = submissionData.url.match(
					/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
				)
				const videoId = videoIdMatch ? videoIdMatch[1] : null

				if (videoId) {
					const submitter = locals.userService.getUser(item.submitted_by)
					if (!submitter) {
						console.error('Submitter not found:', item.submitted_by)
						throw new Error('Submitter user not found in database')
					}

					const youtubeImporter = new YouTubeImporter(
						locals.externalContentService,
						locals.cacheService
					)
					const importedContentId = await youtubeImporter.importVideo(videoId, item.submitted_by)

					if (importedContentId) {
						contentId = importedContentId

						const importedContent = locals.contentService.getContentById(importedContentId)
						console.log('Imported content: ', importedContent)
						if (importedContent) {
							const updatedMetadata = {
								...importedContent.metadata,
								imported_from_moderation: true,
								moderated_by: locals.user.id,
								moderated_at: new Date().toISOString(),
								notes: submissionData.notes || ''
							}

							locals.contentService.updateContent({
								...importedContent,
								id: importedContentId,
								title: importedContent.title, // Always use the fetched title from YouTube/GitHub
								description: submissionData.description || importedContent.description,
								status: 'draft',
								tags: submissionData.tags || [],
								metadata: updatedMetadata,
								author_id: item.submitted_by
							})
						}
					} else {
						throw new Error('Failed to import video from YouTube')
					}
				} else {
					throw new Error('Invalid YouTube video URL')
				}
			} else if (item.type === 'library' && submissionData.github_repo) {
				const githubPattern = /^https?:\/\/github\.com\/([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+)/
				const repoPattern = /^([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+)$/

				let owner: string, repo: string

				const urlMatch = submissionData.github_repo.match(githubPattern)
				if (urlMatch) {
					owner = urlMatch[1]
					repo = urlMatch[2].replace(/\.git$/, '') // Remove .git suffix if present
				} else {
					const repoMatch = submissionData.github_repo.match(repoPattern)
					if (repoMatch) {
						owner = repoMatch[1]
						repo = repoMatch[2]
					} else {
						throw new Error('Invalid GitHub repository format')
					}
				}

				const submitter = locals.userService.getUser(item.submitted_by)
				if (!submitter) {
					console.error('Submitter not found:', item.submitted_by)
					throw new Error('Submitter user not found in database')
				}

				const githubImporter = new GitHubImporter(
					locals.externalContentService,
					locals.cacheService
				)
				const importedContentId = await githubImporter.importRepository(
					owner,
					repo,
					item.submitted_by
				)

				if (importedContentId) {
					contentId = importedContentId

					const importedContent = locals.contentService.getContentById(importedContentId)
					if (importedContent) {
						const updatedMetadata = {
							...importedContent.metadata,
							imported_from_moderation: true,
							moderated_by: locals.user.id,
							moderated_at: new Date().toISOString(),
							notes: submissionData.notes || ''
						}

						locals.contentService.updateContent({
							...importedContent,
							id: importedContentId,
							title: importedContent.title, // Always use the fetched title from YouTube/GitHub // Use submitted title or keep imported title
							description: submissionData.description || importedContent.description,
							status: 'draft',
							tags: submissionData.tags || [],
							metadata: updatedMetadata,
							author_id: item.submitted_by
						})
					}
				} else {
					throw new Error('Failed to import repository from GitHub')
				}
			} else {
				const contentData = {
					title: submissionData.title || 'Untitled',
					slug: slug,
					description: submissionData.description || '',
					body: submissionData.body,
					type: item.type,
					status: 'draft',
					tags: submissionData.tags || [],
					author_id: item.submitted_by,
					metadata: {
						imported_from_moderation: true,
						moderated_by: locals.user.id,
						moderated_at: new Date().toISOString(),
						notes: submissionData.notes || ''
					}
				}

				contentId = locals.contentService.addContent(contentData, item.submitted_by)
			}

			// Only update moderation status and delete from queue if content was created successfully
			console.log('Content ID: ', contentId)
			if (contentId) {
				locals.moderationService.updateModerationStatus(
					id,
					ModerationStatus.APPROVED,
					locals.user.id
				)
				locals.moderationService.deleteModerationQueueItem(id)
				console.log(
					`Created content ${contentId} from moderation item ${id} and removed from queue`
				)
			} else {
				throw new Error('Failed to create content - no content ID returned')
			}
		} catch (error) {
			console.error('Error creating content from moderation item:', {
				itemId: id,
				itemType: item.type,
				submissionData,
				error: error instanceof Error ? error.message : error,
				stack: error instanceof Error ? error.stack : undefined
			})
			throw error
		}

		return getNextItem(locals.moderationService, id)
	},
	reject: async ({ params, locals }) => {
		if (!locals.user) {
			redirect(302, '/login')
		}

		const id = params.id
		locals.moderationService.updateModerationStatus(id, ModerationStatus.REJECTED, locals.user.id)
		locals.moderationService.deleteModerationQueueItem(id)
		return getNextItem(locals.moderationService, id)
	}
}

function getNextItem(moderationService: ModerationService, currentId: string) {
	const nextItems = moderationService.getModerationQueuePaginated({
		status: ModerationStatus.PENDING,
		limit: 1,
		offset: 0
	})

	if (nextItems.length > 0 && nextItems[0].id !== currentId) {
		redirect(302, `/admin/moderation/${nextItems[0].id}`)
	}

	redirect(302, '/admin/moderation')
}
