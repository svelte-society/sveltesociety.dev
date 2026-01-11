import { json, error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { z } from 'zod'
import { YouTubeImporter } from '$lib/server/services/importers/youtube'
import { GitHubImporter } from '$lib/server/services/importers/github'

const bulkImportSchema = z.object({
	urls: z
		.array(z.string())
		.min(1, 'At least one URL is required')
		.max(50, 'Maximum 50 URLs allowed'),
	options: z
		.object({
			skipExisting: z.boolean().default(true),
			batchSize: z.number().min(1).max(10).default(5)
		})
		.optional()
})

interface ImportResult {
	url: string
	success: boolean
	contentId?: string
	error?: string
	type?: 'youtube' | 'github'
}

export const POST: RequestHandler = async ({ request, locals }) => {
	const authHeader = request.headers.get('Authorization')
	const apiKey = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

	const validApiKey = import.meta.env.VITE_BULK_IMPORT_API_KEY || process.env.BULK_IMPORT_API_KEY
	const isApiKeyValid = validApiKey && apiKey === validApiKey

	if (!isApiKeyValid) {
		if (!locals.user) {
			throw error(401, 'Unauthorized - API key or authentication required')
		}

		const userRole = locals.roleService.getRoleById(locals.user.role)
		const isAuthorized =
			userRole && userRole.active && (userRole.value === 'admin' || userRole.value === 'moderator')

		if (!isAuthorized) {
			throw error(403, 'Forbidden')
		}
	}

	try {
		const body = await request.json()
		const validation = bulkImportSchema.safeParse(body)

		if (!validation.success) {
			throw error(400, validation.error.errors[0].message)
		}

		const { urls, options = { skipExisting: true, batchSize: 5 } } = validation.data
		const results: ImportResult[] = []

		const youtubePattern =
			/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
		const videoIdPattern = /^[a-zA-Z0-9_-]{11}$/
		const githubPattern =
			/^https?:\/\/github\.com\/([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+)(?:\/tree\/[^/]+\/(.+))?/
		const repoPattern = /^[a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+(?:\/(.+))?$/

		for (let i = 0; i < urls.length; i += options.batchSize) {
			const batch = urls.slice(i, i + options.batchSize)

			const batchResults = await Promise.all(
				batch.map(async (url) => {
					const result: ImportResult = { url, success: false }

					try {
						let contentType: 'youtube' | 'github' | null = null

						if (youtubePattern.test(url) || videoIdPattern.test(url)) {
							contentType = 'youtube'
						} else if (githubPattern.test(url) || repoPattern.test(url)) {
							contentType = 'github'
						}

						if (!contentType) {
							result.error = 'Invalid URL format'
							return result
						}

						result.type = contentType

						if (contentType === 'youtube') {
							let videoId = url

							const urlMatch = url.match(youtubePattern)
							if (urlMatch) {
								videoId = urlMatch[1]
							}

							if (options.skipExisting) {
								const existing = locals.externalContentService.getContentByExternalId(
									'youtube',
									videoId
								)
								if (existing) {
									result.success = true
									result.contentId = existing.id
									result.error = 'Already imported'
									return result
								}
							}

							const importer = new YouTubeImporter(
								locals.externalContentService,
								locals.cacheService
							)
							const contentId = await importer.importVideo(videoId)

							if (contentId) {
								result.success = true
								result.contentId = contentId
							} else {
								result.error = 'Failed to import video'
							}
						}

						if (contentType === 'github') {
							let owner: string, repo: string, packagePath: string | undefined

							const urlMatch = url.match(githubPattern)
							if (urlMatch) {
								owner = urlMatch[1]
								repo = urlMatch[2].replace(/\.git$/, '')
								packagePath = urlMatch[3] // Extract path from URL (e.g., /tree/main/packages/kit)
							} else {
								const repoMatch = url.match(repoPattern)
								if (repoMatch) {
									const parts = url.split('/')
									owner = parts[0]
									repo = parts[1]
									// Everything after owner/repo is the package path
									packagePath = parts.slice(2).join('/')
									if (packagePath === '') packagePath = undefined
								} else {
									result.error = 'Invalid GitHub repository format'
									return result
								}
							}

							// Build external ID including package path if present
							const externalId = packagePath
								? `${owner}/${repo}/${packagePath}`
								: `${owner}/${repo}`

							if (options.skipExisting) {
								const existing = locals.externalContentService.getContentByExternalId(
									'github',
									externalId
								)
								if (existing) {
									result.success = true
									result.contentId = existing.id
									result.error = 'Already imported'
									return result
								}
							}

							const importer = new GitHubImporter(
								locals.externalContentService,
								locals.cacheService
							)
							const contentId = await importer.importRepository(owner, repo, undefined, packagePath)

							if (contentId) {
								result.success = true
								result.contentId = contentId
							} else {
								result.error = 'Failed to import repository'
							}
						}
					} catch (err) {
						console.error(`Error importing ${url}:`, err)
						result.error = err instanceof Error ? err.message : 'Unknown error'
					}

					return result
				})
			)

			results.push(...batchResults)

			// Add a small delay between batches to avoid rate limiting
			if (i + options.batchSize < urls.length) {
				await new Promise((resolve) => setTimeout(resolve, 1000))
			}
		}

		// Calculate summary statistics
		const summary = {
			total: results.length,
			successful: results.filter((r) => r.success && !r.error?.includes('Already imported')).length,
			failed: results.filter((r) => !r.success).length,
			skipped: results.filter((r) => r.error?.includes('Already imported')).length,
			byType: {
				youtube: results.filter((r) => r.type === 'youtube').length,
				github: results.filter((r) => r.type === 'github').length
			}
		}

		return json({
			success: true,
			summary,
			results
		})
	} catch (err) {
		console.error('Bulk import error:', err)

		if (err instanceof Error && 'status' in err) {
			throw err
		}

		throw error(500, 'Failed to process bulk import')
	}
}

// GET endpoint to check the status/availability of the bulk import service
export const GET: RequestHandler = async ({ locals }) => {
	// Check if user is authenticated
	if (!locals.user) {
		throw error(401, 'Unauthorized')
	}

	// Check if user has admin or moderator role
	const userRole = locals.roleService.getRoleById(locals.user.role)
	const isAuthorized =
		userRole && userRole.active && (userRole.value === 'admin' || userRole.value === 'moderator')

	if (!isAuthorized) {
		throw error(403, 'Forbidden')
	}

	return json({
		available: true,
		limits: {
			maxUrls: 50,
			maxBatchSize: 10,
			supportedTypes: ['youtube', 'github']
		},
		authentication: {
			youtube: !!process.env.YOUTUBE_API_KEY || !!import.meta.env.VITE_YOUTUBE_API_KEY,
			github: !!process.env.GITHUB_TOKEN || !!import.meta.env.VITE_GITHUB_TOKEN
		}
	})
}
