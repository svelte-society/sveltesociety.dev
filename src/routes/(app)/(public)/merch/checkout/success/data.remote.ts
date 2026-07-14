import { query, getRequestEvent } from '$app/server'
import { z } from 'zod/v4'

const sessionIdSchema = z.object({
	sessionId: z.string()
})

/**
 * Verify a completed checkout session and clear the cart.
 * Acts as a fallback in case the Stripe webhook hasn't fired yet.
 */
export const verifyAndClearCart = query(sessionIdSchema, async ({ sessionId }) => {
	const { locals } = getRequestEvent()

	if (!locals.user) {
		return { verified: false }
	}

	try {
		const session = await locals.stripeService.getCheckoutSession(sessionId)

		if (session.payment_status === 'paid' && session.metadata?.user_id === locals.user.id) {
			locals.merchCartService.clearCart(locals.user.id)
			return { verified: true }
		}

		return { verified: false }
	} catch {
		return { verified: false }
	}
})
