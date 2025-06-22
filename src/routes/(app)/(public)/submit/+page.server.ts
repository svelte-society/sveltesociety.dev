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
): { owner: string; repo: string } | { owner: null; repo: null } {
	const urlPattern = /^https?:\/\/github\.com\/([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+)/
	const urlMatch = input.match(urlPattern)
	if (urlMatch) {
		return {
			owner: urlMatch[1],
			repo: urlMatch[2].replace(/\.git$/, '') // Remove .git suffix if present
		}
	}

	const repoPattern = /^([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+)$/
	const repoMatch = input.match(repoPattern)
	if (repoMatch) {
		return {
			owner: repoMatch[1],
			repo: repoMatch[2]
		}
	}

	return { owner: null, repo: null }
}

export const load = (async ({ locals, url }) => {
	if (!locals.user) {
		throw redirect(302, '/login?redirectTo=' + encodeURIComponent(url.pathname))
	}

	const tags = locals.tagService.getTags({ limit: 50 })

	const form = await superValidate(zod4(schema))

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
				}
			}

			if (form.data.type === 'library' && 'github_repo' in form.data) {
				const { owner, repo } = parseGitHubRepo(form.data.github_repo)
				if (owner && repo) {
					const repoId = `${owner}/${repo}`
					const existingContent = locals.externalContentService.getContentByExternalId(
						'github',
						repoId
					)
					if (existingContent) {
						return message(form, {
							success: false,
							text: `This repository has already been submitted. You can find it <a href="/${existingContent.type}/${existingContent.slug}" class="underline text-blue-600 hover:text-blue-800">here</a>.`
						})
					}
				}
			}

			const submissionData = {
				type: form.data.type,
				title: form.data.title,
				data: JSON.stringify(form.data),
				submitted_by: locals.user.id
			}

			locals.moderationService.addToModerationQueue(submissionData)
		} catch (error) {
			console.error('Error adding content to moderation queue:', error)
		}
		redirect(302, '/submit/thankyou')
	}
} satisfies Actions
