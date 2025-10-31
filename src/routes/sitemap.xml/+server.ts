/**
 * sitemap.xml endpoint
 * Provides URL discovery for search engines
 */

import { SEO_CONFIG } from '$lib/seo'
import type { RequestHandler } from './$types'

// In-memory cache for the sitemap
let sitemapCache: {
	xml: string
	timestamp: number
} | null = null

const CACHE_TTL = 3600 * 1000 // 1 hour in milliseconds

/**
 * Creates a sitemap URL entry
 */
function createUrlEntry(
	path: string,
	lastmod: Date,
	priority: number,
	changefreq: string
): string {
	const url = `${SEO_CONFIG.siteUrl}${path}`
	const lastmodFormatted = lastmod.toISOString()

	return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmodFormatted}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

/**
 * Generates the sitemap XML
 */
function generateSitemap(locals: App.Locals): string {
	const now = new Date()
	const urls: string[] = []

	// Homepage
	urls.push(
		createUrlEntry('/', now, SEO_CONFIG.priority.homepage, SEO_CONFIG.changefreq.homepage)
	)

	// Category pages
	const categories = ['recipe', 'video', 'library', 'collection', 'announcement']
	for (const category of categories) {
		urls.push(
			createUrlEntry(
				`/${category}`,
				now,
				SEO_CONFIG.priority.category,
				SEO_CONFIG.changefreq.category
			)
		)
	}

	// Static pages
	const staticPages = [
		{ path: '/about', lastmod: now },
		{ path: '/terms', lastmod: now },
		{ path: '/privacy', lastmod: now }
	]

	for (const page of staticPages) {
		urls.push(
			createUrlEntry(
				page.path,
				page.lastmod,
				SEO_CONFIG.priority.static,
				SEO_CONFIG.changefreq.static
			)
		)
	}

	// Get all published content from database
	try {
		const allPublishedContent = locals.contentService.getFilteredContent({
			status: 'published',
			limit: 50000 // Max sitemap URLs
		})

		// Add each piece of published content
		for (const content of allPublishedContent) {
			// Determine priority based on content type
			const priority =
				content.type === 'collection' || content.type === 'announcement'
					? SEO_CONFIG.priority.collection
					: SEO_CONFIG.priority.content

			// Use updated_at if available, otherwise created_at
			const lastmod = new Date(content.updated_at || content.created_at)

			urls.push(
				createUrlEntry(
					`/${content.type}/${content.slug}`,
					lastmod,
					priority,
					SEO_CONFIG.changefreq.content
				)
			)
		}
	} catch (error) {
		console.error('Error fetching content for sitemap:', error)
		// Continue with static pages only if content fetch fails
	}

	// Build sitemap XML
	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`
}

export const GET: RequestHandler = ({ locals }) => {
	const now = Date.now()

	// Check if cache is still valid
	if (sitemapCache && now - sitemapCache.timestamp < CACHE_TTL) {
		return new Response(sitemapCache.xml, {
			headers: {
				'Content-Type': 'application/xml; charset=utf-8',
				'Cache-Control': 'public, max-age=3600', // 1 hour
				'X-Cache': 'HIT' // Debug header to see cache status
			}
		})
	}

	// Generate fresh sitemap
	const sitemap = generateSitemap(locals)

	// Update cache
	sitemapCache = {
		xml: sitemap,
		timestamp: now
	}

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600', // 1 hour
			'X-Cache': 'MISS' // Debug header to see cache status
		}
	})
}
