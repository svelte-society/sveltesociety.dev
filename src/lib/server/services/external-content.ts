import type { Database } from 'bun:sqlite'
import type { ContentService } from './content'
import type { CacheService } from './cache'
import type { Content } from '$lib/types/content'

interface DatabaseContentRow {
	id: string
	title: string
	slug: string
	description: string
	type: string
	status: string
	body?: string
	rendered_body: string
	author?: string
	created_at: string
	updated_at: string
	published_at: string | null
	likes: number
	saves: number
	liked: boolean
	saved: boolean
	views: number
	metadata: string | object
	tags?: unknown[]
}

export interface ExternalContentSource {
	type: 'event' | 'video' | 'blog' | 'library'
	source: string // e.g., 'guild', 'youtube', 'github', etc.
	externalId: string
	url: string
	lastFetched?: string
	lastModified?: string
}

export interface ExternalContentData {
	title: string
	description?: string
	body?: string
	type: 'recipe' | 'video' | 'library'
	metadata: any
	tags?: string[]
	source: ExternalContentSource
	publishedAt?: string
	author_id?: string
}

export class ExternalContentService {
	constructor(
		private db: Database,
		private contentService: ContentService,
		private cacheService?: CacheService
	) {}

	/**
	 * Create or update content from an external source
	 */
	async upsertExternalContent(data: ExternalContentData): Promise<string | null> {
		try {
			const existing = this.getContentByExternalId(data.source.source, data.source.externalId)

			const slug = existing?.slug || this.generateSlug(data)

			const metadata = {
				...data.metadata,
				externalSource: {
					...data.source,
					lastFetched: new Date().toISOString()
				}
			}

			if (existing) {
				// Get existing body if available (only recipe type has body field)
				const existingBody = existing.type === 'recipe' ? existing.body || '' : ''
				const existingRenderedBody = existing.type === 'recipe' ? existing.rendered_body || '' : ''

				this.contentService.updateContent({
					id: existing.id,
					title: data.title,
					slug: existing.slug,
					description: data.description || existing.description,
					type: data.type,
					status: existing.status,
					body: data.body || existingBody,
					rendered_body: existingRenderedBody,
					published_at: existing.published_at,
					metadata: JSON.stringify(metadata),
					tags: data.tags || []
				})

				return existing.id
			} else {
				const contentId = this.contentService.addContent({
					title: data.title,
					type: data.type,
					slug,
					description: data.description || '',
					body: data.body || '',
					metadata,
					status: 'draft',
					tags: data.tags || [],
					// Use the original published date
					published_at: data.publishedAt || new Date().toISOString(),
					author_id: data.author_id
				})

				return contentId
			}
		} catch (error) {
			console.error('Error upserting external content:', error)
			return null
		}
	}

	/**
	 * Get all content from a specific external source
	 */
	getContentBySource(source: string, type?: string): Content[] {
		const query = type
			? `SELECT * FROM content WHERE json_extract(metadata, '$.externalSource.source') = ? AND json_extract(metadata, '$.externalSource.type') = ? ORDER BY published_at DESC`
			: `SELECT * FROM content WHERE json_extract(metadata, '$.externalSource.source') = ? ORDER BY published_at DESC`

		const stmt = this.db.prepare(query)
		const results = type ? stmt.all(source, type) : stmt.all(source)

		return (results as DatabaseContentRow[]).map((row) => ({
			...row,
			metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata || {}
		})) as Content[]
	}

	/**
	 * Get content by external ID
	 */
	getContentByExternalId(source: string, externalId: string): Content | null {
		const stmt = this.db.prepare(`
			SELECT * FROM content
			WHERE json_extract(metadata, '$.externalSource.source') = ?
			AND json_extract(metadata, '$.externalSource.externalId') = ?
			LIMIT 1
		`)

		const result = stmt.get(source, externalId) as DatabaseContentRow | undefined

		if (!result) return null

		return {
			...result,
			metadata:
				typeof result.metadata === 'string' ? JSON.parse(result.metadata) : result.metadata || {}
		} as Content
	}

	/**
	 * Generate a unique slug for external content
	 */
	private generateSlug(data: ExternalContentData): string {
		// Generate from title
		const titleSlug = data.title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '')

		// If we end up with an empty slug, use the external ID
		if (!titleSlug) {
			return data.source.externalId
				.substring(0, 50)
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
		}

		if (data.type === 'library') {
			return data.metadata.owner.name + '-' + titleSlug
		}

		return titleSlug
	}
}
