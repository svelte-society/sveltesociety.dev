import type Stripe from 'stripe'
import type { MerchSearchService } from './search'

export interface SizeGuide {
	headers: string[]
	rows: string[][]
}

export interface MerchProduct {
	id: string
	title: string
	slug: string
	description: string | null
	base_price_cents: number
	currency: string
	images: string[]
	marketing_features: string[]
	variant_options: Array<{ name: string; values: string[] }>
	size_guide: SizeGuide | null
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
	price_cents: number
	sku: string | null
	active: boolean
	sort_order: number
	created_at: string
}

export interface MerchProductWithVariants extends MerchProduct {
	variants: MerchVariant[]
}

export class MerchProductService {
	private products = new Map<string, MerchProductWithVariants>()
	private slugIndex = new Map<string, string>()
	private initialized = false
	private initPromise: Promise<void> | null = null

	constructor(
		private stripe: Stripe,
		private searchService: MerchSearchService
	) {}

	async initialize(): Promise<void> {
		if (this.initialized) return
		if (this.initPromise) return this.initPromise

		this.initPromise = this._doInitialize()
		try {
			await this.initPromise
			this.initialized = true
		} catch (err) {
			this.initPromise = null
			throw err
		}
	}

	private async _doInitialize(): Promise<void> {
		const merchProducts: MerchProductWithVariants[] = []

		for await (const product of this.stripe.products.list({ limit: 100 })) {
			if (product.metadata.product_type !== 'merch') continue

			const prices: Stripe.Price[] = []
			for await (const price of this.stripe.prices.list({
				product: product.id,
				limit: 100
			})) {
				prices.push(price)
			}

			merchProducts.push(this.parseStripeProduct(product, prices))
		}

		this.products.clear()
		this.slugIndex.clear()

		for (const p of merchProducts) {
			this.products.set(p.id, p)
			this.slugIndex.set(p.slug, p.id)
		}

		this.searchService.loadFromProducts(merchProducts)
	}

	// --- Sync reads from cache ---

	getProductById(id: string): MerchProductWithVariants | null {
		return this.products.get(id) ?? null
	}

	getProductBySlug(slug: string): MerchProductWithVariants | null {
		const id = this.slugIndex.get(slug)
		if (!id) return null
		return this.products.get(id) ?? null
	}

	getAllProducts(filters?: { active?: boolean; limit?: number; offset?: number }): {
		products: MerchProductWithVariants[]
		count: number
	} {
		let all = Array.from(this.products.values())

		if (filters?.active !== undefined) {
			all = all.filter((p) => p.active === filters.active)
		}

		all.sort((a, b) => {
			if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order
			return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
		})

		const count = all.length
		const offset = filters?.offset ?? 0
		const limit = filters?.limit ?? 50
		const products = all.slice(offset, offset + limit)

		return { products, count }
	}

	getVariantById(variantId: string): MerchVariant | null {
		for (const product of this.products.values()) {
			const variant = product.variants.find((v) => v.id === variantId)
			if (variant) return variant
		}
		return null
	}

	// --- Async writes (Stripe API + cache update) ---

	async createProduct(data: {
		title: string
		slug: string
		description?: string
		base_price_cents: number
		currency?: string
		images?: string[]
		marketing_features?: string[]
		variant_options?: Array<{ name: string; values: string[] }>
		size_guide?: SizeGuide | null
		active?: boolean
		sort_order?: number
	}): Promise<MerchProduct> {
		const currency = data.currency || 'eur'

		const stripeProduct = await this.stripe.products.create({
			name: data.title,
			description: data.description || undefined,
			images: data.images?.slice(0, 8) || undefined,
			marketing_features: data.marketing_features?.map((name) => ({ name })) || undefined,
			active: data.active !== false,
			metadata: {
				product_type: 'merch',
				slug: data.slug,
				sort_order: String(data.sort_order || 0),
				base_price_cents: String(data.base_price_cents),
				currency,
				variant_options: JSON.stringify(data.variant_options || []),
				size_guide: data.size_guide ? JSON.stringify(data.size_guide) : ''
			}
		})

		const product: MerchProductWithVariants = {
			id: stripeProduct.id,
			title: data.title,
			slug: data.slug,
			description: data.description || null,
			base_price_cents: data.base_price_cents,
			currency,
			images: data.images || [],
			marketing_features: data.marketing_features || [],
			variant_options: data.variant_options || [],
			size_guide: data.size_guide || null,
			active: data.active !== false,
			sort_order: data.sort_order || 0,
			created_at: new Date(stripeProduct.created * 1000).toISOString(),
			updated_at: new Date(stripeProduct.updated * 1000).toISOString(),
			variants: []
		}

		this.products.set(product.id, product)
		this.slugIndex.set(product.slug, product.id)
		this.refreshSearchEntry(product)

		return product
	}

