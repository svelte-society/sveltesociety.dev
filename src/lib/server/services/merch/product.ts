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

export interface MerchCatalogState {
	available: boolean
	stale: boolean
}

interface MerchCatalogOptions {
	cacheTtlMs?: number
	now?: () => number
}

export class MerchProductService {
	private products = new Map<string, MerchProductWithVariants>()
	private slugIndex = new Map<string, string>()
	private lastSuccessfulRefresh: number | null = null
	private refreshPromise: Promise<MerchCatalogState> | null = null

	constructor(
		private stripe: Stripe,
		private searchService: MerchSearchService,
		private options: MerchCatalogOptions = {}
	) {}

	async ensureCatalog(): Promise<MerchCatalogState> {
		const now = this.options.now?.() ?? Date.now()
		const cacheTtlMs = this.options.cacheTtlMs ?? 60_000

		if (this.lastSuccessfulRefresh !== null && now - this.lastSuccessfulRefresh < cacheTtlMs) {
			return { available: true, stale: false }
		}

		if (this.refreshPromise) return this.refreshPromise

		this.refreshPromise = this.refreshCatalog()
		try {
			return await this.refreshPromise
		} finally {
			this.refreshPromise = null
		}
	}

	private async refreshCatalog(): Promise<MerchCatalogState> {
		try {
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

			const products = new Map<string, MerchProductWithVariants>()
			const slugIndex = new Map<string, string>()
			for (const product of merchProducts) {
				products.set(product.id, product)
				slugIndex.set(product.slug, product.id)
			}

			this.searchService.loadFromProducts(merchProducts)
			this.products = products
			this.slugIndex = slugIndex
			this.lastSuccessfulRefresh = this.options.now?.() ?? Date.now()

			return { available: true, stale: false }
		} catch (error) {
			console.error('Unable to refresh the Stripe merch catalog:', error)
			const available = this.lastSuccessfulRefresh !== null
			return { available, stale: available }
		}
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
				label:
					price.metadata.label ||
					price.nickname ||
					Object.values(optionValues).join(' / ') ||
					'Default',
				price_cents: price.unit_amount || 0,
				styria_product_code: price.metadata.pn || price.metadata.styria_product_code || null,
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
}
