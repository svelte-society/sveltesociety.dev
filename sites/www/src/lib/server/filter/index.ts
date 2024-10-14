import { db } from '$lib/server/db'
import { z } from 'zod'
import { add_user_liked_and_saved } from '../db/content'

export const filter_content_schema = z
	.object({
		types: z.array(z.string()),
		tags: z.array(z.string()),
		search: z.string(),
		sort: z.enum(['latest', 'oldest', 'most_liked', 'most_saved']),
		limit: z.number().default(20),
		offset: z.number().default(0)
	})
	.partial()
	.refine((data) => !!data.types || !!data.tags || !!data.search, 'No value was provided')

export type filter_content_schema = z.infer<typeof filter_content_schema>

function get_content_ids(filters: filter_content_schema): string[] {
	let query = 'SELECT DISTINCT c.id FROM published_content c'
	const params: Record<string, string | number> = {}

	if (filters.search) {
		query += ' JOIN content_fts fts ON c.id = fts.content_id'
	}
	if (filters.tags && filters.tags.length > 0) {
		query += ' JOIN content_to_tags ct ON c.id = ct.content_id JOIN tags t ON ct.tag_id = t.id'
	}

	if (filters.search) {
		query += ' AND fts.content_fts MATCH @search'
		params.search = filters.search
	}
	if (filters.types && filters.types.length > 0) {
		query += ' AND c.type IN (@types)'
		params.types = filters.types.join(',')
	}
	if (filters.tags && filters.tags.length > 0) {
		query += ' AND t.slug IN (@tags)'
		params.tags = filters.tags.join(',')
	}

	const stmt = db.prepare(query)
	return stmt.all(params).map((row: any) => row.id)
}

function get_content_details(ids: string[]): any[] {
	if (ids.length === 0) return []
	const query = `
		SELECT id, title, description, type, published_at, likes, saves
		FROM published_content
		WHERE id IN (${ids.map(() => '?').join(',')})
	`
	return db.prepare(query).all(ids)
}

function get_content_tags(ids: string[]): Record<string, string[]> {
	if (ids.length === 0) return {}
	const query = `
		SELECT ct.content_id, t.slug
		FROM content_to_tags ct
		JOIN tags t ON ct.tag_id = t.id
		WHERE ct.content_id IN (${ids.map(() => '?').join(',')})
	`
	const rows = db.prepare(query).all(ids)
	const tagMap: Record<string, string[]> = {}
	rows.forEach((row: any) => {
		if (!tagMap[row.content_id]) {
			tagMap[row.content_id] = []
		}
		tagMap[row.content_id].push(row.slug)
	})
	return tagMap
}

function apply_sorting(content: any[], sort: filter_content_schema['sort']): any[] {
	switch (sort) {
		case 'latest':
			return content.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
		case 'oldest':
			return content.sort((a, b) => new Date(a.published_at).getTime() - new Date(b.published_at).getTime())
		case 'most_liked':
			return content.sort((a, b) => b.likes - a.likes)
		case 'most_saved':
			return content.sort((a, b) => b.saves - a.saves)
		default:
			return content
	}
}

export function get_filtered_content(filters: filter_content_schema, user_id: string) {
	try {
		// Step 1: Get content IDs
		const ids = get_content_ids(filters)

		// Step 2: Get content details
		let content = get_content_details(ids)

		// Step 3: Get tags for content
		const tagMap = get_content_tags(ids)
		content = content.map(item => ({ ...item, tags: tagMap[item.id] || [] }))

		// Step 4: Apply sorting
		content = apply_sorting(content, filters.sort)

		// Step 5: Apply pagination
		content = content.slice(filters.offset || 0, (filters.offset || 0) + (filters.limit || 20))

		// Step 6: Add user-specific data
		if (user_id) {
			content = add_user_liked_and_saved(user_id, content)
		}

		return content
	} catch (error) {
		console.error('Error in get_filtered_content:', error)
		throw new Error('An error occurred while filtering content')
	}
}

export function create_indexes() {
	db.exec(`
		CREATE INDEX IF NOT EXISTS idx_content_status_type ON published_content(status, type);
		CREATE INDEX IF NOT EXISTS idx_content_published_at ON published_content(published_at);
		CREATE INDEX IF NOT EXISTS idx_content_likes ON published_content(likes);
		CREATE INDEX IF NOT EXISTS idx_content_saves ON published_content(saves);
		CREATE INDEX IF NOT EXISTS idx_content_to_tags_content_id ON content_to_tags(content_id);
		CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
	`)
}
