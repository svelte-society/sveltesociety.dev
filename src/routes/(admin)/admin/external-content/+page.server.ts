import type { PageServerLoad, Actions } from './$types'
import { fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'
import { YouTubeImporter } from '$lib/server/services/importers/youtube'

// Schema for YouTube video import
const youtubeSchema = z.object({
	videoId: z.string().min(1, 'Video ID or URL is required')
})

export const load: PageServerLoad = async ({ locals }) => {
	// Get content from various external sources
	const youtubeContent = locals.externalContentService.getContentBySource('youtube')

	// Initialize form for YouTube import
	const youtubeForm = await superValidate(zod(youtubeSchema))

	return {
		youtubeForm,
		sources: [
			{
				name: 'YouTube Videos',
				source: 'youtube',
				count: youtubeContent.length,
				lastSync: youtubeContent[0]?.metadata?.externalSource?.lastFetched
			}
		],
		recentImports: youtubeContent
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
