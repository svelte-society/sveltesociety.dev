import type { TypedDocument, Orama, Results, SearchParams } from '@orama/orama'
import { create, insertMultiple, search, update, remove, getByID, insert } from '@orama/orama'
import { z } from 'zod'
import { Database } from 'bun:sqlite'

// Create a Zod schema for query parameters
const querySchema = z.object({
	types: z.array(z.string()).optional(), // Content types to filter by (OR logic)
	tags: z.union([z.string(), z.array(z.string())]).optional(),
	authors: z.array(z.string()).optional(), // Author usernames for filtering
	query: z.string().optional(),
	status: z.string().optional(),
	sort: z.string().optional(),
	order: z.enum(['ASC', 'DESC']).optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
	// Job-specific filters
	position: z.array(z.string()).optional(),
	level: z.array(z.string()).optional(),
	remote: z.array(z.string()).optional()
})

type QuerySchema = z.infer<typeof querySchema>

const contentSchema = {
	id: 'string',
	title: 'string',
	description: 'string',
	tags: 'string[]',
	authors: 'string[]', // Author usernames for filtering
	type: 'string',
	status: 'string',
	created_at: 'string',
	published_at: 'string',
	likes: 'number',
	saves: 'number',
	stars: 'number',
	// Job-specific fields (empty string for non-jobs)
	position_type: 'string',
	seniority_level: 'string',
	remote_status: 'string'
} as const

type ContentDocument = TypedDocument<Orama<typeof contentSchema>>

export class SearchService {
	private searchDB: Orama<typeof contentSchema>

	constructor(private db: Database) {
		// Create Orama instance
		this.searchDB = create({
			schema: contentSchema,
			components: {
				tokenizer: {
					stemming: true,
					stemmerSkipProperties: ['tag', 'type', 'status']
				}
			}
		})

		// Fetch all content from the database and insert it into the orama index
		const content = this.db
			.query(
				`
        SELECT
          c.id, REPLACE(c.title, '-', ' ') as title, c.description, c.type, c.status, c.created_at, c.published_at, c.likes, c.saves,
          COALESCE(json_extract(c.metadata, '$.stars'), 0) as stars,
          COALESCE(json_extract(c.metadata, '$.position_type'), '') as position_type,
          COALESCE(json_extract(c.metadata, '$.seniority_level'), '') as seniority_level,
          COALESCE(json_extract(c.metadata, '$.remote_status'), '') as remote_status,
          (
            SELECT json_group_array(t.slug)
            FROM content_to_tags ct
            LEFT JOIN tags t ON ct.tag_id = t.id
            WHERE ct.content_id = c.id
          ) as tags,
          (
            SELECT json_group_array(COALESCE(u.name, u.username))
            FROM content_to_users cu
            LEFT JOIN users u ON cu.user_id = u.id
            WHERE cu.content_id = c.id
          ) as authors
        FROM content c
        GROUP BY c.id
        `
			)
			.all()
			.map((c: any) => ({
				...c,
				tags: c.tags ? (JSON.parse(c.tags).filter((tag: unknown) => tag !== null) as string[]) : [],
				authors: c.authors
					? (JSON.parse(c.authors).filter((author: unknown) => author !== null) as string[])
					: [],
				published_at: c.published_at || ''
			}))

		insertMultiple(this.searchDB, content)
	}

	search(filters?: QuerySchema) {
		let query = ''
		let types: string[] = []
		let status = ''
		let tags: string[] = []
		let authors: string[] = []
		let position: string[] = []
		let level: string[] = []
		let remote: string[] = []
		let sort = filters?.sort || 'published_at'
		let order = filters?.order || 'DESC'
		let limit = filters?.limit || 15
		let offset = filters?.offset || 0

		const result = querySchema.safeParse(filters)

		if (result?.data?.query) {
			query = result.data.query
		}

		if (result?.data?.types) {
			types = result.data.types
		}

		if (result?.data?.status) {
			status = result.data.status
		}

		if (result?.data?.tags) {
			if (Array.isArray(result.data.tags)) {
				tags = result.data.tags
			} else {
				tags = [result.data.tags]
			}
		}

		if (result?.data?.authors) {
			authors = result.data.authors
		}

		if (result?.data?.position) {
			position = result.data.position
		}

		if (result?.data?.level) {
			level = result.data.level
		}

		if (result?.data?.remote) {
			remote = result.data.remote
		}

		const searchParams: SearchParams<Orama<typeof contentSchema>> = {
			term: query,
			where: {
				...(tags.length > 0 && { tags }),
				...(authors.length > 0 && { authors }),
				...(types.length > 0 && { type: types }),
				...(status && { status }),
				// Job-specific filters
				...(position.length > 0 && { position_type: position }),
				...(level.length > 0 && { seniority_level: level }),
				...(remote.length > 0 && { remote_status: remote })
			},
			offset,
			limit,
			sortBy: {
				property: sort,
				order: order
			}
		}

		return search(this.searchDB, searchParams) as Results<ContentDocument>
	}

