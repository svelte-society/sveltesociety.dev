import { Database } from 'bun:sqlite'
import type { MerchSearchService } from './search'

export interface MerchProduct {
	id: string
	title: string
	slug: string
	description: string | null
	body: string | null
	rendered_body: string | null
	base_price_cents: number
	currency: string
	images: string[]
	variant_options: Array<{ name: string; values: string[] }>
	stripe_product_id: string | null
	active: boolean
	sort_order: number
	created_at: string
	updated_at: string
}

export interface MerchVariant {
	id: string
	product_id: string
	option_values: Record<string, string>
	label: string
	styria_product_code: string | null
	stripe_price_id: string | null
	price_cents: number | null
	stock_quantity: number
	sku: string | null
	active: boolean
	sort_order: number
	created_at: string
}

export interface MerchProductWithVariants extends MerchProduct {
	variants: MerchVariant[]
}

export class MerchProductService {
	constructor(
		private db: Database,
		private searchService: MerchSearchService
	) {}

	createProduct(data: {
		title: string
		slug: string
		description?: string
		body?: string
		rendered_body?: string
		base_price_cents: number
		currency?: string
		images?: string[]
		variant_options?: Array<{ name: string; values: string[] }>
		stripe_product_id?: string
		active?: boolean
		sort_order?: number
	}): MerchProduct {
		const stmt = this.db.prepare(`
			INSERT INTO merch_products (title, slug, description, body, rendered_body, base_price_cents, currency, images, variant_options, stripe_product_id, active, sort_order)
			VALUES ($title, $slug, $description, $body, $rendered_body, $base_price_cents, $currency, $images, $variant_options, $stripe_product_id, $active, $sort_order)
			RETURNING *
		`)

		const row = stmt.get({
			title: data.title,
			slug: data.slug,
			description: data.description || null,
			body: data.body || null,
			rendered_body: data.rendered_body || null,
			base_price_cents: data.base_price_cents,
			currency: data.currency || 'usd',
			images: JSON.stringify(data.images || []),
			variant_options: JSON.stringify(data.variant_options || []),
			stripe_product_id: data.stripe_product_id || null,
			active: data.active !== false ? 1 : 0,
			sort_order: data.sort_order || 0
		}) as any

		const product = this.parseProduct(row)

		// Update search index
		this.searchService.add({
			id: product.id,
			title: product.title,
			description: product.description || '',
			slug: product.slug,
			base_price_cents: product.base_price_cents,
			min_price_cents: product.base_price_cents,
			max_price_cents: product.base_price_cents,
			currency: product.currency,
			images: product.images,
			variant_count: 0,
			in_stock: false,
			active: product.active,
			created_at: product.created_at,
			updated_at: product.updated_at
		})

		return product
	}

	getProductById(id: string): MerchProductWithVariants | null {
		const product = this.db
			.prepare('SELECT * FROM merch_products WHERE id = $id')
			.get({ id }) as any
		if (!product) return null

		const variants = this.db
			.prepare('SELECT * FROM merch_variants WHERE product_id = $productId ORDER BY sort_order')
			.all({ productId: id }) as any[]

		return {
			...this.parseProduct(product),
			variants: variants.map((v) => this.parseVariant(v))
		}
	}

	getProductBySlug(slug: string): MerchProductWithVariants | null {
		const product = this.db
			.prepare('SELECT * FROM merch_products WHERE slug = $slug')
			.get({ slug }) as any
		if (!product) return null

		const variants = this.db
			.prepare('SELECT * FROM merch_variants WHERE product_id = $productId ORDER BY sort_order')
			.all({ productId: product.id }) as any[]

		return {
			...this.parseProduct(product),
			variants: variants.map((v) => this.parseVariant(v))
		}
	}

	getAllProducts(filters?: { active?: boolean; limit?: number; offset?: number }): {
		products: MerchProductWithVariants[]
		count: number
	} {
		const { active, limit = 50, offset = 0 } = filters || {}

		let whereClause = ''
		const params: Record<string, any> = { limit, offset }

		if (active !== undefined) {
			whereClause = 'WHERE active = $active'
			params.active = active ? 1 : 0
		}

		const countResult = this.db
			.prepare(`SELECT COUNT(*) as count FROM merch_products ${whereClause}`)
			.get(active !== undefined ? { active: params.active } : {}) as { count: number }

		const products = this.db
			.prepare(
				`SELECT * FROM merch_products ${whereClause} ORDER BY sort_order, created_at DESC LIMIT $limit OFFSET $offset`
			)
			.all(params) as any[]

		const result = products.map((p) => {
			const variants = this.db
				.prepare('SELECT * FROM merch_variants WHERE product_id = $productId ORDER BY sort_order')
				.all({ productId: p.id }) as any[]
			return {
				...this.parseProduct(p),
				variants: variants.map((v) => this.parseVariant(v))
			}
		})

		return { products: result, count: countResult.count }
	}

