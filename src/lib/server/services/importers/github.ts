import type { CacheService } from '../cache'
import type { ExternalContentService, ExternalContentData } from '../external-content'

import fs from 'node:fs'
import path from 'node:path'
import { uploadThumbnail, getPublicUrl, isS3Enabled } from '../s3-storage'

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

interface PackageJson {
	name?: string
	version?: string
	description?: string
	private?: boolean
	[key: string]: unknown
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
	 * Import a single repository by owner/repo or owner/repo/path/to/package
	 */
	async importRepository(
		owner: string,
		repo: string,
		authorId?: string,
		packagePath?: string
	): Promise<string | null> {
		const repository = await this.fetchRepository(owner, repo)
		if (!repository) return null

		const readme = await this.fetchReadme(owner, repo, packagePath)
		const packageJson = await this.fetchPackageJson(owner, repo, packagePath)
		const contentData = this.transformRepositoryToContent(
			repository,
			readme,
			packageJson,
			packagePath
		)

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
			throw new Error('Failed to fetch image')
		}

		const storagePath = packagePath
			? `${repository.full_name}/${packagePath}`
			: repository.full_name
		const extension = response.headers.get('content-type')?.split('/').at(-1) || 'png'
		const thumbnailBuffer = Buffer.from(await response.arrayBuffer())

		let thumbnailUrl: string

		if (isS3Enabled) {
			// Upload to S3 and get public URL
			const key = `gh/${storagePath}/thumbnail.${extension}`
			thumbnailUrl = await uploadThumbnail(key, thumbnailBuffer, {
				contentType: response.headers.get('content-type') || 'image/png'
			})
		} else {
			// Fallback to local filesystem storage
			const dir = path.join(STATE_DIRECTORY, 'files', 'gh', storagePath)
			const file_path = path.join(dir, 'thumbnail.' + extension)
			fs.mkdirSync(dir, { recursive: true })
			fs.writeFileSync(file_path, thumbnailBuffer)
			thumbnailUrl = path.join('/files', 'gh', storagePath, 'thumbnail.' + extension)
		}

		contentData.metadata.thumbnail = thumbnailUrl

