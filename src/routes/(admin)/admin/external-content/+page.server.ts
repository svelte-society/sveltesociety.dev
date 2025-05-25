import type { PageServerLoad, Actions } from './$types'
import { fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'
import { YouTubeImporter } from '$lib/server/services/importers/youtube'
import { GitHubImporter } from '$lib/server/services/importers/github'

// Schema for YouTube video import
const youtubeSchema = z.object({
	videoId: z.string().min(1, 'Video ID or URL is required')
})

// Schema for GitHub repository import
const githubSchema = z.object({
	repository: z.string().min(1, 'Repository is required').regex(/^[a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+$/, 'Must be in format: owner/repo')
})

export const load: PageServerLoad = async ({ locals }) => {
	// Get content from various external sources
	const youtubeContent = locals.externalContentService.getContentBySource('youtube')
	const githubContent = locals.externalContentService.getContentBySource('github')

	// Initialize forms
	const youtubeForm = await superValidate(zod(youtubeSchema))
	const githubForm = await superValidate(zod(githubSchema))

	return {
		youtubeForm,
		githubForm,
		sources: [
			{
				name: 'YouTube Videos',
				source: 'youtube',
				count: youtubeContent.length,
				lastSync: youtubeContent[0]?.metadata?.externalSource?.lastFetched
			},
			{
				name: 'GitHub Repositories',
				source: 'github', 
				count: githubContent.length,
				lastSync: githubContent[0]?.metadata?.externalSource?.lastFetched
			}
		],
		recentImports: [...youtubeContent, ...githubContent]
			.sort((a, b) => {
				const aDate = new Date(a.created_at || 0).getTime()
				const bDate = new Date(b.created_at || 0).getTime()
				return bDate - aDate
			})
			.slice(0, 10)
	}
}

export const actions = {
	importYouTubeVideo: async ({ request, locals }) => {
		const form = await superValidate(request, zod(youtubeSchema))

		if (!form.valid) {
			return fail(400, { form })
		}

		try {
			let videoId = form.data.videoId

			// Extract video ID from URL if a full URL was provided
			const urlMatch = videoId.match(
				/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
			)
			if (urlMatch) {
				videoId = urlMatch[1]
			}

			const importer = new YouTubeImporter(locals.externalContentService, locals.cacheService)

			const contentId = await importer.importVideo(videoId)

			return {
				form,
				success: true,
				contentId,
				stats: {
					created: contentId ? 1 : 0,
					updated: 0,
					deleted: 0
				}
			}
		} catch (error) {
			console.error('Error importing YouTube video:', error)
			return fail(500, {
				error: 'Failed to import YouTube video. Make sure you have a valid API key.'
			})
		}
	},

	importGitHubRepository: async ({ request, locals }) => {
		const form = await superValidate(request, zod(githubSchema))

		if (!form.valid) {
			return fail(400, { form })
		}

		try {
			const [owner, repo] = form.data.repository.split('/')
			
			const importer = new GitHubImporter(
				locals.externalContentService,
				locals.cacheService
			)

			const contentId = await importer.importRepository(owner, repo)

			return {
				form,
				success: true,
				contentId,
				stats: {
					created: contentId ? 1 : 0,
					updated: 0,
					deleted: 0
				}
			}
		} catch (error) {
			console.error('Error importing GitHub repository:', error)
			return fail(500, {
				error: 'Failed to import GitHub repository. The repository may not exist or may be private.'
			})
		}
	},

	deleteContent: async ({ request, locals }) => {
		try {
			const data = await request.formData()
			const contentId = data.get('contentId') as string

			if (!contentId) {
				return fail(400, {
					error: 'Content ID is required'
				})
			}

			locals.contentService.deleteContent(contentId)

			return {
				success: true,
				stats: {
					created: 0,
					updated: 0,
					deleted: 1
				}
			}
		} catch (error) {
			console.error('Error deleting content:', error)
			return fail(500, {
				error: 'Failed to delete content'
			})
		}
	}
} satisfies Actions