	async updateProduct(
		id: string,
		data: Partial<{
			title: string
			slug: string
			description: string
			base_price_cents: number
			currency: string
			images: string[]
			marketing_features: string[]
			variant_options: Array<{ name: string; values: string[] }>
			size_guide: SizeGuide | null
			active: boolean
			sort_order: number
		}>
	): Promise<MerchProduct | null> {
		const existing = this.products.get(id)
		if (!existing) return null

		const updateParams: Stripe.ProductUpdateParams = {}
		const metadataUpdates: Record<string, string> = {}

		if (data.title !== undefined) updateParams.name = data.title
		if (data.description !== undefined) updateParams.description = data.description
		if (data.images !== undefined) updateParams.images = data.images.slice(0, 8)
		if (data.marketing_features !== undefined)
			updateParams.marketing_features = data.marketing_features.map((name) => ({ name }))
		if (data.active !== undefined) updateParams.active = data.active

		if (data.slug !== undefined) metadataUpdates.slug = data.slug
		if (data.sort_order !== undefined) metadataUpdates.sort_order = String(data.sort_order)
		if (data.base_price_cents !== undefined)
			metadataUpdates.base_price_cents = String(data.base_price_cents)
		if (data.currency !== undefined) metadataUpdates.currency = data.currency
		if (data.variant_options !== undefined)
			metadataUpdates.variant_options = JSON.stringify(data.variant_options)
		if (data.size_guide !== undefined)
			metadataUpdates.size_guide = data.size_guide ? JSON.stringify(data.size_guide) : ''

		if (Object.keys(metadataUpdates).length > 0) {
			updateParams.metadata = metadataUpdates
		}

		const stripeProduct = await this.stripe.products.update(id, updateParams)

		const oldSlug = existing.slug
		const updated: MerchProductWithVariants = {
			...existing,
			title: data.title ?? existing.title,
			slug: data.slug ?? existing.slug,
			description: data.description !== undefined ? data.description : existing.description,
			base_price_cents: data.base_price_cents ?? existing.base_price_cents,
			currency: data.currency ?? existing.currency,
			images: data.images ?? existing.images,
			marketing_features: data.marketing_features ?? existing.marketing_features,
			variant_options: data.variant_options ?? existing.variant_options,
			size_guide: data.size_guide !== undefined ? data.size_guide : existing.size_guide,
			active: data.active ?? existing.active,
			sort_order: data.sort_order ?? existing.sort_order,
			updated_at: new Date(stripeProduct.updated * 1000).toISOString()
		}

		this.products.set(id, updated)

		if (data.slug !== undefined && data.slug !== oldSlug) {
			this.slugIndex.delete(oldSlug)
			this.slugIndex.set(data.slug, id)
		}

		this.refreshSearchEntry(updated)
		return updated
	}

	async deleteProduct(id: string): Promise<boolean> {
		const existing = this.products.get(id)
		if (!existing) return false

		await this.stripe.products.update(id, { active: false })

		// Mark inactive in cache (matches Stripe state)
		const updated = { ...existing, active: false }
		this.products.set(id, updated)
		this.refreshSearchEntry(updated)

		return true
	}

	// Variant CRUD

	async createVariant(
		productId: string,
		data: {
			option_values: Record<string, string>
			label: string
			price_cents: number
			currency?: string
			styria_product_code?: string
			sku?: string
			active?: boolean
			sort_order?: number
		}
	): Promise<MerchVariant> {
		const product = this.products.get(productId)
		if (!product) throw new Error(`Product ${productId} not found`)

		const price = await this.stripe.prices.create({
			product: productId,
			unit_amount: data.price_cents,
			currency: data.currency || product.currency,
			nickname: data.label,
			active: data.active !== false,
			metadata: {
				product_type: 'merch',
				option_values: JSON.stringify(data.option_values),
				sku: data.sku || '',
				styria_product_code: data.styria_product_code || '',
				sort_order: String(data.sort_order || 0)
			}
		})

		const variant: MerchVariant = {
			id: price.id,
			product_id: productId,
			option_values: data.option_values,
			label: data.label,
			price_cents: data.price_cents,
			styria_product_code: data.styria_product_code || null,
			sku: data.sku || null,
			active: data.active !== false,
			sort_order: data.sort_order || 0,
			created_at: new Date(price.created * 1000).toISOString()
		}

		product.variants.push(variant)
		this.refreshSearchEntry(product)

		return variant
	}

