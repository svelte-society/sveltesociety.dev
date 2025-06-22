import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url, locals }) => {
	// Require authentication
	if (!locals.user) {
		return json({ error: 'Authentication required' }, { status: 401 })
	}

	const repoInput = url.searchParams.get('repo')

	if (!repoInput) {
		return json({ error: 'Repo parameter is required' }, { status: 400 })
	}

	// Parse GitHub repository info
	let owner: string, repo: string

	// Handle GitHub URL format
	const urlPattern = /^https?:\/\/github\.com\/([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+)/
	const urlMatch = repoInput.match(urlPattern)
	if (urlMatch) {
		owner = urlMatch[1]
		repo = urlMatch[2].replace(/\.git$/, '')
	} else {
		// Handle owner/repo format
		const repoPattern = /^([a-zA-Z0-9-_.]+)\/([a-zA-Z0-9-_.]+)$/
		const repoMatch = repoInput.match(repoPattern)
		if (repoMatch) {
			owner = repoMatch[1]
			repo = repoMatch[2]
		} else {
			return json({ error: 'Invalid GitHub repository format' }, { status: 400 })
		}
	}

	const repoId = `${owner}/${repo}`

	// Check if already exists
	const existingContent = locals.externalContentService.getContentByExternalId('github', repoId)
	if (existingContent) {
		return json({
			exists: true,
			content: {
				id: existingContent.id,
				title: existingContent.title,
				status: existingContent.status,
				url:
					existingContent.status === 'published'
						? `/${existingContent.type}/${existingContent.slug}`
						: null
			}
		})
	}

	// Fetch metadata from GitHub API
	try {
		const headers: HeadersInit = {
			Accept: 'application/vnd.github.v3+json',
			'User-Agent': 'SvelteSociety'
		}

		if (process.env.GITHUB_TOKEN) {
			headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`
		}

		const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers })

		if (!response.ok) {
			if (response.status === 404) {
				return json({ error: 'Repository not found' }, { status: 404 })
			}
			throw new Error('Failed to fetch repository data')
		}

		const repoData = await response.json()

		// Fetch README
		let readme = ''
		try {
			const readmeResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
				headers: { ...headers, Accept: 'application/vnd.github.v3.raw' }
			})
			if (readmeResponse.ok) {
				readme = await readmeResponse.text()
				// Truncate for preview
				readme = readme.substring(0, 500) + '...'
			}
		} catch (e) {
			// README is optional
		}

		return json({
			exists: false,
			preview: {
				title: repoData.name,
				description: repoData.description || 'No description provided',
				readme: readme,
				owner: repoData.owner.login,
				stars: repoData.stargazers_count,
				language: repoData.language,
				topics: repoData.topics || [],
				homepage: repoData.homepage,
				updatedAt: repoData.updated_at,
				avatarUrl: repoData.owner.avatar_url
			}
		})
	} catch (error) {
		console.error('Error fetching GitHub preview:', error)
		return json({ error: 'Failed to fetch repository preview' }, { status: 500 })
	}
}
