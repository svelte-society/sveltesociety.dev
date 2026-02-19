import type { TypedDocument, Orama, Results, SearchParams } from '@orama/orama'
import { create, insertMultiple, search, update, remove, getByID, insert } from '@orama/orama'
import { Database } from 'bun:sqlite'

const merchSchema = {
	id: 'string',
	title: 'string',
	description: 'string',
	slug: 'string',
	base_price_cents: 'number',
	min_price_cents: 'number',
	max_price_cents: 'number',
	currency: 'string',
	images: 'string[]',
	variant_count: 'number',
	in_stock: 'boolean',
	active: 'boolean',
	created_at: 'string',
	updated_at: 'string'
} as const

type MerchDocument = TypedDocument<Orama<typeof merchSchema>>

export class MerchSearchService {
	private searchDB: Orama<typeof merchSchema>

	constructor(private db: Database) {
		this.searchDB = create({
			schema: merchSchema
		})

		// Load all active products with variant info
		const products = this.db
			.query(
				`
				SELECT
					p.id, p.title, COALESCE(p.description, '') as description, p.slug,
					p.base_price_cents, p.currency, p.images, p.active,
					p.created_at, p.updated_at,
					COUNT(v.id) as variant_count,
					MIN(COALESCE(v.price_cents, p.base_price_cents)) as min_price_cents,
					MAX(COALESCE(v.price_cents, p.base_price_cents)) as max_price_cents,
					COALESCE(SUM(CASE WHEN v.stock_quantity > 0 AND v.active = 1 THEN 1 ELSE 0 END), 0) > 0 as in_stock
				FROM merch_products p
				LEFT JOIN merch_variants v ON v.product_id = p.id
				GROUP BY p.id
				`
			)
			.all()
			.map((p: any) => ({
				...p,
				images: p.images ? JSON.parse(p.images) : [],
				active: Boolean(p.active),
				in_stock: Boolean(p.in_stock),
				min_price_cents: p.min_price_cents || p.base_price_cents,
				max_price_cents: p.max_price_cents || p.base_price_cents,
				created_at: p.created_at || '',
				updated_at: p.updated_at || ''
			}))

		insertMultiple(this.searchDB, products)
	}

	search(filters?: {
		query?: string
		in_stock?: boolean
		active?: boolean
		sort?: string
		order?: 'ASC' | 'DESC'
		limit?: number
		offset?: number
	}) {
		const {
			query = '',
			in_stock,
			active,
			sort = 'created_at',
			order = 'DESC',
			limit = 50,
			offset = 0
		} = filters || {}

		const where: Record<string, unknown> = {}
		if (in_stock !== undefined) where.in_stock = in_stock
		if (active !== undefined) where.active = active

		const searchParams: SearchParams<Orama<typeof merchSchema>> = {
			term: query,
			where,
			limit,
			offset,
			sortBy: {
				property: sort,
				order
			}
		}

		return search(this.searchDB, searchParams) as Results<MerchDocument>
	}

	getById(id: string) {
		return getByID(this.searchDB, id)
	}

	add(product: MerchDocument) {
		insert(this.searchDB, product)
	}

	update(id: string, data: Partial<MerchDocument>) {
		update(this.searchDB, id, data)
	}

	remove(id: string) {
		remove(this.searchDB, id)
	}

	reindex() {
		this.searchDB = create({
			schema: merchSchema
		})

		const products = this.db
			.query(
				`
				SELECT
					p.id, p.title, COALESCE(p.description, '') as description, p.slug,
					p.base_price_cents, p.currency, p.images, p.active,
					p.created_at, p.updated_at,
					COUNT(v.id) as variant_count,
					MIN(COALESCE(v.price_cents, p.base_price_cents)) as min_price_cents,
					MAX(COALESCE(v.price_cents, p.base_price_cents)) as max_price_cents,
					COALESCE(SUM(CASE WHEN v.stock_quantity > 0 AND v.active = 1 THEN 1 ELSE 0 END), 0) > 0 as in_stock
				FROM merch_products p
				LEFT JOIN merch_variants v ON v.product_id = p.id
				GROUP BY p.id
				`
			)
			.all()
			.map((p: any) => ({
				...p,
				images: p.images ? JSON.parse(p.images) : [],
				active: Boolean(p.active),
				in_stock: Boolean(p.in_stock),
				min_price_cents: p.min_price_cents || p.base_price_cents,
				max_price_cents: p.max_price_cents || p.base_price_cents,
				created_at: p.created_at || '',
				updated_at: p.updated_at || ''
			}))

		insertMultiple(this.searchDB, products)
	}
}
