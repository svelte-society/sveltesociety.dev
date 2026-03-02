import { form, query, getRequestEvent } from '$app/server'
import { redirect } from '@sveltejs/kit'
import { z } from 'zod/v4'

export const getCart = query(async () => {
	const { locals } = getRequestEvent()

	if (!locals.user) {
		return { items: [], summary: { itemCount: 0, totalCents: 0 } }
	}

	const items = locals.merchCartService.getCartItems(locals.user.id)
	const summary = locals.merchCartService.getCartSummary(locals.user.id)

	return { items, summary }
})

const variantSchema = z.object({ variant_id: z.string() })

export const incrementQuantity = form(variantSchema, async ({ variant_id }) => {
	const { locals } = getRequestEvent()

	if (!locals.user) {
		redirect(303, '/login')
	}

	const items = locals.merchCartService.getCartItems(locals.user.id)
	const item = items.find((i) => i.variant_id === variant_id)
	if (!item) return

	locals.merchCartService.updateQuantity(locals.user.id, variant_id, item.quantity + 1)
	await getCart().refresh()
})

export const decrementQuantity = form(variantSchema, async ({ variant_id }) => {
	const { locals } = getRequestEvent()

	if (!locals.user) {
		redirect(303, '/login')
	}

	const items = locals.merchCartService.getCartItems(locals.user.id)
	const item = items.find((i) => i.variant_id === variant_id)
	if (!item) return

	// updateQuantity handles quantity <= 0 by removing the item
	locals.merchCartService.updateQuantity(locals.user.id, variant_id, item.quantity - 1)
	await getCart().refresh()
})

export const removeFromCart = form(variantSchema, async ({ variant_id }) => {
	const { locals } = getRequestEvent()

	if (!locals.user) {
		redirect(303, '/login')
	}

	locals.merchCartService.removeItem(locals.user.id, variant_id)
	await getCart().refresh()
})

export const createMerchCheckout = form(z.object({}), async () => {
	const { locals, url } = getRequestEvent()

	if (!locals.user) {
		return { success: false as const, text: 'You must be logged in to checkout' }
	}

	try {
		const cartItems = locals.merchCartService.getCartItems(locals.user.id)

		if (cartItems.length === 0) {
			return { success: false as const, text: 'Your cart is empty' }
		}

		// Validate cart items against product cache
		const validatedItems: Array<{
			variantId: string
			quantity: number
			styriaProductCode: string | null
		}> = []

		for (const item of cartItems) {
			const variant = locals.merchProductService.getVariantById(item.variant_id)
			if (!variant) {
				return { success: false as const, text: `Variant ${item.variant_id} not found` }
			}
			if (!variant.active) {
				return {
					success: false as const,
					text: `${variant.label} is no longer available`
				}
			}

			validatedItems.push({
				variantId: variant.id,
				quantity: item.quantity,
				styriaProductCode: variant.styria_product_code
			})
		}

		// Get or create Stripe Customer
		let stripeCustomerId = locals.userService.getStripeCustomerId(locals.user.id)

		if (!stripeCustomerId) {
			stripeCustomerId = await locals.stripeService.createCustomer(
				locals.user.email || '',
				locals.user.name || locals.user.username
			)
			locals.userService.setStripeCustomerId(locals.user.id, stripeCustomerId)
		}

		// Build line items for Stripe (variant ID is the Stripe Price ID)
		const lineItems = validatedItems.map((item) => ({
			stripePriceId: item.variantId,
			quantity: item.quantity
		}))

		// Build metadata
		const variantQuantities = validatedItems.map((item) => ({
			variantId: item.variantId,
			quantity: item.quantity
		}))

		const styriaItems = validatedItems
			.filter((item) => item.styriaProductCode)
			.map((item) => ({
				product_code: item.styriaProductCode!,
				quantity: item.quantity
			}))

		// Create Stripe checkout session
		const session = await locals.stripeService.createMerchCheckoutSession({
			lineItems,
			customerId: stripeCustomerId,
			successUrl: `${url.origin}/merch/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
			cancelUrl: `${url.origin}/merch/cart`,
			metadata: {
				user_id: locals.user.id,
				variant_quantities: JSON.stringify(variantQuantities),
				styria_items: JSON.stringify(styriaItems)
			}
		})

		// Clear cart after successful session creation
		locals.merchCartService.clearCart(locals.user.id)
		await getCart().refresh()

		return { success: true as const, text: 'Redirecting to checkout...', url: session.url }
	} catch (error) {
		console.error('Error creating merch checkout:', error)
		return { success: false as const, text: 'Failed to create checkout session' }
	}
})
