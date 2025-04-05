import type { TypedDocument, Orama, Results, SearchParams } from '@orama/orama'
import { create, insertMultiple, search as oramaSearch } from '@orama/orama'
import { z } from 'zod'
import { Database } from 'bun:sqlite'
import { DB_PATH } from '$env/static/private'

// Create a Zod schema for query parameters
const querySchema = z.object({
	type: z.string().optional(),
	tags: z.union([z.string(), z.array(z.string())]).optional(),
	query: z.string().optional(),
	sort: z.string().optional(),
	order: z.enum(['ASC', 'DESC']).optional(),
	limit: z.number().optional(),
	offset: z.number().optional()
})

type QuerySchema = z.infer<typeof querySchema>

const contentSchema = {
	id: 'string',
	title: 'string',
	description: 'string',
	tags: 'string[]',
	type: 'string',
  created_at: 'string',
  likes: 'number',
  saves: 'number',
} as const

const searchDB: Orama<typeof contentSchema> = create({
	schema: contentSchema,
	components: {
		tokenizer: {
			stemming: true,
			stemmerSkipProperties: ['tag', 'type']
		}
	}
})

type ContentDocument = TypedDocument<Orama<typeof contentSchema>>

// Initialize database
const db = new Database(DB_PATH, { strict: true })

// fetch all content from the database and insert it into the orama index, join tags using content_to_tags
const content = db
	.query(
		`
  SELECT 
    c.id, c.title, c.description, c.type, c.created_at, c.likes, c.saves,
    json_group_array(t.slug) as tags
  FROM content c
  LEFT JOIN content_to_tags ct ON c.id = ct.content_id
  LEFT JOIN tags t ON ct.tag_id = t.id
  WHERE c.status = "published"
  GROUP BY c.id
`
	)
	.all()
	.map((c) => ({ ...c, tags: JSON.parse(c.tags) }))

insertMultiple(searchDB, content)

const searchConstructor = () => {
	return (filters: QuerySchema): Results<ContentDocument> => {
		let query = ''
		let type = ''
		let tags: string[] = []
		let sort = filters.sort || 'created_at'
		let order = filters.order || 'DESC'
		let limit = filters.limit || 10
		let offset = filters.offset || 0

    console.log(sort, order)

		const result = querySchema.safeParse(filters)

		if (result?.data?.query) {
			query = result.data.query
		}

		if (result?.data?.type) {
			type = result.data.type
		}

		if (result?.data?.tags) {
			if (Array.isArray(result.data.tags)) {
				tags = result.data.tags
			} else {
				tags = [result.data.tags]
			}
		}

		console.log(query)

		return oramaSearch(searchDB, {
			term: query,
			where: {
				// conditionally add tags and type to the search, we need to add them using spreading
				...(tags.length > 0 && { tags }),
				...(type && { type })
			},
      offset,
      limit,
      sortBy: {
        property: sort,
        order: order
      }
		})
	}
}

export const search = searchConstructor()