	async updateVariant(
		variantId: string,
		data: Partial<{
			option_values: Record<string, string>
			label: string
			styria_product_code: string
			sku: string
			active: boolean
			sort_order: number
		}>
	): Promise<MerchVariant | null> {
		let product: MerchProductWithVariants | null = null
		let variantIndex = -1

		for (const p of this.products.values()) {
			const idx = p.variants.findIndex((v) => v.id === variantId)
			if (idx !== -1) {
				product = p
				variantIndex = idx
				break
			}
		}

		if (!product || variantIndex === -1) return null

		const existing = product.variants[variantIndex]

		const updateParams: Stripe.PriceUpdateParams = {}
		const metadataUpdates: Record<string, string> = {}

		if (data.label !== undefined) updateParams.nickname = data.label
		if (data.active !== undefined) updateParams.active = data.active
		if (data.option_values !== undefined)
			metadataUpdates.option_values = JSON.stringify(data.option_values)
		if (data.sku !== undefined) metadataUpdates.sku = data.sku
		if (data.styria_product_code !== undefined)
			metadataUpdates.styria_product_code = data.styria_product_code
		if (data.sort_order !== undefined) metadataUpdates.sort_order = String(data.sort_order)

		if (Object.keys(metadataUpdates).length > 0) {
			updateParams.metadata = metadataUpdates
		}

		await this.stripe.prices.update(variantId, updateParams)

		const updated: MerchVariant = {
			...existing,
			label: data.label ?? existing.label,
			option_values: data.option_values ?? existing.option_values,
			styria_product_code:
				data.styria_product_code !== undefined
					? data.styria_product_code
					: existing.styria_product_code,
			sku: data.sku !== undefined ? data.sku : existing.sku,
			active: data.active ?? existing.active,
			sort_order: data.sort_order ?? existing.sort_order
		}

		product.variants[variantIndex] = updated
		this.refreshSearchEntry(product)

		return updated
	}

	async deleteVariant(variantId: string): Promise<boolean> {
		let product: MerchProductWithVariants | null = null
		let variantIndex = -1

		for (const p of this.products.values()) {
			const idx = p.variants.findIndex((v) => v.id === variantId)
			if (idx !== -1) {
				product = p
				variantIndex = idx
				break
			}
		}

		if (!product || variantIndex === -1) return false

		await this.stripe.prices.update(variantId, { active: false })

		product.variants.splice(variantIndex, 1)
		this.refreshSearchEntry(product)

		return true
	}

	// --- Helpers ---

	private parseStripeProduct(
		product: Stripe.Product,
		prices: Stripe.Price[]
	): MerchProductWithVariants {
		const metadata = product.metadata || {}

		let sizeGuide: SizeGuide | null = null
		if (metadata.size_guide) {
			try {
				sizeGuide = JSON.parse(metadata.size_guide)
			} catch {
				// Invalid JSON
			}
		}

		let variantOptions: Array<{ name: string; values: string[] }> = []
		if (metadata.variant_options) {
			try {
				variantOptions = JSON.parse(metadata.variant_options)
			} catch {
				// Invalid JSON
			}
		}

		// Separate variant prices from base/non-variant prices
		const variantPrices = prices.filter((p) => p.metadata.option_values)

		const variants: MerchVariant[] = variantPrices.map((price) => {
			let optionValues: Record<string, string> = {}
			if (price.metadata.option_values) {
				try {
					optionValues = JSON.parse(price.metadata.option_values)
				} catch {
					// Invalid JSON
				}
			}

			return {
				id: price.id,
				product_id: product.id,
				option_values: optionValues,
				label: price.nickname || Object.values(optionValues).join(' / ') || 'Default',
				price_cents: price.unit_amount || 0,
				styria_product_code: price.metadata.styria_product_code || null,
				sku: price.metadata.sku || null,
				active: price.active,
				sort_order: parseInt(price.metadata.sort_order || '0'),
				created_at: new Date(price.created * 1000).toISOString()
			}
		})

		variants.sort((a, b) => a.sort_order - b.sort_order)

		const basePriceCents = metadata.base_price_cents
			? parseInt(metadata.base_price_cents)
			: variants[0]?.price_cents || 0

		return {
			id: product.id,
			title: product.name,
			slug: metadata.slug || product.id,
			description: product.description || null,
			base_price_cents: basePriceCents,
			currency: metadata.currency || prices[0]?.currency || 'eur',
			images: product.images || [],
			marketing_features: (product.marketing_features || [])
				.map((f) => f.name)
				.filter((n): n is string => !!n),
			variant_options: variantOptions,
			size_guide: sizeGuide,
			active: product.active,
			sort_order: parseInt(metadata.sort_order || '0'),
			created_at: new Date(product.created * 1000).toISOString(),
			updated_at: new Date(product.updated * 1000).toISOString(),
			variants
		}
	}

	private refreshSearchEntry(product: MerchProductWithVariants) {
		const activeVariants = product.variants.filter((v) => v.active)
		const prices = activeVariants.map((v) => v.price_cents)

		const searchData = {
			id: product.id,
			title: product.title,
			description: product.description || '',
			slug: product.slug,
			base_price_cents: product.base_price_cents,
			min_price_cents: prices.length > 0 ? Math.min(...prices) : product.base_price_cents,
			max_price_cents: prices.length > 0 ? Math.max(...prices) : product.base_price_cents,
			currency: product.currency,
			images: product.images,
			variant_count: product.variants.length,
			in_stock: true,
			active: product.active,
			created_at: product.created_at,
			updated_at: product.updated_at
		}

		try {
			this.searchService.update(product.id, searchData)
		} catch {
			this.searchService.add(searchData)
		}
	}
}
