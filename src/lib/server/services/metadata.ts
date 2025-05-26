import type { Database } from 'bun:sqlite'
import type { Content } from '$lib/types/content'

export class MetadataService {
	// Default staleness threshold (24 hours in milliseconds)
	private readonly STALE_THRESHOLD = 24 * 60 * 60 * 1000

	constructor(private db: Database) {}

	// GitHub metadata method
	async fetchGithubMetadata(repoUrl: string) {
		const result: any = {
			updated_at: new Date().toISOString()
		}

		if (!repoUrl) {
			return {
				github: {
					owner: '',
					repo: '',
					stars: 0,
					forks: 0,
					issues: 0,
					lastUpdated: ''
				}
			}
		}

		try {
			// Extract owner and repo from the GitHub URL
			// Format could be: https://github.com/owner/repo
			const urlMatch = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/i)
			if (urlMatch) {
				const [, owner, repo] = urlMatch

				// GitHub API requires a User-Agent header
				const githubResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
					headers: {
						'User-Agent': 'SvelteSociety-Metadata-Service',
						Accept: 'application/vnd.github.v3+json',
						...(process.env.GITHUB_TOKEN
							? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
							: {})
					}
				})

				if (githubResponse.ok) {
					const repoData = await githubResponse.json()

					result.github = {
						owner,
						repo,
						stars: repoData.stargazers_count || 0,
						forks: repoData.forks_count || 0,
						issues: repoData.open_issues_count || 0,
						lastUpdated: repoData.updated_at || ''
					}
				}
			}
		} catch (error) {
			console.error(`Error fetching GitHub metadata for ${repoUrl}:`, error)
			result.github = {
				owner: '',
				repo: '',
				stars: 0,
				forks: 0,
				issues: 0,
				lastUpdated: ''
			}
		}

		return result
	}

	// YouTube metadata methods
	async fetchYoutubeMetadata(videoId: string) {
		// YouTube API key should be stored in environment variables
		const apiKey = process.env.YOUTUBE_API_KEY

		try {
			const response = await fetch(
				`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&key=${apiKey}`
			)

			if (!response.ok) {
				throw new Error(`YouTube API request failed with status ${response.status}`)
			}

			const data = await response.json()

			if (!data.items || data.items.length === 0) {
				console.error(`No video found with ID: ${videoId}`)
				return {
					title: '',
					description: '',
					duration: '',
					thumbnail: '',
					publishedAt: ''
				}
			}

			const videoData = data.items[0]
			const snippet = videoData.snippet || {}
			const contentDetails = videoData.contentDetails || {}

			return {
				title: snippet.title || '',
				description: snippet.description || '',
				duration: contentDetails.duration || '', // ISO 8601 duration format
				thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || '',
				publishedAt: snippet.publishedAt || ''
			}
		} catch (error) {
			console.error(`Error fetching YouTube metadata for video ${videoId}:`, error)
			return {
				title: '',
				description: '',
				duration: '',
				thumbnail: '',
				publishedAt: ''
			}
		}
	}

	/**
	 * Get metadata for a content piece with stale-while-revalidate strategy
	 * Returns current metadata immediately and updates if stale
	 */
	getMetadata(content: Content): any {
		// Parse existing metadata
		let metadata = this.parseMetadata(content)

		// If metadata is stale, trigger a background refresh
		if (this.isMetadataStale(metadata)) {
			// Return current metadata immediately
			const currentMetadata = { ...metadata }

			// Refresh in background
			this.refreshMetadata(content.id, content.type, metadata).catch((err) =>
				console.error(`Error refreshing metadata for content ${content.id}:`, err)
			)

			return currentMetadata
		}

		return metadata
	}

	/**
	 * Force refresh metadata for a content piece
	 */
	async refreshMetadataForContent(content: Content): Promise<any> {
		const metadata = this.parseMetadata(content)
		const updatedMetadata = await this.refreshMetadata(content.id, content.type, metadata)
		return updatedMetadata
	}

	// Private helper methods

	/**
	 * Parse metadata from content
	 */
	private parseMetadata(content: Content): any {
		if (!content.metadata) return {}

		// If it's already an object, return it
		if (typeof content.metadata === 'object') {
			return content.metadata
		}

		// If it's a string, try to parse it
		if (typeof content.metadata === 'string') {
			try {
				return JSON.parse(content.metadata)
			} catch (err) {
				console.error('Error parsing metadata string:', err)
				return {}
			}
		}

		return {}
	}

	/**
	 * Check if metadata is stale
	 */
	private isMetadataStale(metadata: any): boolean {
		if (!metadata.updated_at) return true

		const updatedAt = new Date(metadata.updated_at).getTime()
		const now = Date.now()

		return now - updatedAt > this.STALE_THRESHOLD
	}

	/**
	 * Update content with new metadata
	 */
	private updateContentMetadata(contentId: string, metadata: any): void {
		const stmt = this.db.prepare(`
      UPDATE content
      SET metadata = ?
      WHERE id = ?
    `)

		stmt.run(JSON.stringify(metadata), contentId)
	}

	/**
	 * Refresh metadata based on content type
	 */
	private async refreshMetadata(
		contentId: string,
		contentType: string,
		currentMetadata: any
	): Promise<any> {
		// Create new metadata object with updated timestamp
		const newMetadata = {
			...currentMetadata,
			updated_at: new Date().toISOString()
		}

		switch (contentType) {
			case 'library':
				// Handle library content
				if (currentMetadata.github?.repoUrl) {
					const githubMetadata = await this.fetchGithubMetadata(currentMetadata.github.repoUrl)

					// Merge the new metadata
					Object.assign(newMetadata, githubMetadata)
				}

				newMetadata.type = 'library'
				break

			case 'video':
				// Handle video content
				if (currentMetadata.videoId) {
					newMetadata.youtube = await this.fetchYoutubeMetadata(currentMetadata.videoId)
					newMetadata.type = 'video'
				}
				break

			// Add other content types as needed
		}

		// Update content with new metadata
		this.updateContentMetadata(contentId, newMetadata)

		return newMetadata
	}
}
