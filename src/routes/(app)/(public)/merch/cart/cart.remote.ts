import { command, getRequestEvent } from '$app/server'
import { z } from 'zod/v4'

const cartItemSchema = z.object({
	productId: z.string(),
	variantId: z.string(),
	stripePriceId: z.string(),
	quantity: z.number().int().min(1)
})

const checkoutSchema = z.object({
	items: z.array(cartItemSchema).min(1)
})

export const createMerchCheckout = command(checkoutSchema, async (data) => {
	const { locals, url } = getRequestEvent()

	if (!locals.user) {
		return { success: false, text: 'You must be logged in to checkout' }
	}

	try {
		// Validate cart items against DB
		const validatedItems: Array<{
			variantId: string
			stripePriceId: string
			quantity: number
			styriaProductCode: string | null
		}> = []

		for (const item of data.items) {
			const variant = locals.merchProductService.getVariantById(item.variantId)
			if (!variant) {
				return { success: false, text: `Variant ${item.variantId} not found` }
			}
			if (!variant.active) {
				return { success: false, text: `${variant.label} is no longer available` }
			}
			if (variant.stock_quantity < item.quantity) {
				return {
					success: false,
					text: `Not enough stock for ${variant.label}. Only ${variant.stock_quantity} available.`
				}
			}
			if (!variant.stripe_price_id) {
				return { success: false, text: `${variant.label} is not yet available for purchase` }
			}

			validatedItems.push({
				variantId: variant.id,
				stripePriceId: variant.stripe_price_id,
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

		// Build line items for Stripe
		const lineItems = validatedItems.map((item) => ({
			stripePriceId: item.stripePriceId,
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

		return { success: true, text: 'Redirecting to checkout...', url: session.url }
	} catch (error) {
		console.error('Error creating merch checkout:', error)
		return { success: false, text: 'Failed to create checkout session' }
	}
})
