import { json, error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { z } from 'zod'
import { YouTubeImporter } from '$lib/server/services/importers/youtube'
import { GitHubImporter } from '$lib/server/services/importers/github'

// Schema for bulk import request
const bulkImportSchema = z.object({
	urls: z
		.array(z.string())
		.min(1, 'At least one URL is required')
		.max(50, 'Maximum 50 URLs allowed'),
	// Optional settings
	options: z
		.object({
			skipExisting: z.boolean().default(true), // Skip URLs that are already imported
			batchSize: z.number().min(1).max(10).default(5) // Process in batches to avoid rate limits
		})
		.optional()
})

// Type for import results
interface ImportResult {
	url: string
	success: boolean
	contentId?: string
	error?: string
	type?: 'youtube' | 'github'
}

export const POST: RequestHandler = async ({ request, locals }) => {
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

	try {
		const body = await request.json()
		const validation = bulkImportSchema.safeParse(body)

		if (!validation.success) {
			throw error(400, validation.error.errors[0].message)
		}

		const { urls, options = { skipExisting: true, batchSize: 5 } } = validation.data
		const results: ImportResult[] = []

		// Patterns for detecting content type
		const youtubePattern =
			/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
		const videoIdPattern = /^[a-zA-Z0-9_-]{11}$/
		const githubPattern = /^https?:\/\/github\.com\/([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+)/
		const repoPattern = /^[a-zA-Z0-9-_.]+\/[a-zA-Z0-9-_.]+$/

		// Process URLs in batches
		for (let i = 0; i < urls.length; i += options.batchSize) {
			const batch = urls.slice(i, i + options.batchSize)

			// Process batch concurrently
			const batchResults = await Promise.all(
				batch.map(async (url) => {
					const result: ImportResult = { url, success: false }

					try {
						// Detect content type
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

						// Handle YouTube import
						if (contentType === 'youtube') {
							let videoId = url

							// Extract video ID from URL if needed
							const urlMatch = url.match(youtubePattern)
							if (urlMatch) {
								videoId = urlMatch[1]
							}

							// Check if already exists
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

						// Handle GitHub import
						if (contentType === 'github') {
							let owner: string, repo: string

							// Extract owner and repo from URL or direct format
							const urlMatch = url.match(githubPattern)
							if (urlMatch) {
								owner = urlMatch[1]
								repo = urlMatch[2].replace(/\.git$/, '') // Remove .git suffix if present
							} else {
								// Assume owner/repo format
								;[owner, repo] = url.split('/')
							}

							// Check if already exists
							if (options.skipExisting) {
								const externalId = `${owner}/${repo}`
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
							const contentId = await importer.importRepository(owner, repo)

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
