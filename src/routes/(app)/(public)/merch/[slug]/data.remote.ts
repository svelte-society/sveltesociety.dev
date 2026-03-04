import { form, getRequestEvent, query } from '$app/server'
import { redirect } from '@sveltejs/kit'
import { z } from 'zod/v4'
import { getCart } from '../cart/cart.remote'

const productSlugSchema = z.object({
	slug: z.string()
})

export const getProduct = query(productSlugSchema, async ({ slug }) => {
	const { locals } = getRequestEvent()

	const product = locals.merchProductService.getProductBySlug(slug)
	if (!product) {
		return null
	}

	return product
})

export const getCartSummary = query(async () => {
	const { locals } = getRequestEvent()

	if (!locals.user) {
		return { itemCount: 0, totalCents: 0 }
	}

	return locals.merchCartService.getCartSummary(locals.user.id)
})

export const addToCart = form(
	z.object({
		slug: z.string(),
		quantity: z.string(),
		options: z.record(z.string(), z.string()).default({})
	}),
	async ({ slug, options, quantity: quantityStr }) => {
		const { locals } = getRequestEvent()

		if (!locals.user) {
			redirect(303, '/login')
		}

		const quantity = Math.max(1, Math.floor(Number(quantityStr)))

		const product = locals.merchProductService.getProductBySlug(slug)
		if (!product) {
			return { success: false as const, text: 'Product not found' }
		}

		const selectedOptions = options

		const variant = product.variants.find((v) =>
			(product.variant_options ?? []).every(
				(opt) => v.option_values[opt.name] === (selectedOptions[opt.name] ?? opt.values[0] ?? '')
			)
		)

		if (!variant) {
			return { success: false as const, text: 'No matching variant found' }
		}
		if (!variant.active) {
			return { success: false as const, text: `${variant.label} is no longer available` }
		}

		locals.merchCartService.addItem(locals.user.id, {
			productId: product.id,
			variantId: variant.id,
			productTitle: product.title,
			variantLabel: variant.label,
			image: product.images?.[0] || '',
			priceCents: variant.price_cents,
			quantity
		})

		await getCartSummary().refresh()
		await getCart().refresh()

		return { success: true as const, text: 'Added to cart' }
	}
)
