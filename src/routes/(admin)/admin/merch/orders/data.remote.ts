import { query, command, getRequestEvent } from '$app/server'
import { z } from 'zod/v4'
import { checkAdminAuth } from '../../authorization.remote'

const fulfillmentFiltersSchema = z.object({
	status: z.string().optional(),
	page: z.number().optional()
})

export const getMerchFulfillments = query(fulfillmentFiltersSchema, async (filters) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	const { fulfillments, count } = locals.merchFulfillmentService.getAllFulfillments({
		status: filters.status && filters.status !== 'all' ? filters.status : undefined,
		limit: 25,
		offset: ((filters.page || 1) - 1) * 25
	})

	// Enrich with user info
	const enrichedFulfillments = fulfillments.map((f) => {
		const user = locals.userService.getUser(f.user_id)
		return {
			...f,
			userName: user?.name || user?.username || 'Unknown',
			userEmail: user?.email || ''
		}
	})

	return {
		fulfillments: enrichedFulfillments,
		pagination: {
			count,
			perPage: 25,
			currentPage: filters.page || 1
		}
	}
})

const fulfillmentIdSchema = z.object({
	id: z.string()
})

export const getMerchFulfillment = query(fulfillmentIdSchema, async ({ id }) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	const fulfillment = locals.merchFulfillmentService.getById(id)
	if (!fulfillment) return null

	const user = locals.userService.getUser(fulfillment.user_id)

	// Try to get Stripe session details
	let sessionDetails = null
	try {
		const session = await locals.stripeService.getSessionWithLineItems(
			fulfillment.stripe_checkout_session_id
		)
		const shippingDetails = (session as any).shipping_details
		sessionDetails = {
			amount: session.amount_total,
			currency: session.currency,
			lineItems:
				session.line_items?.data?.map((item) => ({
					description: item.description,
					quantity: item.quantity,
					amountTotal: item.amount_total
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
				: null
		}
	} catch (error) {
		console.error('Error fetching Stripe session:', error)
	}

	return {
		...fulfillment,
		userName: user?.name || user?.username || 'Unknown',
		userEmail: user?.email || '',
		sessionDetails
	}
})

const syncStatusSchema = z.object({
	id: z.string()
})

export const syncStyriaStatus = command(syncStatusSchema, async ({ id }) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	const fulfillment = locals.merchFulfillmentService.getById(id)
	if (!fulfillment?.styria_order_id) return

	try {
		const styriaOrder = await locals.styriashirtsService.getOrder(fulfillment.styria_order_id)

		// Map Styria statuses to local statuses
		let newStatus = fulfillment.fulfillment_status
		const styriaStatus = styriaOrder.status?.toLowerCase()

		if (styriaStatus === 'received' || styriaStatus === 'in progress') {
			newStatus = 'submitted'
		} else if (styriaStatus === 'printing' || styriaStatus === 'quality control') {
			newStatus = 'in_production'
		} else if (styriaStatus === 'shipped') {
			newStatus = 'shipped'
		}

		if (newStatus !== fulfillment.fulfillment_status) {
			locals.merchFulfillmentService.updateStatus(id, newStatus)
		}

		await getMerchFulfillment({ id }).refresh()
		await getMerchFulfillments({}).refresh()
	} catch (error) {
		console.error('Error syncing Styria status:', error)
	}
})

export const syncAllActiveFulfillments = command(async () => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	const activeFulfillments = locals.merchFulfillmentService.getActiveFulfillments()

	for (const fulfillment of activeFulfillments) {
		if (!fulfillment.styria_order_id) continue

		try {
			const styriaOrder = await locals.styriashirtsService.getOrder(fulfillment.styria_order_id)
			let newStatus = fulfillment.fulfillment_status
			const styriaStatus = styriaOrder.status?.toLowerCase()

			if (styriaStatus === 'received' || styriaStatus === 'in progress') {
				newStatus = 'submitted'
			} else if (styriaStatus === 'printing' || styriaStatus === 'quality control') {
				newStatus = 'in_production'
			} else if (styriaStatus === 'shipped') {
				newStatus = 'shipped'
			}

			if (newStatus !== fulfillment.fulfillment_status) {
				locals.merchFulfillmentService.updateStatus(fulfillment.id, newStatus)
			}
		} catch (error) {
			console.error(`Error syncing fulfillment ${fulfillment.id}:`, error)
		}
	}

	await getMerchFulfillments({}).refresh()
})

const updateStatusSchema = z.object({
	id: z.string(),
	status: z.string()
})

export const updateFulfillmentStatus = command(updateStatusSchema, async ({ id, status }) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	locals.merchFulfillmentService.updateStatus(id, status)
	await getMerchFulfillment({ id }).refresh()
	await getMerchFulfillments({}).refresh()
})

const setTrackingSchema = z.object({
	id: z.string(),
	trackingNumber: z.string()
})

export const setFulfillmentTracking = command(setTrackingSchema, async ({ id, trackingNumber }) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	locals.merchFulfillmentService.setTrackingNumber(id, trackingNumber)
	await getMerchFulfillment({ id }).refresh()
})
