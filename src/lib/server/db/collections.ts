import { db } from './index'
import type { Status } from '$lib/server/db/common'

export type Collection = {
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

/**
 * Get collections with pagination support
 * @param page - Current page number (1-based)
 * @param perPage - Number of items per page
 * @returns Collection array for the requested page
 */
export const get_collections = (page = 1, perPage = 10): Collection[] => {
	const offset = (page - 1) * perPage
	const stmt = db.prepare(`
        SELECT * FROM collections_view
        LIMIT ? OFFSET ?
    `)
	return stmt.all(perPage, offset) as Collection[]
}

/**
 * Get total count of collections
 * @returns Total number of collections
 */
export const get_collections_count = (): number => {
	const stmt = db.prepare(`
        SELECT COUNT(*) as count FROM collections_view
    `)
	const result = stmt.get() as { count: number }
	return result.count
}