	/**
	 * Search for admin content listing with pending_review items first
	 */
	searchAdmin(filters: {
		query?: string
		type?: string
		status?: string
		limit?: number
		offset?: number
	}) {
		const { query = '', type, status, limit = 50, offset = 0 } = filters

		// Build where clause - only add status filter if it's a specific status (not 'all')
		const where: Record<string, unknown> = {}
		if (type) where.type = type
		if (status && status !== 'all') where.status = status

		const searchParams: SearchParams<Orama<typeof contentSchema>> = {
			term: query,
			where,
			limit,
			offset,
			// Custom sort: pending_review first, then by created_at DESC
			// Sort function receives [id, score, document] tuples
			sortBy: (a, b) => {
				const aDoc = a[2] as ContentDocument
				const bDoc = b[2] as ContentDocument

				// pending_review items come first
				const aIsPending = aDoc.status === 'pending_review' ? 0 : 1
				const bIsPending = bDoc.status === 'pending_review' ? 0 : 1

				if (aIsPending !== bIsPending) {
					return aIsPending - bIsPending
				}

				// Then sort by created_at DESC
				const aDate = aDoc.created_at || ''
				const bDate = bDoc.created_at || ''
				return bDate.localeCompare(aDate)
			}
		}

		const results = search(this.searchDB, searchParams) as Results<ContentDocument>

		return {
			hits: results.hits,
			count: results.count
		}
	}

	getContentById(id: string) {
		return getByID(this.searchDB, id)
	}

	update(id: string, data: any) {
		update(this.searchDB, id, {
			...data,
			title: data.title.replace('-', ' '),
			status: data.status || 'draft',
			published_at: data.published_at || ''
		})
	}

	remove(id: string) {
		remove(this.searchDB, id)
	}

	add(content: ContentDocument) {
		insert(this.searchDB, {
			...content,
			title: content.title.replace('-', ' '),
			status: content.status || 'draft',
			published_at: content.published_at || ''
		})
	}

	reindex() {
		// Clear existing index
		this.searchDB = create({
			schema: contentSchema,
			components: {
				tokenizer: {
					stemming: true,
					stemmerSkipProperties: ['tag', 'type', 'status']
				}
			}
		})

		// Fetch all content from the database and reindex
		const content = this.db
			.query(
				`
        SELECT
          c.id, REPLACE(c.title, '-', ' ') as title, c.description, c.type, c.status, c.created_at, c.published_at, c.likes, c.saves,
          COALESCE(json_extract(c.metadata, '$.stars'), 0) as stars,
          COALESCE(json_extract(c.metadata, '$.position_type'), '') as position_type,
          COALESCE(json_extract(c.metadata, '$.seniority_level'), '') as seniority_level,
          COALESCE(json_extract(c.metadata, '$.remote_status'), '') as remote_status,
          (
            SELECT json_group_array(t.slug)
            FROM content_to_tags ct
            LEFT JOIN tags t ON ct.tag_id = t.id
            WHERE ct.content_id = c.id
          ) as tags,
          (
            SELECT json_group_array(COALESCE(u.name, u.username))
            FROM content_to_users cu
            LEFT JOIN users u ON cu.user_id = u.id
            WHERE cu.content_id = c.id
          ) as authors
        FROM content c
        GROUP BY c.id
        `
			)
			.all()
			.map((c: any) => ({
				...c,
				tags: c.tags ? (JSON.parse(c.tags).filter((tag: unknown) => tag !== null) as string[]) : [],
				authors: c.authors
					? (JSON.parse(c.authors).filter((author: unknown) => author !== null) as string[])
					: [],
				published_at: c.published_at || ''
			}))

		insertMultiple(this.searchDB, content)
	}
}
