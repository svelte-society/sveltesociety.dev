import type { ExternalContentService, ExternalContentData } from '../external-content'
import type { CacheService } from '../cache'

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
	async importRepository(owner: string, repo: string): Promise<string | null> {
		const repository = await this.fetchRepository(owner, repo)
		if (!repository) return null

		const readme = await this.fetchReadme(owner, repo)
		const contentData = this.transformRepositoryToContent(repository, readme)
		return this.externalContentService.upsertExternalContent(contentData)
	}

	/**
	 * Import multiple repositories from a user or organization
	 */
	async importUserRepositories(username: string, options?: { 
		maxRepos?: number 
		filterTopics?: string[]
		minStars?: number
	}): Promise<string[]> {
		const repositories = await this.fetchUserRepositories(username)
		let filteredRepos = repositories

		// Apply filters
		if (options?.filterTopics && options.filterTopics.length > 0) {
			filteredRepos = filteredRepos.filter(repo => 
				repo.topics.some(topic => options.filterTopics!.includes(topic))
			)
		}

		if (options?.minStars) {
			filteredRepos = filteredRepos.filter(repo => 
				repo.stargazers_count >= options.minStars!
			)
		}

		if (options?.maxRepos) {
			filteredRepos = filteredRepos.slice(0, options.maxRepos)
		}

		const importedIds: string[] = []
		for (const repo of filteredRepos) {
			const readme = await this.fetchReadme(repo.owner.login, repo.name)
			const contentData = this.transformRepositoryToContent(repo, readme)
			const id = await this.externalContentService.upsertExternalContent(contentData)
			if (id) importedIds.push(id)
		}

		return importedIds
	}

	/**
	 * Fetch repository information
	 */
	private async fetchRepository(owner: string, repo: string): Promise<GitHubRepository | null> {
		if (this.cacheService) {
			return this.cacheService.cachify({
				key: `github:repo:${owner}:${repo}`,
				getFreshValue: () => this._fetchRepositoryDirectly(owner, repo),
				ttl: 60 * 60 * 1000, // 1 hour
				swr: 60 * 60 * 1000 * 24 // 24 hours
			})
		}
		return this._fetchRepositoryDirectly(owner, repo)
	}

	private async _fetchRepositoryDirectly(owner: string, repo: string): Promise<GitHubRepository | null> {
		try {
			const headers: HeadersInit = {
				'Accept': 'application/vnd.github.v3+json',
				'User-Agent': 'SvelteSociety-Importer'
			}

			if (this.token) {
				headers['Authorization'] = `Bearer ${this.token}`
			}

			const response = await fetch(
				`${this.apiBaseUrl}/repos/${owner}/${repo}`,
				{ headers }
			)

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
	 * Fetch repositories for a user or organization
	 */
	private async fetchUserRepositories(username: string): Promise<GitHubRepository[]> {
		if (this.cacheService) {
			return this.cacheService.cachify({
				key: `github:user:${username}:repos`,
				getFreshValue: () => this._fetchUserRepositoriesDirectly(username),
				ttl: 60 * 60 * 1000, // 1 hour
				swr: 60 * 60 * 1000 * 24 // 24 hours
			})
		}
		return this._fetchUserRepositoriesDirectly(username)
	}

	private async _fetchUserRepositoriesDirectly(username: string): Promise<GitHubRepository[]> {
		try {
			const headers: HeadersInit = {
				'Accept': 'application/vnd.github.v3+json',
				'User-Agent': 'SvelteSociety-Importer'
			}

			if (this.token) {
				headers['Authorization'] = `Bearer ${this.token}`
			}

			// Try organization endpoint first, fall back to user endpoint
			let response = await fetch(
				`${this.apiBaseUrl}/orgs/${username}/repos?per_page=100&sort=updated`,
				{ headers }
			)

			if (!response.ok) {
				response = await fetch(
					`${this.apiBaseUrl}/users/${username}/repos?per_page=100&sort=updated`,
					{ headers }
				)
			}

			if (!response.ok) {
				console.error(`Failed to fetch repositories for ${username}: ${response.statusText}`)
				return []
			}

			return response.json()
		} catch (error) {
			console.error('Error fetching user repositories:', error)
			return []
		}
	}

	/**
	 * Fetch README content
	 */
	private async fetchReadme(owner: string, repo: string): Promise<string | null> {
		try {
			const headers: HeadersInit = {
				'Accept': 'application/vnd.github.v3+json',
				'User-Agent': 'SvelteSociety-Importer'
			}

			if (this.token) {
				headers['Authorization'] = `Bearer ${this.token}`
			}

			const response = await fetch(
				`${this.apiBaseUrl}/repos/${owner}/${repo}/readme`,
				{ headers }
			)

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
	private transformRepositoryToContent(repo: GitHubRepository, readme: string | null): ExternalContentData {
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
			tags: repo.topics || [],
			source: {
				type: 'library',
				source: 'github',
				externalId: repo.node_id,
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