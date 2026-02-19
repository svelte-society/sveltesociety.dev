import { getRequestEvent, query } from '$app/server'
import { z } from 'zod/v4'

export const getMyOrders = query(async () => {
	const { locals } = getRequestEvent()

	if (!locals.user) {
		return { orders: [], authenticated: false }
	}

	const stripeCustomerId = locals.userService.getStripeCustomerId(locals.user.id)
	if (!stripeCustomerId) {
		return { orders: [], authenticated: true }
	}

	try {
		const sessions = await locals.stripeService.listCustomerSessions(stripeCustomerId)

		const orders = sessions.map((session) => {
			const fulfillment = locals.merchFulfillmentService.getByStripeSessionId(session.id)

			return {
				sessionId: session.id,
				amount: session.amount_total,
				currency: session.currency,
				status: session.payment_status,
				created: session.created ? new Date(session.created * 1000).toISOString() : '',
				itemCount: session.line_items?.data?.length || 0,
				fulfillmentStatus: fulfillment?.fulfillment_status || 'processing',
				trackingNumber: fulfillment?.shipping_tracking_number || null
			}
		})

		return { orders, authenticated: true }
	} catch (error) {
		console.error('Error fetching orders:', error)
		return { orders: [], authenticated: true }
	}
})

const orderDetailSchema = z.object({
	sessionId: z.string()
})

export const getMyOrder = query(orderDetailSchema, async ({ sessionId }) => {
	const { locals } = getRequestEvent()

	if (!locals.user) {
		return null
	}

	try {
		const session = await locals.stripeService.getSessionWithLineItems(sessionId)

		// Verify ownership
		const stripeCustomerId = locals.userService.getStripeCustomerId(locals.user.id)
		const sessionCustomer =
			typeof session.customer === 'string' ? session.customer : session.customer?.id

		if (!stripeCustomerId || sessionCustomer !== stripeCustomerId) {
			return null
		}

		const fulfillment = locals.merchFulfillmentService.getByStripeSessionId(session.id)

		return {
			sessionId: session.id,
			amount: session.amount_total,
			currency: session.currency,
			status: session.payment_status,
			created: session.created ? new Date(session.created * 1000).toISOString() : '',
			lineItems: session.line_items?.data?.map((item) => ({
				description: item.description,
				quantity: item.quantity,
				amountTotal: item.amount_total,
				currency: item.currency
			})) || [],
			shippingAddress: session.shipping_details?.address
				? {
						name: session.shipping_details.name || '',
						line1: session.shipping_details.address.line1 || '',
						line2: session.shipping_details.address.line2 || '',
						city: session.shipping_details.address.city || '',
						state: session.shipping_details.address.state || '',
						postalCode: session.shipping_details.address.postal_code || '',
						country: session.shipping_details.address.country || ''
					}
				: null,
			fulfillmentStatus: fulfillment?.fulfillment_status || 'processing',
			trackingNumber: fulfillment?.shipping_tracking_number || null,
			styriaOrderId: fulfillment?.styria_order_id || null
		}
	} catch (error) {
		console.error('Error fetching order detail:', error)
		return null
	}
})
