import type { Database } from 'bun:sqlite'

/**
 * Checks if the database has any data in the content table.
 * @param db - The database instance to check
 * @returns {boolean} True if data exists, false otherwise
 */
export function hasData(db: Database): boolean {
	try {
		const result = db.prepare('SELECT COUNT(*) as count FROM content').get() as { count: number }
		return result.count > 0
	} catch (error) {
		console.error('Error checking if database has data:', error)
		return false
	}
}
