import { db } from './index'

export type Tag = {
	id: string
	name: string
	slug: string
	color?: string | null
	created_at: string
	updated_at: string
}

export const get_tags = (options?: { limit?: number; offset?: number }) => {
	const limit = options?.limit ?? 10
	const offset = options?.offset ?? 0
	
	const stmt = db.prepare('SELECT * FROM tags ORDER BY created_at DESC LIMIT ? OFFSET ?')
	return stmt.all(limit, offset) as Tag[]
}

export const get_tags_count = () => {
	const stmt = db.prepare('SELECT COUNT(*) as count FROM tags')
	return (stmt.get() as { count: number }).count
}

export const get_tag = (id: string) => {
	const stmt = db.prepare('SELECT * FROM tags WHERE id = ?')
	return stmt.get(id) as Tag | undefined
}

export const delete_tag = (id: string) => {
	const stmt = db.prepare('DELETE FROM tags WHERE id = ?')
	const result = stmt.run(id)
	return result.changes > 0
}

export const create_tag = (tag: Omit<Tag, 'id' | 'created_at' | 'updated_at' | 'color'>) => {
	const stmt = db.prepare('INSERT INTO tags (name, slug) VALUES (?, ?)')
	const result = stmt.run(tag.name, tag.slug)
	return String(result.lastInsertRowid)
}

export const update_tag = (tag: Omit<Tag, 'created_at' | 'updated_at'>) => {
	const stmt = db.prepare('UPDATE tags SET name = ?, slug = ? WHERE id = ?')
	const result = stmt.run(tag.name, tag.slug, tag.id)
	return result.changes > 0
}