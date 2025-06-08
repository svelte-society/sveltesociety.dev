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
		throw redirect(302, '/admin/moderation')
	}

	const submitter = locals.userService.getUser(item.submitted_by)

	if (!submitter) {
		throw error(404, 'Submitter not found')
	}

	const role = locals.roleService.getRoleById(submitter.role)
	
	// Parse submission data to get tag IDs
	const submissionData = JSON.parse(item.data)
	
	// Fetch all tags and create a map of ID to name
	const allTags = locals.tagService.getTags({ limit: 100 })
	const tagMap = new Map(allTags.map(tag => [tag.id, tag.name]))
	
	// Map tag IDs to names
	if (submissionData.tags && Array.isArray(submissionData.tags)) {
		submissionData.tagNames = submissionData.tags.map(tagId => tagMap.get(tagId) || tagId)
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
			throw redirect(302, '/login')
		}

		const id = params.id
		const item = locals.moderationService.getModerationQueueItem(id)

		if (!item) {
			throw error(404, 'Moderation item not found')
		}

		// Parse the submission data
		const submissionData = JSON.parse(item.data)

		// Generate slug from title (or fallback for imported content)
		const slug = (submissionData.title || `${item.type}-${Date.now()}`)
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.trim()

		try {
			let contentId: string

			// Handle type-specific imports using external content services
			if (item.type === 'video' && submissionData.url) {
				// Extract YouTube video ID from URL
				const videoIdMatch = submissionData.url.match(
					/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
				)
				const videoId = videoIdMatch ? videoIdMatch[1] : null

				console.log('Processing video approval:', {
					url: submissionData.url,
					videoId,
					hasApiKey: !!process.env.YOUTUBE_API_KEY
				})

				if (videoId) {
					// Use YouTube importer for rich metadata
					const youtubeImporter = new YouTubeImporter(
						locals.externalContentService,
						locals.cacheService
					)
					const importedContentId = await youtubeImporter.importVideo(videoId, item.submitted_by)

					if (importedContentId) {
						contentId = importedContentId

						// Update the imported content with moderation metadata
						const importedContent = locals.contentService.getContentById(importedContentId)
						if (importedContent) {
							const updatedMetadata = {
								...importedContent.metadata,
								imported_from_moderation: true,
								moderated_by: locals.user.id,
								moderated_at: new Date().toISOString(),
								notes: submissionData.notes || ''
							}

							locals.contentService.updateContent(importedContentId, {
								...importedContent,
								title: submissionData.title || importedContent.title, // Use submitted title or keep imported title
								description: submissionData.description || importedContent.description,
								status: 'draft',
								tags: submissionData.tags || [],
								metadata: updatedMetadata
							})
						}
					} else {
						throw new Error('Failed to import video from YouTube')
					}
				} else {
					throw new Error('Invalid YouTube video URL')
				}
			} else if (item.type === 'library' && submissionData.github_repo) {
				// Parse GitHub repository
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

				// Use GitHub importer for rich metadata
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

					// Update the imported content with moderation metadata
					const importedContent = locals.contentService.getContentById(importedContentId)
					if (importedContent) {
						const updatedMetadata = {
							...importedContent.metadata,
							imported_from_moderation: true,
							moderated_by: locals.user.id,
							moderated_at: new Date().toISOString(),
							notes: submissionData.notes || ''
						}

						locals.contentService.updateContent(importedContentId, {
							...importedContent,
							title: submissionData.title || importedContent.title, // Use submitted title or keep imported title
							description: submissionData.description || importedContent.description,
							status: 'draft',
							tags: submissionData.tags || [],
							metadata: updatedMetadata
						})
					}
				} else {
					throw new Error('Failed to import repository from GitHub')
				}
			} else {
				// Handle other content types (recipe, link) with standard content creation
				const contentData = {
					title: submissionData.title || 'Untitled',
					slug: slug,
					description: submissionData.description || '',
					type: item.type,
					status: 'draft', // Set as draft when approved
					tags: submissionData.tags || [],
					author_id: item.submitted_by,
					metadata: {
						imported_from_moderation: true,
						moderated_by: locals.user.id,
						moderated_at: new Date().toISOString(),
						notes: submissionData.notes || ''
					}
				}

				if (item.type === 'link' && submissionData.url) {
					contentData.body = submissionData.url
					contentData.metadata = {
						...contentData.metadata,
						url: submissionData.url
					}
				} else if (item.type === 'recipe' && submissionData.body) {
					contentData.body = submissionData.body
				} else {
					// Fallback
					contentData.body =
						submissionData.body || submissionData.url || submissionData.github_repo || ''
				}

				// Create the content using standard content service
				contentId = locals.contentService.addContent(contentData)
			}

			// Update moderation status to approved and then delete from queue
			locals.moderationService.updateModerationStatus(id, ModerationStatus.APPROVED, locals.user.id)
			locals.moderationService.deleteModerationQueueItem(id)

			console.log(`Created content ${contentId} from moderation item ${id} and removed from queue`)
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