		return this.externalContentService.upsertExternalContent(contentData)
	}

	/**
	 * Import multiple repositories from a user or organization
	 */
	async importUserRepositories(
		username: string,
		options?: {
			maxRepos?: number
			filterTopics?: string[]
			minStars?: number
		}
	): Promise<string[]> {
		const repositories = await this.fetchUserRepositories(username)
		let filteredRepos = repositories

		// Apply filters
		if (options?.filterTopics && options.filterTopics.length > 0) {
			filteredRepos = filteredRepos.filter((repo) =>
				repo.topics.some((topic) => options.filterTopics!.includes(topic))
			)
		}

		if (options?.minStars) {
			filteredRepos = filteredRepos.filter((repo) => repo.stargazers_count >= options.minStars!)
		}

		if (options?.maxRepos) {
			filteredRepos = filteredRepos.slice(0, options.maxRepos)
		}

		const importedIds: string[] = []
		for (const repo of filteredRepos) {
			const readme = await this.fetchReadme(repo.owner.login, repo.name)
			const packageJson = await this.fetchPackageJson(repo.owner.login, repo.name)
			const contentData = this.transformRepositoryToContent(repo, readme, packageJson)
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

	private async _fetchRepositoryDirectly(
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
				Accept: 'application/vnd.github.v3+json',
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
	 * Fetch README content from root or specific package path
	 */
	private async fetchReadme(
		owner: string,
		repo: string,
		packagePath?: string
	): Promise<string | null> {
		try {
			const headers: HeadersInit = {
				Accept: 'application/vnd.github.v3+json',
				'User-Agent': 'SvelteSociety-Importer'
			}

			if (this.token) {
				headers['Authorization'] = `Bearer ${this.token}`
			}

			let response: Response

			if (packagePath) {
				// Try to fetch README from the package directory
				// Common README names: README.md, readme.md, README.MD, Readme.md
				const readmeNames = ['README.md', 'readme.md', 'README.MD', 'Readme.md', 'README']
				let readmeContent: string | null = null

				for (const readmeName of readmeNames) {
					try {
						response = await fetch(
							`${this.apiBaseUrl}/repos/${owner}/${repo}/contents/${packagePath}/${readmeName}`,
							{ headers }
						)

						if (response.ok) {
							const data: GitHubReadme = await response.json()
							if (data.encoding === 'base64') {
								readmeContent = atob(data.content)
							} else {
								readmeContent = data.content
							}
							break
						}
					} catch (error) {
						// Continue to next README name
						continue
					}
				}

				// If no package README found, fall back to root README
				if (!readmeContent) {
					response = await fetch(`${this.apiBaseUrl}/repos/${owner}/${repo}/readme`, { headers })
					if (response.ok) {
						const data: GitHubReadme = await response.json()
						readmeContent = data.encoding === 'base64' ? atob(data.content) : data.content
					}
				}

				return readmeContent
			} else {
				// Fetch root README
				response = await fetch(`${this.apiBaseUrl}/repos/${owner}/${repo}/readme`, { headers })

				if (!response.ok) {
					return null
				}

				const data: GitHubReadme = await response.json()

				// Decode base64 content
				if (data.encoding === 'base64') {
					return atob(data.content)
				}

				return data.content
			}
		} catch (error) {
			console.error('Error fetching README:', error)
			return null
		}
	}

	/**
	 * Fetch package.json content to extract NPM package name
	 */
	private async fetchPackageJson(
		owner: string,
		repo: string,
		packagePath?: string
	): Promise<PackageJson | null> {
		const cacheKey = packagePath
			? `github:package:${owner}:${repo}:${packagePath}`
			: `github:package:${owner}:${repo}`

		if (this.cacheService) {
			return this.cacheService.cachify({
				key: cacheKey,
				getFreshValue: () => this._fetchPackageJsonDirectly(owner, repo, packagePath),
				ttl: 60 * 60 * 1000, // 1 hour
				swr: 60 * 60 * 1000 * 24 // 24 hours
			})
		}
		return this._fetchPackageJsonDirectly(owner, repo, packagePath)
	}

	private async _fetchPackageJsonDirectly(
		owner: string,
		repo: string,
		packagePath?: string
	): Promise<PackageJson | null> {
		try {
			const headers: HeadersInit = {
				Accept: 'application/vnd.github.v3.raw',
				'User-Agent': 'SvelteSociety-Importer'
			}

			if (this.token) {
				headers['Authorization'] = `Bearer ${this.token}`
			}

			const contentPath = packagePath ? `${packagePath}/package.json` : 'package.json'

			const response = await fetch(
				`${this.apiBaseUrl}/repos/${owner}/${repo}/contents/${contentPath}`,
				{ headers }
			)

			if (!response.ok) {
				// Not all repositories have package.json, this is normal
				return null
			}

			const packageJson: PackageJson = await response.json()
			return packageJson
		} catch (error) {
			console.error('Error fetching package.json:', error)
			return null
		}
	}

	/**
	 * Transform GitHub repository to external content data
	 */
	private transformRepositoryToContent(
		repo: GitHubRepository,
		readme: string | null,
		packageJson: PackageJson | null,
		packagePath?: string
	): ExternalContentData {
		// Extract package name from package.json if available and publishable
		// Skip if package is private or has an invalid/placeholder name
		const npmPackage = this.extractNpmPackageName(packageJson)

		// Generate a hash based on the last update time for cache busting
		// This ensures we get a fresh OG image when the repo is updated
		const ogImageHash = this.generateOGImageHash(repo.updated_at)
		const ogImageUrl = `https://opengraph.githubassets.com/${ogImageHash}/${repo.owner.login}/${repo.name}`

		// Determine title and description based on package.json or repo
		let title = repo.name
		let description = repo.description || `GitHub repository: ${repo.full_name}`

		if (packagePath) {
			// For monorepo packages, prefer package.json name, fall back to directory name
			if (packageJson) {
				title = packageJson.name || packagePath.split('/').pop() || repo.name
				description = packageJson.description || description
			} else {
				// If package.json couldn't be fetched, use the directory name
				title = packagePath.split('/').pop() || repo.name
			}
		}

		// Build external ID and URL
		const externalId = packagePath ? `${repo.full_name}/${packagePath}` : repo.full_name
		const packageUrl = packagePath
			? `${repo.html_url}/tree/${repo.default_branch}/${packagePath}`
			: repo.html_url

		return {
			title,
			description,
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
				ogImage: ogImageUrl,
				// Monorepo metadata
				...(packagePath && {
					packagePath,
					packageUrl,
					isMonorepoPackage: true
				})
			},
			tags: [], // Don't auto-assign GitHub topics as tags - they need to be mapped to tag IDs
			source: {
				type: 'library',
				source: 'github',
				externalId, // Use full_name/path for monorepo packages
				url: packageUrl,
				lastFetched: new Date().toISOString(),
				lastModified: repo.updated_at
			},
			publishedAt: repo.created_at
		}
	}

	/**
	 * Extract NPM package name from package.json
	 * Returns undefined if the package is private or has an invalid/placeholder name
	 */
	private extractNpmPackageName(packageJson: PackageJson | null): string | undefined {
		if (!packageJson?.name) {
			return undefined
		}

		// Skip private packages (not published to npm)
		if (packageJson.private === true) {
			return undefined
		}

		const name = packageJson.name

		// Filter out common placeholder/invalid names
		const invalidNames = ['www', 'app', 'web', 'site', 'website', 'monorepo', 'workspace']
		const lowerName = name.toLowerCase()

		// Check if it's a simple invalid name
		if (invalidNames.includes(lowerName)) {
			return undefined
		}

		// Check if it ends with common suffixes that indicate it's not a real package
		if (lowerName.endsWith('-monorepo') || lowerName.endsWith('-workspace')) {
			return undefined
		}

		// Valid NPM package name pattern (simplified):
		// - Can start with @ for scoped packages
		// - Contains lowercase letters, numbers, hyphens, underscores, dots
		// - Scoped packages: @scope/name
		const validPackagePattern = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/

		if (!validPackagePattern.test(name)) {
			return undefined
		}

		return name
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
}
