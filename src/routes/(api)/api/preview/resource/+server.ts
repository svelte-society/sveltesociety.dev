import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url, locals }) => {
	// Require authentication
	if (!locals.user) {
		return json({ error: 'Authentication required' }, { status: 401 })
	}

	const resourceUrl = url.searchParams.get('url')

	if (!resourceUrl) {
		return json({ error: 'URL parameter is required' }, { status: 400 })
	}

	// Validate URL format
	try {
		new URL(resourceUrl)
	} catch {
		return json({ error: 'Invalid URL format' }, { status: 400 })
	}

	try {
		const response = await fetch(resourceUrl, {
			headers: {
				'User-Agent': 'SvelteSociety-Bot/1.0',
				Accept: 'text/html'
			},
			signal: AbortSignal.timeout(10000) // 10 second timeout
		})

		if (!response.ok) {
			return json({ error: 'Failed to fetch URL' }, { status: 502 })
		}

		const contentType = response.headers.get('content-type') || ''
		if (!contentType.includes('text/html')) {
			// Not HTML, cannot extract og:image
			return json({
				exists: false,
				preview: { title: null, description: null, image: null }
			})
		}

		const html = await response.text()

		// Parse og:image, og:title, og:description from HTML
		const ogImage = extractMetaContent(html, 'og:image')
		const ogTitle = extractMetaContent(html, 'og:title') || extractTitle(html)
		const ogDescription =
			extractMetaContent(html, 'og:description') || extractMetaContent(html, 'description')

		// Resolve relative og:image URLs to absolute
		let absoluteImage = ogImage
		if (ogImage && !ogImage.startsWith('http')) {
			const baseUrl = new URL(resourceUrl)
			absoluteImage = new URL(ogImage, baseUrl).toString()
		}

		return json({
			exists: false,
			preview: {
				title: ogTitle,
				description: ogDescription?.substring(0, 200) || null,
				image: absoluteImage
			}
		})
	} catch (error) {
		console.error('Error fetching resource preview:', error)
		if (error instanceof Error && error.name === 'TimeoutError') {
			return json({ error: 'Request timed out' }, { status: 504 })
		}
		return json({ error: 'Failed to fetch resource preview' }, { status: 500 })
	}
}

/**
 * Extract meta tag content by property or name
 */
function extractMetaContent(html: string, property: string): string | null {
	// Match: <meta property="og:image" content="...">
	const propertyRegex = new RegExp(
		`<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`,
		'i'
	)
	// Match: <meta content="..." property="og:image">
	const contentFirstRegex = new RegExp(
		`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`,
		'i'
	)

	const match = html.match(propertyRegex) || html.match(contentFirstRegex)
	return match ? match[1] : null
}

/**
 * Extract title tag content
 */
function extractTitle(html: string): string | null {
	const match = html.match(/<title[^>]*>([^<]+)<\/title>/i)
	return match ? match[1].trim() : null
}
