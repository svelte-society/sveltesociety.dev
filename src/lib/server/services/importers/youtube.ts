import type { CacheService } from '../cache'
import type { ExternalContentService, ExternalContentData } from '../external-content'

import fs from 'node:fs'

const { STATE_DIRECTORY = '.state_directory' } = process.env

interface YouTubeVideoSnippet {
	title: string
	description: string
	publishedAt: string
	channelTitle: string
	thumbnails: {
		default?: { url: string; width: number; height: number }
		medium?: { url: string; width: number; height: number }
		high?: { url: string; width: number; height: number }
		standard?: { url: string; width: number; height: number }
		maxres?: { url: string; width: number; height: number }
	}
	tags?: string[]
}

interface YouTubeVideoStatistics {
	viewCount: string
	likeCount: string
	commentCount: string
}

interface YouTubeVideoContentDetails {
	duration: string
	dimension: string
	definition: string
}

interface YouTubeVideo {
	id: string
	snippet: YouTubeVideoSnippet
	statistics?: YouTubeVideoStatistics
	contentDetails?: YouTubeVideoContentDetails
}

export class YouTubeImporter {
	private apiKey?: string
	private apiBaseUrl = 'https://www.googleapis.com/youtube/v3'

	constructor(
		private externalContentService: ExternalContentService,
		private cacheService?: CacheService,
		apiKey?: string
	) {
		this.apiKey = apiKey || process.env.YOUTUBE_API_KEY
	}

	/**
	 * Import a single video by ID
	 */
	async importVideo(videoId: string, authorId?: string): Promise<string | null> {
		if (!this.apiKey) {
			throw new Error('YouTube API key is required')
		}

		const video = await this.fetchVideo(videoId)
		if (!video) return null

		const response = await fetch(`https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`)

		const dir = [STATE_DIRECTORY, 'files', 'yt', video.id].join('/')

		fs.mkdirSync(dir, { recursive: true })

		fs.writeFileSync(dir + '/thumbnail.jpg', Buffer.from(await response.arrayBuffer()))

		const contentData = this.transformVideoToContent(video)

		if (authorId) {
			contentData.author_id = authorId
		}

		return this.externalContentService.upsertExternalContent(contentData)
	}

	/**
	 * Fetch a single video
	 */
	private async fetchVideo(videoId: string): Promise<YouTubeVideo | null> {
		const videos = await this.fetchVideosByIds(videoId)
		return videos[0] || null
	}

	/**
	 * Fetch multiple videos by IDs
	 */
	private async fetchVideosByIds(videoIds: string): Promise<YouTubeVideo[]> {
		try {
			const response = await fetch(
				`${this.apiBaseUrl}/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${this.apiKey}`
			)

			if (!response.ok) {
				throw new Error(`Failed to fetch videos: ${response.statusText}`)
			}

			const data = await response.json()
			return data.items || []
		} catch (error) {
			console.error('Error fetching videos:', error)
			return []
		}
	}

	/**
	 * Transform a single YouTube video to external content data
	 */
	private transformVideoToContent(video: YouTubeVideo): ExternalContentData {
		return {
			title: video.snippet.title,
			type: 'video',
			metadata: {
				channelTitle: video.snippet.channelTitle,
				publishedAt: video.snippet.publishedAt,
				thumbnail: `/files/yt/${video.id}/thumbnail.jpg`,
				thumbnails: video.snippet.thumbnails,
				tags: video.snippet.tags || [],
				statistics: video.statistics
					? {
							viewCount: parseInt(video.statistics.viewCount || '0'),
							likeCount: parseInt(video.statistics.likeCount || '0'),
							commentCount: parseInt(video.statistics.commentCount || '0')
						}
					: undefined,
				contentDetails: video.contentDetails,
				embedUrl: `https://www.youtube.com/embed/${video.id}`,
				watchUrl: `https://www.youtube.com/watch?v=${video.id}`
			},
			source: {
				type: 'video',
				source: 'youtube',
				externalId: video.id,
				url: `https://www.youtube.com/watch?v=${video.id}`,
				lastFetched: new Date().toISOString()
			},
			publishedAt: video.snippet.publishedAt
		}
	}
}
