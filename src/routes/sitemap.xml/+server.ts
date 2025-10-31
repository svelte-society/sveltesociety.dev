/**
 * sitemap.xml endpoint
 * Provides URL discovery for search engines
 */

import { SEO_CONFIG } from '$lib/seo'
import type { RequestHandler } from './$types'

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

export const GET: RequestHandler = () => {
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

	// Build sitemap XML
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600' // 1 hour
		}
	})
}
