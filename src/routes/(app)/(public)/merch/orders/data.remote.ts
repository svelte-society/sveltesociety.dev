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

		const shippingDetails =
			(session as any).collected_information?.shipping_details ||
			(session as any).shipping_details
		return {
			sessionId: session.id,
			amount: session.amount_total,
			currency: session.currency,
			status: session.payment_status,
			created: session.created ? new Date(session.created * 1000).toISOString() : '',
			lineItems:
				session.line_items?.data?.map((item) => ({
					description: item.description,
					quantity: item.quantity,
					amountTotal: item.amount_total,
					currency: item.currency
				})) || [],
			shippingAddress: shippingDetails?.address
				? {
						name: shippingDetails.name || '',
						line1: shippingDetails.address.line1 || '',
						line2: shippingDetails.address.line2 || '',
						city: shippingDetails.address.city || '',
						state: shippingDetails.address.state || '',
						postalCode: shippingDetails.address.postal_code || '',
						country: shippingDetails.address.country || ''
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
