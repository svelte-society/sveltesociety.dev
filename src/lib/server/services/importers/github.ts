import type { CacheService } from '../cache'
import type { ExternalContentService, ExternalContentData } from '../external-content'

import fs from 'node:fs'
import path from 'node:path'

const { STATE_DIRECTORY = '.state_directory' } = process.env

interface GitHubRepository {
	id: number
	node_id: string
	name: string
	full_name: string
	description: string | null
	html_url: string
	homepage: string | null
	language: string | null
	stargazers_count: number
	watchers_count: number
	forks_count: number
	open_issues_count: number
	topics: string[]
	created_at: string
	updated_at: string
	pushed_at: string
	default_branch: string
	owner: {
		login: string
		avatar_url: string
		html_url: string
	}
}

interface GitHubReadme {
	content: string
	encoding: string
}

export class GitHubImporter {
	private apiBaseUrl = 'https://api.github.com'
	private token?: string

	constructor(
		private externalContentService: ExternalContentService,
		private cacheService?: CacheService,
		token?: string
	) {
		this.token = token || process.env.GITHUB_TOKEN
	}

	/**
	 * Import a single repository by owner/repo
	 */
	async importRepository(owner: string, repo: string, authorId?: string): Promise<string | null> {
		const repository = await this.fetchRepository(owner, repo)
		if (!repository) return null

		const readme = await this.fetchReadme(owner, repo)
		const contentData = this.transformRepositoryToContent(repository, readme)

		if (authorId) {
			contentData.author_id = authorId
		}

		let response

		try {
			response = await fetch(contentData.metadata.ogImage)
		} catch (error) {
			console.error(error)
		}

		if (!response || !response.headers.get('content-type')?.includes('image')) {
			const message =
				'Failed to download OG image. Rate limit exceeded: ' + contentData.metadata.ogImage

			console.error(message)

			throw new Error(message)
		}

		const dir = path.join(STATE_DIRECTORY, 'files', 'gh', owner, repo)
		const extension = response.headers.get('content-type')?.split('/').at(-1)
		const file_path = path.join(dir, 'thumbnail.' + extension)

		fs.mkdirSync(dir, { recursive: true })
		fs.writeFileSync(file_path, Buffer.from(await response.arrayBuffer()))

		const thumbnail = path.join('/files', 'gh', owner, repo, 'thumbnail.' + extension)
		contentData.metadata.thumbnail = thumbnail

		console.log('Successfully downloaded OG image: ' + contentData.metadata.ogImage)

		return this.externalContentService.upsertExternalContent(contentData)
	}

	/**
	 * Fetch repository information
	 */
	private async fetchRepository(owner: string, repo: string): Promise<GitHubRepository | null> {
		if (this.cacheService) {
			return this.cacheService.cachify({
				key: `github:repo:${owner}:${repo}`,
				getFreshValue: () => this.fetchRepositoryDirectly(owner, repo),
				ttl: 60 * 60 * 1000, // 1 hour
				swr: 60 * 60 * 1000 * 24 // 24 hours
			})
		}
		return this.fetchRepositoryDirectly(owner, repo)
	}

	private async fetchRepositoryDirectly(
		owner: string,
		repo: string
	): Promise<GitHubRepository | null> {
		try {
			const headers: HeadersInit = {
				Accept: 'application/vnd.github.v3+json',
				'User-Agent': 'SvelteSociety-Importer'
			}

			if (this.token) {
				headers['Authorization'] = `Bearer ${this.token}`
			}

			const response = await fetch(`${this.apiBaseUrl}/repos/${owner}/${repo}`, { headers })

			if (!response.ok) {
				console.error(`Failed to fetch repository ${owner}/${repo}: ${response.statusText}`)
				return null
			}

			return response.json()
		} catch (error) {
			console.error('Error fetching repository:', error)
			return null
		}
	}

	/**
	 * Fetch README content
	 */
	private async fetchReadme(owner: string, repo: string): Promise<string | null> {
		try {
			const headers: HeadersInit = {
				Accept: 'application/vnd.github.v3+json',
				'User-Agent': 'SvelteSociety-Importer'
			}

			if (this.token) {
				headers['Authorization'] = `Bearer ${this.token}`
			}

			const response = await fetch(`${this.apiBaseUrl}/repos/${owner}/${repo}/readme`, { headers })

			if (!response.ok) {
				return null
			}

			const data: GitHubReadme = await response.json()

			// Decode base64 content
			if (data.encoding === 'base64') {
				return atob(data.content)
			}

			return data.content
		} catch (error) {
			console.error('Error fetching README:', error)
			return null
		}
	}

	/**
	 * Transform GitHub repository to external content data
	 */
	private transformRepositoryToContent(
		repo: GitHubRepository,
		readme: string | null
	): ExternalContentData {
		// Extract package name from package.json if possible (would need additional API call)
		// For now, use repository name
		const npmPackage = this.guessNpmPackage(repo)

		// Generate a hash based on the last update time for cache busting
		// This ensures we get a fresh OG image when the repo is updated
		const ogImageHash = this.generateOGImageHash(repo.updated_at)
		const ogImageUrl = `https://opengraph.githubassets.com/${ogImageHash}/${repo.owner.login}/${repo.name}`

		return {
			title: repo.name,
			description: repo.description || `GitHub repository: ${repo.full_name}`,
			body: readme || '',
			type: 'library',
			metadata: {
				// Standard library metadata
				npm: npmPackage,
				github: repo.html_url,
				homepage: repo.homepage || repo.html_url,

				// GitHub-specific metadata
				stars: repo.stargazers_count,
				forks: repo.forks_count,
				issues: repo.open_issues_count,
				language: repo.language,
				topics: repo.topics,
				owner: {
					name: repo.owner.login,
					url: repo.owner.html_url,
					avatar: repo.owner.avatar_url
				},
				defaultBranch: repo.default_branch,
				createdAt: repo.created_at,
				updatedAt: repo.updated_at,
				pushedAt: repo.pushed_at,
				ogImage: ogImageUrl
			},
			tags: [], // Don't auto-assign GitHub topics as tags - they need to be mapped to tag IDs
			source: {
				type: 'library',
				source: 'github',
				externalId: repo.full_name, // Use full_name (owner/repo) as external ID for consistency
				url: repo.html_url,
				lastFetched: new Date().toISOString(),
				lastModified: repo.updated_at
			},
			publishedAt: repo.created_at
		}
	}

	/**
	 * Generate a hash for the OG image URL based on the update time
	 * This ensures cache busting when the repository is updated
	 */
	private generateOGImageHash(updatedAt: string): string {
		// Convert the updated timestamp to a hash-like string
		// Using a simple approach: convert timestamp to base36 and pad
		const timestamp = new Date(updatedAt).getTime()
		const hash = timestamp.toString(36).padStart(12, '0')
		return hash
	}

	/**
	 * Try to guess the npm package name from repository info
	 */
	private guessNpmPackage(repo: GitHubRepository): string | undefined {
		// Common patterns for Svelte-related packages
		if (repo.full_name.startsWith('sveltejs/')) {
			// Official Svelte packages
			if (repo.name === 'svelte') return 'svelte'
			if (repo.name === 'kit') return '@sveltejs/kit'
			return `@sveltejs/${repo.name}`
		}

		// For now, return undefined for other repos
		// Could be enhanced to fetch package.json and extract the name
		return undefined
	}
}
