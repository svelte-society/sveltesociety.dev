import { Status } from '$lib/server/db/common'
import { db } from './index'
import type { Tag } from './tags'

interface GetContentParams {
	limit?: number
	offset?: number
	types?: string[]
}

type ContentInput = {
	title: string
	type: string
	status?: string
	body?: string
	rendered_body?: string
	slug: string
	description?: string
	metadata?: Record<string, any>
	children?: number[]
	tags?: number[]
}

export type Content = {
	id: number
	title: string
	type: string
	status: Status
	body: string
	rendered_body: string
	slug: string
	description: string
	metadata: Record<string, any>
	children: string
	created_at: string
	updated_at: string
	published_at: string | null
	likes: number
	saves: number
	liked?: boolean
	saved?: boolean
}

const s = {
	get_tag_id_by_slug: db.prepare<Pick<Tag, 'id'>>('SELECT t.id FROM tags t WHERE slug = @slug'),
	get_content_ids_by_tag_id: db.prepare<Pick<Content, 'id'>>(
		'SELECT ct.content_id FROM content_to_tags ct WHERE ct.tag_id = @tag_id LIMIT @limit OFFSET @offset'
	),
	get_content_by_id: db.prepare<Content>(`SELECT c.id,
            c.title,
            c.type,
            c.slug,
            c.description,
            c.children,
            c.created_at,
            c.updated_at,
            c.published_at,
            c.likes,
            c.saves
      FROM published_content c
      WHERE c.id = @content_id`),
	get_saved_content_ids_by_user_id: db.prepare(`
	     SELECT
					target_id
				FROM saves s
				WHERE s.user_id = @user_id
				LIMIT @limit OFFSET @offset`),
	get_user_has_liked_content: db.prepare(
		'SELECT 1 FROM likes WHERE user_id = @user_id AND target_id = @target_id'
	),
	get_user_has_saved_content: db.prepare(
		'SELECT 1 FROM saves WHERE user_id = @user_id AND target_id = @target_id'
	),
	get_tag_ids_for_content: db.prepare(
		'SELECT ct.tag_id FROM content_to_tags ct WHERE ct.content_id = @content_id'
	),
	get_tag_by_tag_id: db.prepare('SELECT * FROM tags WHERE tags.id = @tag_id'),
	get_content_by_slug: db.prepare<{ slug: string }, PreviewContent>(
		'SELECT * FROM published_content WHERE slug = @slug'
	)
}

export type PreviewContent = Omit<Content, 'body' | 'rendered_body'>

export const get_content = (
	{ limit = 15, offset = 0, types = [] },
	user_id: GetContentParams = {}
): PreviewContent[] => {
	const start = performance.now()
	let query = `
        SELECT
            id,
            title,
            type,
            slug,
            description,
            children,
            created_at,
            updated_at,
            published_at,
            likes,
            saves
        FROM published_content
        ORDER BY published_at ASC
    `

	const params: Record<string, any> = { limit, offset }

	if (types.length > 0) {
		query += ' WHERE type IN (' + types.map((_, i) => `@type${i}`).join(', ') + ')'
		types.forEach((type, i) => {
			params[`@type${i}`] = type
		})
	}

	query += ' LIMIT @limit OFFSET @offset'

	const stmt = db.prepare(query)
	let content = stmt.all(params) as PreviewContent[]

	content = add_tags(content)

	if (user_id) {
		content = add_user_liked_and_saved(user_id, content)
	}

	const end = performance.now()
	console.log(end - start)
	return content
}

export const get_all_content = (): PreviewContent[] => {
	console.warn('get_all_content: No limit provided, risk of memory exhaustion')
	const stmt = db.prepare(`
        SELECT
            id,
            title,
            type,
            slug,
            description,
            children,
            created_at,
            updated_at,
            published_at,
            likes,
            saves,
            status
        FROM content_without_collections
    `)
	return stmt.all() as PreviewContent[]
}

export const get_content_by_type = (type: string): PreviewContent[] => {
	console.warn('get_content_by_type: No limit provided, risk of memory exhaustion')
	const stmt = db.prepare(`
        SELECT
            id,
            title,
            type,
            slug,
            description,
            children,
            created_at,
            updated_at,
            published_at,
            likes,
            saves
        FROM published_content
        WHERE type = ?
    `)
	return stmt.all(type) as PreviewContent[]
}

