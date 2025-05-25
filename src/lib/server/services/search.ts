import type { TypedDocument, Orama, Results, SearchParams } from "@orama/orama";
import { create, insertMultiple, search, update, remove, getByID, insert } from '@orama/orama'
import { z } from 'zod'
import { Database } from 'bun:sqlite'

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

type ContentDocument = TypedDocument<Orama<typeof contentSchema>>;

export class SearchService {
  private searchDB: Orama<typeof contentSchema>

  constructor(private db: Database) {
    // Create Orama instance
    this.searchDB = create({
      schema: contentSchema,
      components: {
        tokenizer: {
          stemming: true,
          stemmerSkipProperties: ['tag', 'type']
        }
      }
    })

    // Fetch all content from the database and insert it into the orama index
    const content = this.db
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
      .map((c: any) => ({ 
        ...c, 
        tags: c.tags ? JSON.parse(c.tags).filter((tag: unknown) => tag !== null) as string[] : [] 
      }))

    insertMultiple(this.searchDB, content)
  }

  search(filters?: QuerySchema) {
    let query = ''
    let type = ''
    let tags: string[] = []
    let sort = filters?.sort || 'created_at'
    let order = filters?.order || 'DESC'
    let limit = filters?.limit || 15
    let offset = filters?.offset || 0

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

    const searchParams: SearchParams<Orama<typeof contentSchema>> = {
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
    }

    return search(this.searchDB, searchParams) as Results<ContentDocument>
  }

  getContentById(id: string) {
    return getByID(this.searchDB, id)
  }

  update(id: string, data: any) {
    update(this.searchDB, id, data)
  }

  remove(id: string) {
    remove(this.searchDB, id)
  }

  add(content: ContentDocument) {
    insert(this.searchDB, content)
  }

  reindex() {
    // Clear existing index
    this.searchDB = create({
      schema: contentSchema,
      components: {
        tokenizer: {
          stemming: true,
          stemmerSkipProperties: ['tag', 'type']
        }
      }
    })

    // Fetch all content from the database and reindex
    const content = this.db
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
      .map((c: any) => ({ 
        ...c, 
        tags: c.tags ? JSON.parse(c.tags).filter((tag: unknown) => tag !== null) as string[] : [] 
      }))

    insertMultiple(this.searchDB, content)
  }
}