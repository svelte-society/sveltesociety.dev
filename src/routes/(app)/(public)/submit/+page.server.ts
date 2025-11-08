import { superValidate, message } from 'sveltekit-superforms/server'
import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { zod4 } from 'sveltekit-superforms/adapters'
import { schema } from './schema'

// Helper function to extract YouTube video ID from URL
function extractYouTubeVideoId(url: string): string | null {
	const patterns = [
		/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
		/^([a-zA-Z0-9_-]{11})$/ // Direct video ID
	]

	for (const pattern of patterns) {
		const match = url.match(pattern)
		if (match) {
			return match[1]
		}
	}

	return null
}

// Helper function to parse GitHub repository information
function parseGitHubRepo(
	input: string
): { owner: string; repo: string; packagePath?: string } | { owner: null; repo: null; packagePath?: undefined } {
	// Pattern for full GitHub URL with optional package path
	const urlPattern = /^https?:\/\/github\.com\/([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+)(?:\/tree\/[^/]+\/(.+))?/
	const urlMatch = input.match(urlPattern)
	if (urlMatch) {
		return {
			owner: urlMatch[1],
			repo: urlMatch[2].replace(/\.git$/, ''), // Remove .git suffix if present
			packagePath: urlMatch[3] // Optional package path
		}
	}

	// Pattern for short format with optional package path: owner/repo or owner/repo/path
	const repoPattern = /^([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+)(?:\/(.+))?$/
	const repoMatch = input.match(repoPattern)
	if (repoMatch) {
		return {
			owner: repoMatch[1],
			repo: repoMatch[2],
			packagePath: repoMatch[3] // Optional package path
		}
	}

	return { owner: null, repo: null }
}

export const load = (async ({ locals, url }) => {
	if (!locals.user) {
		throw redirect(302, '/login?redirectTo=' + encodeURIComponent(url.pathname))
	}

	const tags = locals.tagService.getTags({ limit: 50 })

	const form = await superValidate(zod4(schema), {
		defaults: {
			tags: []
		}
	})

	return {
		form,
		tags,
		meta: {
			title: 'Submit Content - Svelte Society',
			description: 'Submit your Svelte content to the Svelte Society community',
			url: url.toString()
		}
	}
}) satisfies PageServerLoad

export const actions = {
	submit: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, {
				error: 'Authentication required',
				message: 'You must be logged in to submit content.'
			})
		}

		const form = await superValidate(request, zod4(schema))

		if (!form.valid) {
			return fail(400, { form })
		}

		try {
			let title: string | undefined = undefined

			if (form.data.type === 'video' && 'url' in form.data) {
				const videoId = extractYouTubeVideoId(form.data.url)
				if (videoId) {
					const existingContent = locals.externalContentService.getContentByExternalId(
						'youtube',
						videoId
					)
					if (existingContent) {
						return message(form, {
							success: false,
							text: `This video has already been submitted. You can find it <a href="/${existingContent.type}/${existingContent.slug}" class="underline text-blue-600 hover:text-blue-800">here</a>.`
						})
					}

					// Fetch video title from YouTube API
					try {
						const metadata = await locals.metadataService.fetchYoutubeMetadata(videoId)
						title = metadata.title
					} catch (error) {
						console.error('Error fetching YouTube metadata:', error)
						// Continue without title - will show "<No Title>" in moderation queue
					}
				}
			}

			if (form.data.type === 'library' && 'github_repo' in form.data) {
				const { owner, repo, packagePath } = parseGitHubRepo(form.data.github_repo)
				if (owner && repo) {
					// Build external ID including package path if present
					const externalId = packagePath ? `${owner}/${repo}/${packagePath}` : `${owner}/${repo}`

					const existingContent = locals.externalContentService.getContentByExternalId(
						'github',
						externalId
					)
					if (existingContent) {
						return message(form, {
							success: false,
							text: `This ${packagePath ? 'package' : 'repository'} has already been submitted. You can find it <a href="/${existingContent.type}/${existingContent.slug}" class="underline text-blue-600 hover:text-blue-800">here</a>.`
						})
					}

					// Fetch repository/package title from GitHub API
					try {
						const headers: HeadersInit = {
							Accept: 'application/vnd.github.v3+json',
							'User-Agent': 'SvelteSociety'
						}
						if (process.env.GITHUB_TOKEN) {
							headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`
						}

						// If package path provided, try to get package.json name
						if (packagePath) {
							try {
								const pkgResponse = await fetch(
									`https://api.github.com/repos/${owner}/${repo}/contents/${packagePath}/package.json`,
									{ headers: { ...headers, Accept: 'application/vnd.github.v3.raw' } }
								)
								if (pkgResponse.ok) {
									const packageJson = await pkgResponse.json()
									title = packageJson.name || packagePath.split('/').pop()
								}
							} catch (pkgError) {
								// Fall back to repo name
								title = packagePath.split('/').pop()
							}
						} else {
							// Get repo name
							const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
								headers
							})
							if (response.ok) {
								const repoData = await response.json()
								title = repoData.name
							}
						}
					} catch (error) {
						console.error('Error fetching GitHub metadata:', error)
						// Continue without title - will show "<No Title>" in moderation queue
					}
				}
			}

			// Merge the fetched title into form data
			const submissionData = {
				type: form.data.type,
				data: JSON.stringify({
					...form.data,
					title: title || form.data.title // Use fetched title, fallback to user-provided title (recipes)
				}),
				submitted_by: locals.user.id
			}

			locals.moderationService.addToModerationQueue(submissionData)
		} catch (error) {
			console.error('Error adding content to moderation queue:', error)
		}
		redirect(302, '/submit/thankyou')
	}
} satisfies Actions
