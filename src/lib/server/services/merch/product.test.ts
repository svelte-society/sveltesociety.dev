import { afterEach, beforeEach, describe, expect, spyOn, test } from 'bun:test'
import type Stripe from 'stripe'
import { MerchProductService } from './product'
import { MerchSearchService } from './search'

function asyncList<T>(items: T[], beforeRead?: () => void): AsyncIterable<T> {
	return {
		async *[Symbol.asyncIterator]() {
			beforeRead?.()
			for (const item of items) yield item
		}
	}
}

function stripeProduct(): Stripe.Product {
	return {
		id: 'prod_merch_shirt',
		object: 'product',
		active: true,
		created: 1,
		default_price: null,
		description: 'A shirt',
		images: [],
		livemode: false,
		marketing_features: [],
		metadata: {
			product_type: 'merch',
			slug: 'svelte-shirt',
			sort_order: '1',
			base_price_cents: '2000',
			currency: 'eur',
			variant_options: JSON.stringify([{ name: 'Size', values: ['S'] }])
		},
		name: 'Svelte Shirt',
		package_dimensions: null,
		shippable: true,
		statement_descriptor: null,
		tax_code: null,
		type: 'good',
		unit_label: null,
		updated: 2,
		url: null
	}
}

function stripePrice(): Stripe.Price {
	return {
		id: 'price_merch_shirt_s',
		object: 'price',
		active: true,
		billing_scheme: 'per_unit',
		created: 1,
		currency: 'eur',
		custom_unit_amount: null,
		livemode: false,
		lookup_key: null,
		metadata: {
			label: 'Small',
			option_values: JSON.stringify({ Size: 'S' }),
			sku: 'SHIRT-S',
			pn: 'SHIRT-S',
			sort_order: '1'
		},
		nickname: 'Small',
		product: 'prod_merch_shirt',
		recurring: null,
		tax_behavior: 'exclusive',
		tiers_mode: null,
		transform_quantity: null,
		type: 'one_time',
		unit_amount: 2000,
		unit_amount_decimal: '2000'
	}
}

describe('MerchProductService catalog cache', () => {
	let now: number
	let productReads: number
	let failProductRead: boolean
	let service: MerchProductService
	let consoleErrorSpy: ReturnType<typeof spyOn>

	beforeEach(() => {
		consoleErrorSpy = spyOn(console, 'error').mockImplementation(() => {})
		now = 1_000
		productReads = 0
		failProductRead = false

		const stripe = {
			products: {
				list: () =>
					asyncList([stripeProduct()], () => {
						productReads += 1
						if (failProductRead) throw new Error('Stripe unavailable')
					})
			},
			prices: {
				list: () => asyncList([stripePrice()])
			}
		} as unknown as Stripe

		service = new MerchProductService(stripe, new MerchSearchService(), {
			cacheTtlMs: 100,
			now: () => now
		})
	})

	afterEach(() => {
		consoleErrorSpy.mockRestore()
	})

	test('loads the catalog only when requested', async () => {
		expect(productReads).toBe(0)

		const state = await service.ensureCatalog()

		expect(state).toEqual({ available: true, stale: false })
		expect(productReads).toBe(1)
		expect(service.getProductBySlug('svelte-shirt')?.title).toBe('Svelte Shirt')
		expect(service.getVariantById('price_merch_shirt_s')?.styria_product_code).toBe('SHIRT-S')
	})

	test('reuses a successful catalog within the TTL', async () => {
		await service.ensureCatalog()
		now += 99

		const state = await service.ensureCatalog()

		expect(state).toEqual({ available: true, stale: false })
		expect(productReads).toBe(1)
	})

	test('keeps the last successful catalog when refresh fails', async () => {
		await service.ensureCatalog()
		now += 101
		failProductRead = true

		const state = await service.ensureCatalog()

		expect(state).toEqual({ available: true, stale: true })
		expect(productReads).toBe(2)
		expect(service.getProductBySlug('svelte-shirt')?.title).toBe('Svelte Shirt')
	})

	test('reports unavailable when the first catalog load fails', async () => {
		failProductRead = true

		const state = await service.ensureCatalog()

		expect(state).toEqual({ available: false, stale: false })
		expect(service.getAllProducts().products).toEqual([])
	})
})