	updateProduct(
		id: string,
		data: Partial<{
			title: string
			slug: string
			description: string
			body: string
			rendered_body: string
			base_price_cents: number
			currency: string
			images: string[]
			variant_options: Array<{ name: string; values: string[] }>
			stripe_product_id: string
			active: boolean
			sort_order: number
		}>
	): MerchProduct | null {
		const sets: string[] = []
		const params: Record<string, any> = { id }

		if (data.title !== undefined) {
			sets.push('title = $title')
			params.title = data.title
		}
		if (data.slug !== undefined) {
			sets.push('slug = $slug')
			params.slug = data.slug
		}
		if (data.description !== undefined) {
			sets.push('description = $description')
			params.description = data.description
		}
		if (data.body !== undefined) {
			sets.push('body = $body')
			params.body = data.body
		}
		if (data.rendered_body !== undefined) {
			sets.push('rendered_body = $rendered_body')
			params.rendered_body = data.rendered_body
		}
		if (data.base_price_cents !== undefined) {
			sets.push('base_price_cents = $base_price_cents')
			params.base_price_cents = data.base_price_cents
		}
		if (data.currency !== undefined) {
			sets.push('currency = $currency')
			params.currency = data.currency
		}
		if (data.images !== undefined) {
			sets.push('images = $images')
			params.images = JSON.stringify(data.images)
		}
		if (data.variant_options !== undefined) {
			sets.push('variant_options = $variant_options')
			params.variant_options = JSON.stringify(data.variant_options)
		}
		if (data.stripe_product_id !== undefined) {
			sets.push('stripe_product_id = $stripe_product_id')
			params.stripe_product_id = data.stripe_product_id
		}
		if (data.active !== undefined) {
			sets.push('active = $active')
			params.active = data.active ? 1 : 0
		}
		if (data.sort_order !== undefined) {
			sets.push('sort_order = $sort_order')
			params.sort_order = data.sort_order
		}

		if (sets.length === 0) return null

		sets.push('updated_at = CURRENT_TIMESTAMP')

		const row = this.db
			.prepare(`UPDATE merch_products SET ${sets.join(', ')} WHERE id = $id RETURNING *`)
			.get(params) as any

		if (!row) return null

		const product = this.parseProduct(row)
		this.refreshSearchIndex(product.id)
		return product
	}

	deleteProduct(id: string): boolean {
		const result = this.db.prepare('DELETE FROM merch_products WHERE id = $id').run({ id })
		if (result.changes > 0) {
			try {
				this.searchService.remove(id)
			} catch {
				// Product may not be in index
			}
			return true
		}
		return false
	}

	// Variant CRUD

	createVariant(
		productId: string,
		data: {
			option_values: Record<string, string>
			label: string
			styria_product_code?: string
			stripe_price_id?: string
			price_cents?: number
			stock_quantity?: number
			sku?: string
			active?: boolean
			sort_order?: number
		}
	): MerchVariant {
		const stmt = this.db.prepare(`
			INSERT INTO merch_variants (product_id, option_values, label, styria_product_code, stripe_price_id, price_cents, stock_quantity, sku, active, sort_order)
			VALUES ($product_id, $option_values, $label, $styria_product_code, $stripe_price_id, $price_cents, $stock_quantity, $sku, $active, $sort_order)
			RETURNING *
		`)

		const row = stmt.get({
			product_id: productId,
			option_values: JSON.stringify(data.option_values),
			label: data.label,
			styria_product_code: data.styria_product_code || null,
			stripe_price_id: data.stripe_price_id || null,
			price_cents: data.price_cents ?? null,
			stock_quantity: data.stock_quantity || 0,
			sku: data.sku || null,
			active: data.active !== false ? 1 : 0,
			sort_order: data.sort_order || 0
		}) as any

		const variant = this.parseVariant(row)
		this.refreshSearchIndex(productId)
		return variant
	}

