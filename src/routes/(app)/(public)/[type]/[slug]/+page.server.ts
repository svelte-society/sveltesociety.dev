import { error } from '@sveltejs/kit'
import {
	buildContentMeta,
	generateVideoSchema,
	generateArticleSchema,
	generateSoftwareSchema,
	generateBreadcrumbSchema,
	SEO_CONFIG,
	formatContentType,
	toIso8601
} from '$lib/seo'
import type { Schema } from '$lib/seo'

export const load = async ({ locals, params, url }) => {
	const start = performance.now()

	const content = locals.contentService.getContentBySlug(params.slug)

	if (!content) {
		throw error(404, { message: 'Content not found' })
	}

	if (locals.user) {
		const { userLikes, userSaves } = locals.interactionsService.getUserLikesAndSaves(
			locals.user.id,
			[content.id]
		)
		content.liked = userLikes.has(content.id)
		content.saved = userSaves.has(content.id)
	}

	const stop = performance.now()
	console.log('Loading content took: ', stop - start)

	// Build comprehensive SEO meta configuration with OG and Twitter Card tags
	const meta = buildContentMeta(content, url.toString())

	// Build structured data schemas
	const schemas: Schema[] = []

	// Add content-type specific schema
	if (content.type === 'video') {
		schemas.push(
			generateVideoSchema({
				title: content.title,
				description: content.description,
				thumbnailUrl: content.metadata?.thumbnail || content.metadata?.thumbnails?.high?.url || '',
				uploadDate: toIso8601(content.metadata?.publishedAt || content.created_at),
				contentUrl: content.metadata?.watchUrl,
				embedUrl: content.metadata?.embedUrl,
				authorName: content.metadata?.channelTitle,
				dateModified: toIso8601(content.updated_at)
			})
		)
	} else if (content.type === 'recipe') {
		schemas.push(
			generateArticleSchema({
				headline: content.title,
				description: content.description,
				datePublished: toIso8601(content.published_at || content.created_at),
				dateModified: toIso8601(content.updated_at),
				imageUrl: content.metadata?.image,
				url: url.toString()
			})
		)
	} else if (content.type === 'library') {
		schemas.push(
			generateSoftwareSchema({
				name: content.title,
				description: content.description,
				codeRepository: content.metadata?.github,
				programmingLanguage: content.metadata?.language || 'JavaScript',
				datePublished: toIso8601(content.published_at || content.created_at),
				dateModified: toIso8601(content.updated_at)
			})
		)
	} else if (content.type === 'announcement' || content.type === 'collection') {
		// Use generic article schema for announcements and collections
		schemas.push(
			generateArticleSchema({
				headline: content.title,
				description: content.description,
				datePublished: toIso8601(content.published_at || content.created_at),
				dateModified: toIso8601(content.updated_at),
				url: url.toString()
			})
		)
	}

	// Add breadcrumb schema
	const contentTypeLabel = formatContentType(content.type)
	schemas.push(
		generateBreadcrumbSchema([
			{ name: 'Home', url: SEO_CONFIG.siteUrl },
			{ name: contentTypeLabel, url: `${SEO_CONFIG.siteUrl}/${content.type}` },
			{ name: content.title, url: url.toString() }
		])
	)

	return {
		content,
		meta,
		schemas
	}
}