export const get_content_by_slug = (slug: string, user_id: string): PreviewContent | undefined => {
	const content = s.get_content_by_slug.all({ slug })
	const content_with_tags = add_tags(content)
	const [full_content] = add_user_liked_and_saved(user_id, content_with_tags)

	return full_content
}

export const get_content_count = () => {
	const stmt = db.prepare('SELECT COUNT(*) as count FROM content')
	return (stmt.get() as { count: number }).count
}

export const get_tags_for_content = (content_ids: number[]): Tag[][] => {
	const stmt = db.prepare(`
        SELECT t.id, t.name, t.slug, t.color
        FROM content_to_tags ct
        JOIN tags t ON ct.tag_id = t.id
        WHERE ct.content_id = ?
      `)

	const getManyTags = db.transaction((ids: number[]) => {
		const results: Tag[][] = []
		for (const id of ids) {
			const tags = stmt.all(id) as Tag[]
			results.push(tags)
		}
		return results
	})

	return getManyTags(content_ids)
}

export const get_content_by_ids = (contentIds: number[]): PreviewContent[] => {
	if (contentIds.length === 0) {
		return []
	}

	const placeholders = contentIds.map(() => '?').join(',')
	const stmt = db.prepare(`
        SELECT
            id,
            title,
            type,
            slug,
            description,
            children,
            created_at,
            updated_at,
            published_at,
            likes,
            saves
        FROM published_content
        WHERE id IN (${placeholders})
    `)

	try {
		return stmt.all(...contentIds) as PreviewContent[]
	} catch (error) {
		console.error('Error fetching content:', error)
		return []
	}
}

interface GetContentByTagOptions {
	slug: string
	limit?: number
	offset?: number
}

export const get_content_by_tag = (options: GetContentByTagOptions, user_id: string): Content[] => {
	const { slug, limit = 10, offset = 0 } = options

	const start = performance.now()

	const transaction = db.transaction(() => {
		const tag = s.get_tag_id_by_slug.get({ slug }) as Tag
		const ids = s.get_content_ids_by_tag_id
			.all({ tag_id: tag.id, limit, offset })
			.map((ids) => ids.content_id)

		const content_without_tags = []

		for (const content_id of ids) {
			content_without_tags.push(s.get_content_by_id.get({ content_id }) as Content)
		}

		const content_with_tags = add_tags(content_without_tags)
		const content_with_interactions = add_user_liked_and_saved(user_id, content_with_tags)
		return content_with_interactions
	})

	const content = transaction()

	const stop = performance.now()

	console.log('Tag queries took: ', stop - start)

	return content
}

export const get_content_by_tag_count = (slug: string): number => {
	const queryCount = `
        SELECT COUNT(*) as count
        FROM published_content c
        JOIN content_to_tags ct ON c.id = ct.content_id
        JOIN tags t ON ct.tag_id = t.id
        WHERE t.slug = ?
    `

	const stmtCount = db.prepare(queryCount)

	const { count } = stmtCount.get(slug) as { count: number }

	return count
}

interface GetSavedContentOptions {
	user_id: string
	limit?: number
	offset?: number
}

export function get_user_saved_content(options: GetSavedContentOptions): Content[] {
	const { user_id, limit = 2, offset = 5 } = options

	const saved_content_ids = s.get_saved_content_ids_by_user_id
		.all({ user_id, limit, offset })
		.map((ids) => ids.target_id)

	const content: Content[] = []

	const get_many = db.transaction((ids) => {
		for (const content_id of ids) {
			content.push(s.get_content_by_id.get({ content_id }) as Content)
		}
	})

	get_many(saved_content_ids)
	return content
}

export const delete_content = (id: number): boolean => {
	const stmt = db.prepare(`
        DELETE FROM content
        WHERE id = ?
    `)

	try {
		const result = stmt.run(id)
		return result.changes > 0
	} catch (error) {
		console.error('Error deleting content:', error)
		return false
	}
}

