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

	constructor(private db: Database) {
		this.getCollectionsStatement = this.db.prepare(`
			SELECT * FROM collections_view
			LIMIT $limit OFFSET $offset
		`)

		this.getCollectionsCountStatement = this.db.prepare(`
			SELECT COUNT(*) as count FROM collections_view
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
				$limit: perPage,
				$offset: offset
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
}
