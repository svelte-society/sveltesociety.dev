import { Database } from 'bun:sqlite'
import type { Status } from '$lib/server/db/common'
import type { SearchService } from './search'

export interface Collection {
	id: string
	title: string
	type: 'collection'
	description: string
	children: string
	created_at: string
	updated_at: string
	status: Status
	published_at: string | null
	slug: string
}

export class CollectionService {
	private getCollectionsStatement
	private getCollectionsCountStatement
	private createCollectionStatement
	private addTagStatement
	private updateCollectionStatement
	private deleteTagsStatement
	private addAuthorStatement

	constructor(
		private db: Database,
		private searchService?: SearchService
	) {
		this.getCollectionsStatement = this.db.prepare(`
			SELECT * FROM collections_view
			LIMIT $limit OFFSET $offset
		`)

		this.getCollectionsCountStatement = this.db.prepare(`
			SELECT COUNT(*) as count FROM collections_view
		`)

		this.createCollectionStatement = this.db.prepare(`
			INSERT INTO content (
				title, slug, description, type, children, status,
				created_at, updated_at, published_at
			) VALUES (
				$title, $slug, $description, 'collection', $children, $status,
				CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
				CASE WHEN $status = 'published' THEN CURRENT_TIMESTAMP ELSE NULL END
			) RETURNING id
		`)

		this.updateCollectionStatement = this.db.prepare(`
			UPDATE content
			SET title = ?,
				slug = ?,
				description = ?,
				children = ?,
				updated_at = CURRENT_TIMESTAMP
			WHERE id = ?
			RETURNING id
		`)

		this.deleteTagsStatement = this.db.prepare(`
			DELETE FROM content_to_tags WHERE content_id = ?
		`)

		this.addTagStatement = this.db.prepare(`
			INSERT INTO content_to_tags (content_id, tag_id)
			VALUES ($content_id, $tag_id)
		`)

		this.addAuthorStatement = this.db.prepare(`
			INSERT INTO content_to_users (content_id, user_id)
			VALUES ($content_id, $user_id)
		`)
	}

	/**
	 * Get collections with pagination support
	 * @param page - Current page number (1-based)
	 * @param perPage - Number of items per page
	 * @returns Collection array for the requested page
	 */
	getCollections(page = 1, perPage = 10): Collection[] {
		try {
			const offset = (page - 1) * perPage
			return this.getCollectionsStatement.all({
				limit: perPage,
				offset: offset
			}) as Collection[]
		} catch (error) {
			console.error('Error getting collections:', error)
			return []
		}
	}

	/**
	 * Get total count of collections
	 * @returns Total number of collections
	 */
	getCollectionsCount(): number {
		try {
			const result = this.getCollectionsCountStatement.get() as { count: number }
			return result.count
		} catch (error) {
			console.error('Error getting collections count:', error)
			return 0
		}
	}

	/**
	 * Create a new collection
	 * @param data Collection data including title, slug, description, status, children IDs, tag IDs, and author ID
	 * @returns The ID of the created collection
	 */
	createCollection(data: {
		title: string
		slug: string
		description: string
		status?: string
		children: string[]
		tags: string[]
		author_id?: string
	}): string {
		try {
			const collectionChildren = JSON.stringify(data.children)

			const result = this.createCollectionStatement.get({
				title: data.title,
				slug: data.slug,
				description: data.description,
				status: data.status || 'draft',
				children: collectionChildren
			}) as { id: string }

			if (!result?.id) {
				throw new Error('Failed to create collection')
			}

			// Add author if present
			if (data.author_id) {
				this.addAuthorStatement.run({
					content_id: result.id,
					user_id: data.author_id
				})
			}

			// Add tags if present
			if (data.tags.length > 0) {
				for (const tagId of data.tags) {
					this.addTagStatement.run({
						content_id: result.id,
						tag_id: tagId
					})
				}
			}

			// Add to search index only if published
			if (this.searchService && data.status === 'published') {
				// Get tag slugs for search index
				let tagSlugs: string[] = []
				if (data.tags && data.tags.length > 0) {
					const tagQuery = this.db.prepare(`
						SELECT slug FROM tags WHERE id = ?
					`)
					tagSlugs = data.tags
						.map((tagId) => {
							const tag = tagQuery.get(tagId) as { slug: string } | null
							return tag?.slug || ''
						})
						.filter(Boolean)
				}

				this.searchService.add({
					id: result.id,
					title: data.title,
					description: data.description,
					tags: tagSlugs,
					type: 'collection',
					created_at: new Date().toISOString(),
					likes: 0,
					saves: 0,
					stars: 0
				})
			}

			return result.id
		} catch (error) {
			console.error('Error creating collection:', error)
			console.error(error)
			throw error
		}
	}

	/**
	 * Update an existing collection
	 * @param id Collection ID to update
	 * @param data Collection data including title, slug, description, children IDs, and tag IDs
	 * @returns The ID of the updated collection or undefined if update failed
	 */
	updateCollection(
		id: string,
		data: {
			title: string
			slug: string
			description: string
			children: string[]
			tags: string[]
		}
	): string | undefined {
		try {
			// Format children array for storage
			const collectionContent = JSON.stringify(data.children)

			// Update collection record
			const result = this.updateCollectionStatement.get(
				data.title,
				data.slug,
				data.description,
				collectionContent,
				id
			) as { id: string } | undefined

			if (!result?.id) {
				throw new Error('Failed to update collection')
			}

			// Delete existing tag associations
			this.deleteTagsStatement.run(id)

			// Add new tag associations
			if (data.tags.length > 0) {
				for (const tagId of data.tags) {
					this.addTagStatement.run({
						content_id: id,
						tag_id: tagId
					})
				}
			}

			return result.id
		} catch (error) {
			console.error('Error updating collection:', error)
			throw error
		}
	}
}