export const create_content = (input: ContentInput): number | null => {
	const {
		title,
		type,
		status = Status.DRAFT,
		body = null,
		rendered_body = null,
		slug,
		description = null,
		metadata = null,
		children = null,
		tags = null
	} = input

	const stmt = db.prepare(`
        INSERT INTO content (
            title,
            type,
            status,
            body,
            rendered_body,
            slug,
            description,
            metadata,
            children,
            created_at,
            updated_at
        ) VALUES (
            @title,
            @type,
            @status,
            @body,
            @rendered_body,
            @slug,
            @description,
            @metadata,
            @children,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        )
    `)

	try {
		const result = stmt.run({
			title,
			type,
			status,
			body,
			rendered_body,
			slug,
			description,
			metadata: metadata ? JSON.stringify(metadata) : null,
			children: children ? JSON.stringify(children) : null
		})
		update_content_tags(Number(result.lastInsertRowid), tags ?? [])

		// Return the ID of the newly inserted content
		return result.lastInsertRowid as number
	} catch (error) {
		console.error('Error creating content:', error)
		return null
	}
}

export const get_content_by_id = (id: number): Content | null => {
	const stmt = db.prepare(`
        SELECT *
        FROM content
        WHERE id = ?
    `)

	try {
		const result = stmt.get(id) as
			| (Omit<Content, 'children'> & { children: string })
			| undefined

		if (!result) {
			return null
		}

		const children = result.children ? JSON.parse(result.children) : []

		return {
			...result,
			metadata: JSON.parse((result.metadata as unknown as string | undefined) ?? '{}'),
			children
		}
	} catch (error) {
		console.error('Error fetching content by id:', error)
		return null
	}
}

export const update_content = (input: ContentInput & { id: number }): boolean => {
	const {
		id,
		title,
		type,
		status,
		body,
		rendered_body,
		slug,
		description,
		metadata,
		children,
		tags
	} = input

	const stmt = db.prepare(`
        UPDATE content
        SET
            title = @title,
            type = @type,
            status = @status,
            body = @body,
            rendered_body = @rendered_body,
            slug = @slug,
            description = @description,
            metadata = @metadata,
            children = @children,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = @id
    `)

	try {
		const result = stmt.run({
			id,
			title,
			type,
			status,
			body,
			rendered_body,
			slug,
			description,
			metadata: metadata ? JSON.stringify(metadata) : null,
			children: children ? JSON.stringify(children) : null
		})
		update_content_tags(id, tags ?? [])

		return result.changes > 0
	} catch (error) {
		console.error('Error updating content:', error)
		return false
	}
}

export const update_content_tags = (contentId: number, tags: number[]) => {
	const remove_tags = db.prepare(`
    DELETE FROM content_to_tags
           WHERE content_id = @contentId AND tag_id NOT IN (${tags.map((_) => '?').join(',')})
    `)
	const upsert_tags = db.prepare(`
    INSERT INTO content_to_tags (content_id, tag_id)
        SELECT @contentId AS content_id, tags.id AS tag_id
        FROM tags
        WHERE tags.id in (${tags.map((_) => '?').join(',')})
    ON CONFLICT DO NOTHING

    `)

	try {
		remove_tags.run({ contentId }, ...tags)
		upsert_tags.run({ contentId }, ...tags)
	} catch (error) {
		console.error('Error updating content tags:', error)
	}
}

export function add_user_liked_and_saved(user_id, rows) {
	if (user_id) {
		for (const row of rows) {
			if (s.get_user_has_liked_content.get({ user_id, target_id: row.id })) {
				rows.find((c) => c.id === row.id).liked = true
			} else {
				row.liked = false
			}
			if (s.get_user_has_saved_content.get({ user_id, target_id: row.id })) {
				rows.find((c) => c.id === row.id).saved = true
			} else {
				row.saved = false
			}
		}
	}
	return rows
}

export function add_tags(rows) {
	return rows.map((c) => {
		const tag_ids = s.get_tag_ids_for_content.all({ content_id: c.id }).map((t) => t.tag_id)

		const tags = []

		for (const tag_id of tag_ids) {
			tags.push(s.get_tag_by_tag_id.get({ tag_id }))
		}

		return {
			...c,
			tags
		}
	})
}

export function add_children(rows) {
	return rows.map((c) => {
		const parsed_children = JSON.parse(c.children)
		if (parsed_children.length === 0) return { ...c, children: [] }
		console.log()
		const children = rows.children.map((id) => {
			return s.get_content_by_id.get(id)
		})

		return {
			...c,
			children
		}
	})
}
