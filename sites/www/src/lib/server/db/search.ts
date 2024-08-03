import { db } from './index';

interface SearchResult {
    content_id: number;
    rank: number;
}

export const search_content = (query: string, limit: number = 20): number[] => {
    // Prepare the SQL statement
    const stmt = db.prepare(`
    SELECT content_id, rank
    FROM content_fts
    WHERE content_fts MATCH ?
    ORDER BY rank
    LIMIT ?
  `);

    try {
        // Execute the query
        const results = stmt.all(query, limit) as SearchResult[];

        // Extract and return only the content_ids
        return results.map(result => result.content_id);
    } catch (error) {
        console.error('Error performing full-text search:', error);
        return [];
    }
};