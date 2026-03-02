import type { TypedDocument, Orama, Results, SearchParams } from '@orama/orama'
import { create, insertMultiple, search, update, remove, getByID, insert } from '@orama/orama'
import type { MerchProductWithVariants } from './product'

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

	constructor() {
		this.searchDB = create({
			schema: merchSchema
		})
	}

	loadFromProducts(products: MerchProductWithVariants[]) {
		this.searchDB = create({
			schema: merchSchema
		})

		const docs = products.map((p) => {
			const activeVariants = p.variants.filter((v) => v.active)
			const prices = activeVariants.map((v) => v.price_cents)

			return {
				id: p.id,
				title: p.title,
				description: p.description || '',
				slug: p.slug,
				base_price_cents: p.base_price_cents,
				min_price_cents: prices.length > 0 ? Math.min(...prices) : p.base_price_cents,
				max_price_cents: prices.length > 0 ? Math.max(...prices) : p.base_price_cents,
				currency: p.currency,
				images: p.images,
				variant_count: p.variants.length,
				in_stock: true,
				active: p.active,
				created_at: p.created_at || '',
				updated_at: p.updated_at || ''
			}
		})

		insertMultiple(this.searchDB, docs)
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
}
