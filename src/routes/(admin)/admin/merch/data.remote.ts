import { form, query, command, getRequestEvent } from '$app/server'
import { z } from 'zod/v4'
import { checkAdminAuth } from '../authorization.remote'

const merchFiltersSchema = z.object({
	query: z.string().optional(),
	active: z.string().optional(),
	page: z.number().optional()
})

export const getMerchProducts = query(merchFiltersSchema, async (filters) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	const { products, count } = locals.merchProductService.getAllProducts({
		active: filters.active === 'true' ? true : filters.active === 'false' ? false : undefined,
		limit: 25,
		offset: ((filters.page || 1) - 1) * 25
	})

	return {
		products,
		pagination: {
			count,
			perPage: 25,
			currentPage: filters.page || 1
		}
	}
})

const productIdSchema = z.object({
	id: z.string()
})

export const getMerchProduct = query(productIdSchema, async ({ id }) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	return locals.merchProductService.getProductById(id)
})

const createProductSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	slug: z.string().min(1, 'Slug is required'),
	description: z.string().optional(),
	body: z.string().optional(),
	base_price_cents: z.number().int().min(1, 'Price must be at least 1 cent'),
	currency: z.string().optional(),
	images: z.array(z.string()).optional(),
	variant_options: z
		.array(z.object({ name: z.string(), values: z.array(z.string()) }))
		.optional()
})

export const createMerchProduct = form(createProductSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	try {
		// Check slug uniqueness
		const existing = locals.merchProductService.getProductBySlug(data.slug)
		if (existing) {
			return { success: false, text: 'A product with this slug already exists' }
		}

		// Create Stripe product
		const stripeProductId = await locals.stripeService.createStripeProduct({
			title: data.title,
			description: data.description,
			images: data.images
		})

		const product = locals.merchProductService.createProduct({
			...data,
			stripe_product_id: stripeProductId
		})

		return { success: true, text: 'Product created', productId: product.id }
	} catch (error) {
		console.error('Error creating product:', error)
		return { success: false, text: 'Failed to create product' }
	}
})

const updateProductSchema = z.object({
	id: z.string(),
	title: z.string().min(1).optional(),
	slug: z.string().min(1).optional(),
	description: z.string().optional(),
	body: z.string().optional(),
	base_price_cents: z.number().int().min(1).optional(),
	images: z.array(z.string()).optional(),
	variant_options: z
		.array(z.object({ name: z.string(), values: z.array(z.string()) }))
		.optional(),
	active: z.boolean().optional()
})

export const updateMerchProduct = form(updateProductSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	try {
		const { id, ...updates } = data
		const product = locals.merchProductService.updateProduct(id, updates)

		if (!product) {
			return { success: false, text: 'Product not found' }
		}

		await getMerchProducts({}).refresh()
		await getMerchProduct({ id }).refresh()

		return { success: true, text: 'Product updated' }
	} catch (error) {
		console.error('Error updating product:', error)
		return { success: false, text: 'Failed to update product' }
	}
})

const createVariantSchema = z.object({
	product_id: z.string(),
	label: z.string().min(1, 'Label is required'),
	option_values: z.record(z.string()),
	price_cents: z.number().int().optional(),
	stock_quantity: z.number().int().min(0).optional(),
	sku: z.string().optional(),
	styria_product_code: z.string().optional()
})

export const createVariant = form(createVariantSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	try {
		const product = locals.merchProductService.getProductById(data.product_id)
		if (!product) {
			return { success: false, text: 'Product not found' }
		}

		// Create Stripe price for this variant
		const priceCents = data.price_cents || product.base_price_cents
		let stripePriceId: string | undefined

		if (product.stripe_product_id) {
			stripePriceId = await locals.stripeService.createStripePrice(
				product.stripe_product_id,
				priceCents,
				product.currency
			)
		}

		const variant = locals.merchProductService.createVariant(data.product_id, {
			...data,
			stripe_price_id: stripePriceId
		})

		await getMerchProduct({ id: data.product_id }).refresh()

		return { success: true, text: 'Variant created', variantId: variant.id }
	} catch (error) {
		console.error('Error creating variant:', error)
		return { success: false, text: 'Failed to create variant' }
	}
})

const updateVariantSchema = z.object({
	id: z.string(),
	product_id: z.string(),
	label: z.string().optional(),
	option_values: z.record(z.string()).optional(),
	price_cents: z.number().int().nullable().optional(),
	stock_quantity: z.number().int().min(0).optional(),
	sku: z.string().optional(),
	styria_product_code: z.string().optional(),
	active: z.boolean().optional()
})

export const updateVariant = form(updateVariantSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	try {
		const { id, product_id, ...updates } = data

		// If price changed, create new Stripe price
		if (updates.price_cents !== undefined) {
			const product = locals.merchProductService.getProductById(product_id)
			if (product?.stripe_product_id) {
				const priceCents = updates.price_cents || product.base_price_cents
				const stripePriceId = await locals.stripeService.createStripePrice(
					product.stripe_product_id,
					priceCents,
					product.currency
				)
				;(updates as any).stripe_price_id = stripePriceId
			}
		}

		const variant = locals.merchProductService.updateVariant(id, updates)
		if (!variant) {
			return { success: false, text: 'Variant not found' }
		}

		await getMerchProduct({ id: product_id }).refresh()

		return { success: true, text: 'Variant updated' }
	} catch (error) {
		console.error('Error updating variant:', error)
		return { success: false, text: 'Failed to update variant' }
	}
})

const deleteVariantSchema = z.object({
	id: z.string(),
	product_id: z.string()
})

export const deleteVariant = command(deleteVariantSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	locals.merchProductService.deleteVariant(data.id)
	await getMerchProduct({ id: data.product_id }).refresh()
})

const toggleActiveSchema = z.object({
	id: z.string(),
	active: z.boolean()
})

export const toggleProductActive = command(toggleActiveSchema, async (data) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	locals.merchProductService.updateProduct(data.id, { active: data.active })
	await getMerchProducts({}).refresh()
})