	updateVariant(
		variantId: string,
		data: Partial<{
			option_values: Record<string, string>
			label: string
			styria_product_code: string
			stripe_price_id: string
			price_cents: number | null
			stock_quantity: number
			sku: string
			active: boolean
			sort_order: number
		}>
	): MerchVariant | null {
		const sets: string[] = []
		const params: Record<string, any> = { id: variantId }

		if (data.option_values !== undefined) {
			sets.push('option_values = $option_values')
			params.option_values = JSON.stringify(data.option_values)
		}
		if (data.label !== undefined) {
			sets.push('label = $label')
			params.label = data.label
		}
		if (data.styria_product_code !== undefined) {
			sets.push('styria_product_code = $styria_product_code')
			params.styria_product_code = data.styria_product_code
		}
		if (data.stripe_price_id !== undefined) {
			sets.push('stripe_price_id = $stripe_price_id')
			params.stripe_price_id = data.stripe_price_id
		}
		if (data.price_cents !== undefined) {
			sets.push('price_cents = $price_cents')
			params.price_cents = data.price_cents
		}
		if (data.stock_quantity !== undefined) {
			sets.push('stock_quantity = $stock_quantity')
			params.stock_quantity = data.stock_quantity
		}
		if (data.sku !== undefined) {
			sets.push('sku = $sku')
			params.sku = data.sku
		}
		if (data.active !== undefined) {
			sets.push('active = $active')
			params.active = data.active ? 1 : 0
		}
		if (data.sort_order !== undefined) {
			sets.push('sort_order = $sort_order')
			params.sort_order = data.sort_order
		}

		if (sets.length === 0) return null

		const row = this.db
			.prepare(`UPDATE merch_variants SET ${sets.join(', ')} WHERE id = $id RETURNING *`)
			.get(params) as any

		if (!row) return null

		const variant = this.parseVariant(row)
		this.refreshSearchIndex(variant.product_id)
		return variant
	}

	deleteVariant(variantId: string): boolean {
		const variant = this.db
			.prepare('SELECT product_id FROM merch_variants WHERE id = $id')
			.get({ id: variantId }) as { product_id: string } | null

		const result = this.db
			.prepare('DELETE FROM merch_variants WHERE id = $id')
			.run({ id: variantId })
		if (result.changes > 0 && variant) {
			this.refreshSearchIndex(variant.product_id)
			return true
		}
		return false
	}

	getVariantById(variantId: string): MerchVariant | null {
		const row = this.db
			.prepare('SELECT * FROM merch_variants WHERE id = $id')
			.get({ id: variantId }) as any
		return row ? this.parseVariant(row) : null
	}

	getVariantsByProductId(productId: string): MerchVariant[] {
		const rows = this.db
			.prepare('SELECT * FROM merch_variants WHERE product_id = $productId ORDER BY sort_order')
			.all({ productId }) as any[]
		return rows.map((v) => this.parseVariant(v))
	}

	decrementStock(variantId: string, quantity: number = 1): boolean {
		const result = this.db
			.prepare(
				'UPDATE merch_variants SET stock_quantity = stock_quantity - $quantity WHERE id = $id AND stock_quantity >= $quantity'
			)
			.run({ id: variantId, quantity })

		if (result.changes > 0) {
			const variant = this.getVariantById(variantId)
			if (variant) {
				this.refreshSearchIndex(variant.product_id)
			}
			return true
		}
		return false
	}

	// Helpers

	private refreshSearchIndex(productId: string) {
		try {
			const product = this.db
				.prepare('SELECT * FROM merch_products WHERE id = $id')
				.get({ id: productId }) as any
			if (!product) return

			const variants = this.db
				.prepare('SELECT * FROM merch_variants WHERE product_id = $productId')
				.all({ productId }) as any[]

			const activeVariants = variants.filter((v) => v.active)
			const prices = activeVariants.map((v) => v.price_cents || product.base_price_cents)
			const inStock = activeVariants.some((v) => v.stock_quantity > 0)

			const searchData = {
				id: product.id,
				title: product.title,
				description: product.description || '',
				slug: product.slug,
				base_price_cents: product.base_price_cents,
				min_price_cents: prices.length > 0 ? Math.min(...prices) : product.base_price_cents,
				max_price_cents: prices.length > 0 ? Math.max(...prices) : product.base_price_cents,
				currency: product.currency,
				images: product.images ? JSON.parse(product.images) : [],
				variant_count: variants.length,
				in_stock: inStock,
				active: Boolean(product.active),
				created_at: product.created_at || '',
				updated_at: product.updated_at || ''
			}

			try {
				this.searchService.update(productId, searchData)
			} catch {
				this.searchService.add(searchData)
			}
		} catch (error) {
			console.error('Error refreshing merch search index:', error)
		}
	}

	private parseProduct(row: any): MerchProduct {
		return {
			...row,
			images: row.images ? JSON.parse(row.images) : [],
			variant_options: row.variant_options ? JSON.parse(row.variant_options) : [],
			active: Boolean(row.active)
		}
	}

	private parseVariant(row: any): MerchVariant {
		return {
			...row,
			option_values: row.option_values ? JSON.parse(row.option_values) : {},
			active: Boolean(row.active)
		}
	}
}
