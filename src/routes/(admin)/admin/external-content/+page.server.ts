import type { PageServerLoad, Actions } from './$types'
import { fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'
import { zod4 } from 'sveltekit-superforms/adapters'
import { z } from 'zod/v4'
import { YouTubeImporter } from '$lib/server/services/importers/youtube'
import { GitHubImporter } from '$lib/server/services/importers/github'

const importSchema = z.object({
	url: z
		.string()
		.min(1, 'URL is required')
		.refine((val) => {
			const youtubePattern =
				/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
			const githubPattern = /^https?:\/\/github\.com\/([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+)/
			const videoIdPattern = /^[a-zA-Z0-9_-]{11}$/
			const repoPattern = /^[a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+$/

			return (
				youtubePattern.test(val) ||
				githubPattern.test(val) ||
				videoIdPattern.test(val) ||
				repoPattern.test(val)
			)
		}, 'Must be a YouTube URL, GitHub URL, YouTube video ID, or GitHub owner/repo format')
})

export const load: PageServerLoad = async ({ locals }) => {
	const youtubeContent = locals.externalContentService.getContentBySource('youtube')
	const githubContent = locals.externalContentService.getContentBySource('github')

	const importForm = await superValidate(zod4(importSchema))

	return {
		importForm,
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
	import: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { error: 'Authentication required' })
		}

		const form = await superValidate(request, zod4(importSchema))

		if (!form.valid) {
			return fail(400, { form })
		}

		const url = form.data.url

		const youtubePattern =
			/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
		const videoIdPattern = /^[a-zA-Z0-9_-]{11}$/
		const githubPattern = /^https?:\/\/github\.com\/([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+)/
		const repoPattern = /^[a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+$/

		if (youtubePattern.test(url) || videoIdPattern.test(url)) {
			try {
				let videoId = url

				const urlMatch = url.match(youtubePattern)
				if (urlMatch) {
					videoId = urlMatch[1]
				}

				const importer = new YouTubeImporter(locals.externalContentService, locals.cacheService)
				const contentId = await importer.importVideo(videoId, locals.user.id)

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
		}

		if (githubPattern.test(url) || repoPattern.test(url)) {
			try {
				let owner: string, repo: string

				const urlMatch = url.match(githubPattern)
				if (urlMatch) {
					owner = urlMatch[1]
					repo = urlMatch[2].replace(/\.git$/, '')
				} else {
					;[owner, repo] = url.split('/')
				}

				const importer = new GitHubImporter(locals.externalContentService, locals.cacheService)
				const contentId = await importer.importRepository(owner, repo, locals.user.id)

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
					error:
						'Failed to import GitHub repository. The repository may not exist or may be private.'
				})
			}
		}

		return fail(400, {
			error: 'Invalid URL format'
		})
	},

	deleteContent: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { error: 'Authentication required' })
		}

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
