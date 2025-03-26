import { Database } from 'bun:sqlite'

interface SearchResult {
	content_id: string
	rank: number
}

interface SearchOptions {
	query: string
	limit?: number
	searchFields?: ('title' | 'body' | 'description')[]
}

export class SearchService {
	constructor(private db: Database) {}

	/**
	 * Escapes special characters in a search query
	 */
	private escapeSearchQuery(query: string): string {
		// Replace any special characters that could break the FTS query
		return query.replace(/['"\\]/g, '')
	}

	/**
	 * Searches for content using the FTS index
	 */
	search({
		query,
		limit = 20,
		searchFields = ['title', 'body', 'description']
	}: SearchOptions): string[] {
		try {
			const escapedQuery = this.escapeSearchQuery(query)

			// Build the search query for specified fields
			const searchQuery = searchFields.map((field) => `${field}:${escapedQuery}*`).join(' OR ')

			// Prepare and execute the search statement
			const stmt = this.db.prepare(`
				SELECT content_id, rank
				FROM content_fts
				WHERE content_fts MATCH ?
				ORDER BY rank
				LIMIT ?
			`)

			const results = stmt.all(searchQuery, limit) as SearchResult[]
			return results.map((result) => result.content_id)
		} catch (error) {
			console.error('Error performing full-text search:', error)
			return []
		}
	}

	/**
	 * Returns the total count of matches for a search query
	 */
	count({
		query,
		searchFields = ['title', 'body', 'description']
	}: Omit<SearchOptions, 'limit'>): number {
		try {
			const escapedQuery = this.escapeSearchQuery(query)

			const searchQuery = searchFields.map((field) => `${field}:${escapedQuery}*`).join(' OR ')

			const stmt = this.db.prepare(`
				SELECT COUNT(*) as count
				FROM content_fts
				WHERE content_fts MATCH ?
			`)

			const result = stmt.get(searchQuery) as { count: number }
			return result.count
		} catch (error) {
			console.error('Error counting search results:', error)
			return 0
		}
	}
}
