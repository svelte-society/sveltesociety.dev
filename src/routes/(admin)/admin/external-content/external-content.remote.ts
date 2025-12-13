import { form, getRequestEvent, query } from '$app/server'
import { z } from 'zod/v4'
import { checkAdminAuth } from '../authorization.remote'
import { YouTubeImporter } from '$lib/server/services/importers/youtube'
import { GitHubImporter } from '$lib/server/services/importers/github'

const importSchema = z.object({
	url: z
		.string()
		.min(1, 'URL is required')
		.refine((val) => {
			const youtubePattern =
				/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
			const githubPattern =
				/^https?:\/\/github\.com\/([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+)(?:\/tree\/[^/]+\/(.+))?/
			const videoIdPattern = /^[a-zA-Z0-9_-]{11}$/
			const repoPattern = /^[a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+(?:\/(.+))?$/

			return (
				youtubePattern.test(val) ||
				githubPattern.test(val) ||
				videoIdPattern.test(val) ||
				repoPattern.test(val)
			)
		}, 'Must be a YouTube URL, GitHub URL, YouTube video ID, or GitHub owner/repo(/path) format')
})

const deleteSchema = z.object({
	contentId: z.string().min(1, 'Content ID is required')
})

export const getExternalContentData = query(() => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	const youtubeContent = locals.externalContentService.getContentBySource('youtube')
	const githubContent = locals.externalContentService.getContentBySource('github')

	return {
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
})

export const importContent = form(importSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	if (!locals.user) {
		return {
			success: false,
			error: 'Authentication required'
		}
	}

	const url = data.url

	const youtubePattern =
		/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
	const videoIdPattern = /^[a-zA-Z0-9_-]{11}$/
	const githubPattern =
		/^https?:\/\/github\.com\/([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+)(?:\/tree\/[^/]+\/(.+))?/
	const repoPattern = /^[a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+(?:\/(.+))?$/

	if (youtubePattern.test(url) || videoIdPattern.test(url)) {
		try {
			let videoId = url

			const urlMatch = url.match(youtubePattern)
			if (urlMatch) {
				videoId = urlMatch[1]
			}

			const existingContent = locals.externalContentService.getContentByExternalId(
				'youtube',
				videoId
			)
			if (existingContent) {
				return {
					success: false,
					error: `This YouTube video has already been imported. Content ID: ${existingContent.id}`
				}
			}

			const importer = new YouTubeImporter(locals.externalContentService, locals.cacheService)
			const contentId = await importer.importVideo(videoId, locals.user.id)

			return {
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
			return {
				success: false,
				error: 'Failed to import YouTube video. Make sure you have a valid API key.'
			}
		}
	}

	if (githubPattern.test(url) || repoPattern.test(url)) {
		try {
			let owner: string, repo: string, packagePath: string | undefined

			const urlMatch = url.match(githubPattern)
			if (urlMatch) {
				owner = urlMatch[1]
				repo = urlMatch[2].replace(/\.git$/, '')
				packagePath = urlMatch[3]
			} else {
				const repoMatch = url.match(repoPattern)
				if (repoMatch) {
					const parts = url.split('/')
					owner = parts[0]
					repo = parts[1]
					packagePath = parts.slice(2).join('/')
					if (packagePath === '') packagePath = undefined
				} else {
					return {
						success: false,
						error: 'Invalid GitHub repository format'
					}
				}
			}

			const externalId = packagePath ? `${owner}/${repo}/${packagePath}` : `${owner}/${repo}`

			const existingContent = locals.externalContentService.getContentByExternalId(
				'github',
				externalId
			)
			if (existingContent) {
				return {
					success: false,
					error: `This GitHub ${packagePath ? 'package' : 'repository'} has already been imported. Content ID: ${existingContent.id}`
				}
			}

			const importer = new GitHubImporter(locals.externalContentService, locals.cacheService)
			const contentId = await importer.importRepository(owner, repo, locals.user.id, packagePath)

			return {
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
			return {
				success: false,
				error:
					'Failed to import GitHub repository. The repository may not exist or may be private.'
			}
		}
	}

	return {
		success: false,
		error: 'Invalid URL format'
	}
})

export const deleteContent = form(deleteSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	if (!locals.user) {
		return {
			success: false,
			error: 'Authentication required'
		}
	}

	try {
		locals.contentService.deleteContent(data.contentId)

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
		return {
			success: false,
			error: 'Failed to delete content'
		}
	}
})
