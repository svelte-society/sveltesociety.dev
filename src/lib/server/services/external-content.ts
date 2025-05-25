import type { Database } from 'bun:sqlite'
import type { ContentService } from './content'
import type { CacheService } from './cache'
import type { Content } from '$lib/types/content'

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
	type: 'event' | 'video' | 'blog' | 'library' | 'link'
	metadata: any
	tags?: string[]
	source: ExternalContentSource
	publishedAt?: string
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
			// Check if content already exists by external ID
			const existing = this.getContentByExternalId(data.source.source, data.source.externalId)
			
			// Generate a unique slug based on source and external ID
			const slug = existing?.slug || this.generateSlug(data)
			
			// Prepare metadata with source information
			const metadata = {
				...(existing?.metadata || {}),
				...data.metadata,
				externalSource: {
					...data.source,
					lastFetched: new Date().toISOString()
				}
			}
			
			if (existing) {
				// Update existing content
				this.contentService.updateContent(existing.id, {
					title: data.title,
					slug: existing.slug,
					description: data.description || existing.description,
					type: data.type,
					status: existing.status,
					body: data.body || existing.body,
					metadata: JSON.stringify(metadata),
					tags: data.tags || []
				})
				
				return existing.id
			} else {
				// Create new content
				const contentId = this.contentService.addContent({
					title: this.generateUniqueTitle(data),
					type: data.type,
					slug,
					description: data.description,
					body: data.body,
					metadata,
					status: 'published',
					// Use the original published date for both created_at and published_at
					// This ensures proper chronological ordering
					created_at: data.publishedAt || new Date().toISOString(),
					published_at: data.publishedAt || new Date().toISOString()
				})
				
				// Add tags if provided
				if (data.tags && data.tags.length > 0) {
					// Note: You'll need to implement tag association in ContentService
					// For now, tags are stored in metadata
				}
				
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
		
		return results.map(row => ({
			...row,
			metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : (row.metadata || {})
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
		
		const result = stmt.get(source, externalId)
		
		if (!result) return null
		
		return {
			...result,
			metadata: typeof result.metadata === 'string' ? JSON.parse(result.metadata) : (result.metadata || {})
		} as Content
	}

	/**
	 * Check if external content needs update
	 */
	needsUpdate(content: Content, lastModified?: string): boolean {
		if (!content.metadata?.externalSource?.lastFetched) {
			return true
		}
		
		// If we have a lastModified date from the source, compare it
		if (lastModified && content.metadata.externalSource.lastModified) {
			return new Date(lastModified) > new Date(content.metadata.externalSource.lastModified)
		}
		
		// Otherwise, check if it's been more than 24 hours since last fetch
		const lastFetched = new Date(content.metadata.externalSource.lastFetched)
		const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
		
		return lastFetched < dayAgo
	}

	/**
	 * Delete content from a specific external source
	 */
	deleteBySource(source: string, type?: string): number {
		const content = this.getContentBySource(source, type)
		let deleted = 0
		
		for (const item of content) {
			try {
				this.contentService.deleteContent(item.id)
				deleted++
			} catch (error) {
				console.error(`Error deleting content ${item.id}:`, error)
			}
		}
		
		return deleted
	}

	/**
	 * Sync content from external source
	 * This is a generic method that can be extended by specific importers
	 */
	async syncFromSource(
		source: string,
		fetchFunction: () => Promise<ExternalContentData[]>,
		options?: {
			deleteOrphaned?: boolean
			type?: string
		}
	): Promise<{ created: number; updated: number; deleted: number }> {
		const stats = { created: 0, updated: 0, deleted: 0 }
		
		try {
			// Fetch fresh data
			const externalData = await fetchFunction()
			const externalIds = new Set(externalData.map(item => item.source.externalId))
			
			// Get existing content from this source
			const existing = this.getContentBySource(source, options?.type)
			const existingMap = new Map(
				existing.map(item => [item.metadata?.externalSource?.externalId, item])
			)
			
			// Upsert each item
			for (const data of externalData) {
				const existingContent = existingMap.get(data.source.externalId)
				
				if (existingContent) {
					// Update if needed
					if (this.needsUpdate(existingContent, data.source.lastModified)) {
						await this.upsertExternalContent(data)
						stats.updated++
					}
				} else {
					// Create new
					await this.upsertExternalContent(data)
					stats.created++
				}
			}
			
			// Delete orphaned content if requested
			if (options?.deleteOrphaned) {
				for (const [externalId, content] of existingMap) {
					if (!externalIds.has(externalId)) {
						this.contentService.deleteContent(content.id)
						stats.deleted++
					}
				}
			}
			
			return stats
		} catch (error) {
			console.error('Error syncing from source:', error)
			throw error
		}
	}

	/**
	 * Generate a unique slug for external content
	 */
	private generateSlug(data: ExternalContentData): string {
		const sourcePrefix = data.source.source.toLowerCase()
		const typePrefix = data.type.toLowerCase()
		
		// For events, use the external ID directly as it's usually already a slug
		if (data.type === 'event' && data.source.externalId.match(/^[a-z0-9-]+$/)) {
			return `${sourcePrefix}-${data.source.externalId}`
		}
		
		// For other content, generate from title
		const titleSlug = data.title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '')
			.substring(0, 50)
		
		return `${sourcePrefix}-${typePrefix}-${titleSlug}-${data.source.externalId.substring(0, 8)}`
	}

	/**
	 * Generate a unique title for external content
	 */
	private generateUniqueTitle(data: ExternalContentData): string {
		// Return the title as-is without any prefix
		return data.title
	}
}