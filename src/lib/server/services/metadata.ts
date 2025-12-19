import type { Database } from 'bun:sqlite'
import type { Content } from '$lib/types/content'
import fs from 'node:fs'
import path from 'node:path'
import { uploadThumbnail, isS3Enabled } from './s3-storage'

const { STATE_DIRECTORY = '.state_directory' } = process.env

export class MetadataService {
	// Default staleness threshold (24 hours in milliseconds)
	private readonly STALE_THRESHOLD = 24 * 60 * 60 * 1000

	constructor(private db: Database) {}

	// GitHub metadata method
	// Returns stats at top level to avoid overwriting the github URL field
	async fetchGithubMetadata(repoUrl: string) {
		const result: any = {
			updated_at: new Date().toISOString()
		}

		if (!repoUrl) {
			return {
				stars: 0,
				forks: 0,
				issues: 0,
				updatedAt: ''
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

					// Store stats at top level (consistent with GitHub importer)
					// This avoids overwriting the github URL field
					result.stars = repoData.stargazers_count || 0
					result.forks = repoData.forks_count || 0
					result.issues = repoData.open_issues_count || 0
					result.updatedAt = repoData.updated_at || ''
				}
			}
		} catch (error) {
			console.error(`Error fetching GitHub metadata for ${repoUrl}:`, error)
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

	private async refreshVideoThumbnail(videoId: string): Promise<string | null> {
		try {
			const response = await fetch(`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`)
			if (!response.ok) {
				console.error(`Failed to fetch YouTube thumbnail for ${videoId}`)
				return null
			}

			const thumbnailBuffer = Buffer.from(await response.arrayBuffer())

			if (isS3Enabled) {
				const key = `yt/${videoId}/thumbnail.jpg`
				return await uploadThumbnail(key, thumbnailBuffer)
			} else {
				const dir = path.join(STATE_DIRECTORY, 'files', 'yt', videoId)
				fs.mkdirSync(dir, { recursive: true })
				fs.writeFileSync(path.join(dir, 'thumbnail.jpg'), thumbnailBuffer)
				return `/files/yt/${videoId}/thumbnail.jpg`
			}
		} catch (error) {
			console.error(`Error refreshing video thumbnail for ${videoId}:`, error)
			return null
		}
	}

	private async refreshLibraryThumbnail(owner: string, repo: string, updatedAt?: string): Promise<string | null> {
		try {
			const hash = updatedAt
				? new Date(updatedAt).getTime().toString(36).padStart(12, '0')
				: Date.now().toString(36).padStart(12, '0')
			const ogImageUrl = `https://opengraph.githubassets.com/${hash}/${owner}/${repo}`

			console.log(`[MetadataService] Fetching GitHub OG image from: ${ogImageUrl}`)
			const response = await fetch(ogImageUrl)
			console.log(`[MetadataService] Response: status=${response.status}, content-type=${response.headers.get('content-type')}`)
			if (!response.ok || !response.headers.get('content-type')?.includes('image')) {
				console.error(`Failed to fetch GitHub OG image for ${owner}/${repo}: status=${response.status}, content-type=${response.headers.get('content-type')}`)
				return null
			}

			const extension = response.headers.get('content-type')?.split('/').at(-1) || 'png'
			const thumbnailBuffer = Buffer.from(await response.arrayBuffer())

			if (isS3Enabled) {
				const key = `gh/${owner}/${repo}/thumbnail.${extension}`
				return await uploadThumbnail(key, thumbnailBuffer)
			} else {
				const dir = path.join(STATE_DIRECTORY, 'files', 'gh', owner, repo)
				fs.mkdirSync(dir, { recursive: true })
				const filePath = path.join(dir, `thumbnail.${extension}`)
				fs.writeFileSync(filePath, thumbnailBuffer)
				return `/files/gh/${owner}/${repo}/thumbnail.${extension}`
			}
		} catch (error) {
			console.error(`Error refreshing library thumbnail for ${owner}/${repo}:`, error)
			return null
		}
	}

	private async refreshResourceThumbnail(contentId: string, linkUrl: string): Promise<string | null> {
		try {
			const pageResponse = await fetch(linkUrl, {
				headers: {
					'User-Agent': 'SvelteSociety-Metadata-Service'
				}
			})
			if (!pageResponse.ok) {
				console.error(`Failed to fetch page for OG image: ${linkUrl}`)
				return null
			}

			const html = await pageResponse.text()
			const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
				|| html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i)

			if (!ogImageMatch || !ogImageMatch[1]) {
				console.error(`No OG image found for: ${linkUrl}`)
				return null
			}

			let ogImageUrl = ogImageMatch[1]
			if (ogImageUrl.startsWith('//')) {
				ogImageUrl = 'https:' + ogImageUrl
			} else if (ogImageUrl.startsWith('/')) {
				const urlObj = new URL(linkUrl)
				ogImageUrl = urlObj.origin + ogImageUrl
			}

			const imageResponse = await fetch(ogImageUrl)
			if (!imageResponse.ok || !imageResponse.headers.get('content-type')?.includes('image')) {
				console.error(`Failed to fetch OG image: ${ogImageUrl}`)
				return null
			}

			const extension = imageResponse.headers.get('content-type')?.split('/').at(-1) || 'png'
			const thumbnailBuffer = Buffer.from(await imageResponse.arrayBuffer())

			if (isS3Enabled) {
				const key = `resource/${contentId}/thumbnail.${extension}`
				return await uploadThumbnail(key, thumbnailBuffer)
			} else {
				const dir = path.join(STATE_DIRECTORY, 'files', 'resource', contentId)
				fs.mkdirSync(dir, { recursive: true })
				const filePath = path.join(dir, `thumbnail.${extension}`)
				fs.writeFileSync(filePath, thumbnailBuffer)
				return `/files/resource/${contentId}/thumbnail.${extension}`
			}
		} catch (error) {
			console.error(`Error refreshing resource thumbnail for ${linkUrl}:`, error)
			return null
		}
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
			case 'library': {
				// Extract owner/repo from various metadata formats:
				// 1. github as string URL (user submitted): "https://github.com/owner/repo"
				// 2. github as object with owner/repo (imported): { owner: "...", repo: "..." }
				// 3. githubOwner/githubRepo at top level (user submitted)
				let owner: string | undefined
				let repo: string | undefined
				let githubUrl: string | undefined

				if (typeof currentMetadata.github === 'string') {
					// Format 1: github is a URL string
					githubUrl = currentMetadata.github
					const urlMatch = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/i)
					if (urlMatch) {
						owner = urlMatch[1]
						repo = urlMatch[2]
					}
				} else if (currentMetadata.github?.owner && currentMetadata.github?.repo) {
					// Format 2: github is an object with owner/repo
					owner = currentMetadata.github.owner
					repo = currentMetadata.github.repo
					githubUrl = `https://github.com/${owner}/${repo}`
				} else if (currentMetadata.githubOwner && currentMetadata.githubRepo) {
					// Format 3: githubOwner/githubRepo at top level
					owner = currentMetadata.githubOwner
					repo = currentMetadata.githubRepo
					githubUrl = `https://github.com/${owner}/${repo}`
				}

				console.log(`[MetadataService] Extracted owner=${owner}, repo=${repo}, githubUrl=${githubUrl}`)

				if (owner && repo && githubUrl) {
					const githubMetadata = await this.fetchGithubMetadata(githubUrl)
					Object.assign(newMetadata, githubMetadata)

					const thumbnailUrl = await this.refreshLibraryThumbnail(
						owner,
						repo,
						githubMetadata.updatedAt
					)
					console.log(`[MetadataService] Thumbnail result: ${thumbnailUrl}`)
					if (thumbnailUrl) {
						newMetadata.thumbnail = thumbnailUrl
					}
				}
				newMetadata.type = 'library'
				break
			}

			case 'video': {
				const videoId =
					currentMetadata.videoId ||
					currentMetadata.externalSource?.externalId ||
					currentMetadata.watchUrl?.match(/[?&]v=([^&]+)/)?.[1]
				if (videoId) {
					newMetadata.youtube = await this.fetchYoutubeMetadata(videoId)
					newMetadata.type = 'video'

					const thumbnailUrl = await this.refreshVideoThumbnail(videoId)
					if (thumbnailUrl) {
						newMetadata.thumbnail = thumbnailUrl
					}
				}
				break
			}

			case 'resource': {
				const linkUrl = currentMetadata.link
				if (linkUrl) {
					const thumbnailUrl = await this.refreshResourceThumbnail(contentId, linkUrl)
					if (thumbnailUrl) {
						newMetadata.image = thumbnailUrl
					}
				}
				newMetadata.type = 'resource'
				break
			}
		}

		// Update content with new metadata
		this.updateContentMetadata(contentId, newMetadata)

		return newMetadata
	}
}
