import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url, locals }) => {
	// Require authentication
	if (!locals.user) {
		return json({ error: 'Authentication required' }, { status: 401 })
	}

	const videoUrl = url.searchParams.get('url')

	if (!videoUrl) {
		return json({ error: 'URL parameter is required' }, { status: 400 })
	}

	// Extract video ID from URL
	const videoIdMatch = videoUrl.match(
		/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
	)

	if (!videoIdMatch) {
		return json({ error: 'Invalid YouTube URL' }, { status: 400 })
	}

	const videoId = videoIdMatch[1]

	// Check if already exists
	const existingContent = locals.externalContentService.getContentByExternalId('youtube', videoId)
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

	// Fetch metadata from YouTube API
	try {
		const apiKey = process.env.YOUTUBE_API_KEY
		if (!apiKey) {
			return json({ error: 'YouTube API not configured' }, { status: 503 })
		}

		const response = await fetch(
			`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
		)

		if (!response.ok) {
			throw new Error('Failed to fetch video data')
		}

		const data = await response.json()
		const video = data.items?.[0]

		if (!video) {
			return json({ error: 'Video not found' }, { status: 404 })
		}

		const bestThumbnail =
			video.snippet.thumbnails.maxres ||
			video.snippet.thumbnails.medium ||
			video.snippet.thumbnails.high ||
			video.snippet.thumbnails.standard ||
			video.snippet.thumbnails.default

		return json({
			exists: false,
			preview: {
				title: video.snippet.title,
				description: video.snippet.description.substring(0, 200) + '...',
				thumbnail: bestThumbnail?.url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
				channelTitle: video.snippet.channelTitle,
				publishedAt: video.snippet.publishedAt,
				embedUrl: `https://www.youtube.com/embed/${videoId}`
			}
		})
	} catch (error) {
		console.error('Error fetching YouTube preview:', error)
		return json({ error: 'Failed to fetch video preview' }, { status: 500 })
	}
}
