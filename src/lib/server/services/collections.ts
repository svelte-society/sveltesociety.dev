import { Database } from 'bun:sqlite'
import type { Status } from '$lib/server/db/common'

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

	constructor(private db: Database) {
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
				$title, $slug, $description, 'collection', $children, 'published',
				CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
			) RETURNING id
		`)

		this.addTagStatement = this.db.prepare(`
			INSERT INTO content_to_tags (content_id, tag_id)
			VALUES ($content_id, $tag_id)
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
	 * @param data Collection data including title, slug, description, children IDs, and tag IDs
	 * @returns The ID of the created collection
	 */
	createCollection(data: {
		title: string
		slug: string
		description: string
		children: string[]
		tags: string[]
	}): string {
		try {
			// Create the collection
			// Ensure children IDs are all strings and store as JSON array
			const sanitizedChildren = data.children.map(id => String(id));
			const collectionChildren = JSON.stringify(sanitizedChildren);
			
			const result = this.createCollectionStatement.get({
				title: data.title,
				slug: data.slug,
				description: data.description,
				children: collectionChildren
			}) as { id: string }

			if (!result?.id) {
				throw new Error('Failed to create collection')
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

			return result.id
		} catch (error) {
			console.error('Error creating collection:', error)
			throw error
		}
	}
}
