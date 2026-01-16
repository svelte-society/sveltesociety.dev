import { json, text } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import type Stripe from 'stripe'

export const POST: RequestHandler = async ({ request, locals }) => {
	const signature = request.headers.get('stripe-signature')

	if (!signature) {
		return json({ error: 'Missing stripe-signature header' }, { status: 400 })
	}

	const payload = await request.text()

	let event: Stripe.Event
	try {
		event = locals.stripeService.constructWebhookEvent(payload, signature)
	} catch (err) {
		console.error('Webhook signature verification failed:', err)
		return json({ error: 'Webhook signature verification failed' }, { status: 400 })
	}

	// Handle the event
	switch (event.type) {
		case 'checkout.session.completed': {
			const session = event.data.object as Stripe.Checkout.Session
			const productType = session.metadata?.product_type

			if (productType === 'sponsor') {
				// Handle sponsor checkout completion
				await handleSponsorCheckoutCompleted(session, locals)
			} else {
				// Handle job payment (existing logic)
				const paymentId = session.metadata?.payment_id

				if (paymentId) {
					try {
						// Update payment status
						locals.paymentService.updatePaymentStatus(paymentId, 'succeeded')

						// Update payment intent ID
						const paymentIntentId =
							typeof session.payment_intent === 'string'
								? session.payment_intent
								: session.payment_intent?.id

						if (paymentIntentId) {
							locals.paymentService.updatePaymentIntentId(paymentId, paymentIntentId)
						}

						console.log(`Payment ${paymentId} completed via webhook`)
					} catch (error) {
						console.error('Error processing checkout.session.completed:', error)
					}
				}
			}
			break
		}

		case 'customer.subscription.created': {
			const subscription = event.data.object as Stripe.Subscription
			await handleSubscriptionCreated(subscription, locals)
			break
		}

		case 'customer.subscription.updated': {
			const subscription = event.data.object as Stripe.Subscription
			await handleSubscriptionUpdated(subscription, locals)
			break
		}

		case 'customer.subscription.deleted': {
			const subscription = event.data.object as Stripe.Subscription
			await handleSubscriptionDeleted(subscription, locals)
			break
		}

		case 'invoice.paid': {
			const invoice = event.data.object as Stripe.Invoice
			await handleInvoicePaid(invoice, locals)
			break
		}

		case 'payment_intent.succeeded': {
			const paymentIntent = event.data.object
			console.log(`Payment intent ${paymentIntent.id} succeeded`)
			// Additional processing if needed
			break
		}

		case 'payment_intent.payment_failed': {
			const paymentIntent = event.data.object as Stripe.PaymentIntent
			const paymentId = paymentIntent.metadata?.payment_id

			if (paymentId) {
				try {
					locals.paymentService.updatePaymentStatus(paymentId, 'failed')
					console.log(`Payment ${paymentId} failed via webhook`)
				} catch (error) {
					console.error('Error processing payment_intent.payment_failed:', error)
				}
			}
			break
		}

		case 'charge.refunded': {
			const charge = event.data.object as Stripe.Charge
			const paymentIntentId = charge.payment_intent

			if (typeof paymentIntentId === 'string') {
				// Find payment by payment intent ID and mark as refunded
				const payment = locals.paymentService.getPaymentByPaymentIntentId(paymentIntentId)

				if (payment) {
					locals.paymentService.updatePaymentStatus(payment.id, 'refunded')

					// Archive the job since payment was refunded
					if (payment.content_id) {
						locals.contentService.updateStatus(payment.content_id, 'archived')
					}

					console.log(`Payment ${payment.id} refunded via webhook`)
				}
			}
			break
		}

		default:
			// Unhandled event type
			console.log(`Unhandled event type: ${event.type}`)
	}

	return text('OK', { status: 200 })
}

/**
 * Helper to create/update FeedItem when sponsor is activated
 */
function createSponsorFeedItem(sponsorId: string, endDate: Date | null, locals: App.Locals): void {
	try {
		// Get sponsor's active subscription to determine tier
		const subscription = locals.sponsorSubscriptionService.getActiveSubscription(sponsorId)
		if (!subscription) {
			console.error(`No active subscription found for sponsor ${sponsorId}`)
			return
		}

		const tier = locals.sponsorTierService.getTierById(subscription.tier_id)
		const isPremium = tier?.logo_size === 'large'

		locals.feedItemService.createSponsorFeedItem({
			sponsorId,
			isPremium,
			endDate
		})

		console.log(`Created/updated FeedItem for sponsor ${sponsorId}`)
	} catch (error) {
		console.error('Error creating sponsor FeedItem:', error)
	}
}

/**
 * Handle sponsor checkout completion
 * - Link subscription to sponsor record
 * - Get customer email from Stripe
 * - Update subscription with Stripe IDs
 */
async function handleSponsorCheckoutCompleted(
	session: Stripe.Checkout.Session,
	locals: App.Locals
) {
	const subscriptionId = session.metadata?.subscription_id
	const sponsorId = session.metadata?.sponsor_id

	if (!subscriptionId || !sponsorId) {
		console.error('Missing subscription_id or sponsor_id in checkout session metadata')
		return
	}

	try {
		// Get customer email from session
		const customerEmail = session.customer_details?.email || session.customer_email

		if (customerEmail) {
			locals.sponsorService.setContactEmail(sponsorId, customerEmail)
		}

		// Get customer ID
		const customerId =
			typeof session.customer === 'string' ? session.customer : session.customer?.id

		if (customerId) {
			locals.sponsorSubscriptionService.setStripeCustomerId(subscriptionId, customerId)
		}

		// For subscription mode, get the Stripe subscription ID
		if (session.mode === 'subscription' && session.subscription) {
			const stripeSubId =
				typeof session.subscription === 'string' ? session.subscription : session.subscription.id

			locals.sponsorSubscriptionService.setStripeSubscriptionId(subscriptionId, stripeSubId)
		}

		// For one-time payments, activate immediately and set expiration
		if (session.mode === 'payment') {
			const now = new Date()
			const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days

			locals.sponsorSubscriptionService.activateSubscription(subscriptionId, now, expiresAt)
			locals.sponsorService.activateSponsor(sponsorId)
			locals.sponsorService.setExpiresAt(sponsorId, expiresAt)

			// Create FeedItem for the activated sponsor
			createSponsorFeedItem(sponsorId, expiresAt, locals)

			console.log(`Sponsor ${sponsorId} activated via one-time payment`)
		}

		console.log(`Sponsor checkout completed for ${sponsorId}`)
	} catch (error) {
		console.error('Error processing sponsor checkout:', error)
	}
}

/**
 * Handle subscription created event
 * - Activate sponsor when subscription becomes active
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription, locals: App.Locals) {
	const productType = subscription.metadata?.product_type

	if (productType !== 'sponsor') {
		return
	}

	const sponsorId = subscription.metadata?.sponsor_id

	if (!sponsorId) {
		console.error('Missing sponsor_id in subscription metadata')
		return
	}

	try {
		// Find our subscription record by Stripe subscription ID
		let ourSubscription = locals.sponsorSubscriptionService.getByStripeSubscriptionId(
			subscription.id
		)

		// Fallback: try to find by checkout session ID from metadata if Stripe ID not linked yet
		// This handles cases where events arrive out of order
		if (!ourSubscription) {
			const subscriptionIdFromMeta = subscription.metadata?.subscription_id
			if (subscriptionIdFromMeta) {
				ourSubscription =
					locals.sponsorSubscriptionService.getSubscriptionById(subscriptionIdFromMeta)
				// Link the Stripe subscription ID now that we found it
				if (ourSubscription) {
					locals.sponsorSubscriptionService.setStripeSubscriptionId(
						ourSubscription.id,
						subscription.id
					)
				}
			}
		}

		if (!ourSubscription) {
			console.error(`No local subscription found for Stripe subscription ${subscription.id}`)
			return
		}

		// Update period and status
		const periodStart = new Date(subscription.current_period_start * 1000)
		const periodEnd = new Date(subscription.current_period_end * 1000)

		if (subscription.status === 'active') {
			locals.sponsorSubscriptionService.activateSubscription(
				ourSubscription.id,
				periodStart,
				periodEnd
			)
			locals.sponsorService.activateSponsor(sponsorId)
			locals.sponsorService.setExpiresAt(sponsorId, periodEnd)

			// Create FeedItem for the activated sponsor
			createSponsorFeedItem(sponsorId, periodEnd, locals)

			console.log(`Sponsor ${sponsorId} activated via subscription`)
		} else {
			locals.sponsorSubscriptionService.updateStatus(ourSubscription.id, subscription.status)
			locals.sponsorSubscriptionService.updatePeriod(ourSubscription.id, periodStart, periodEnd)
		}
	} catch (error) {
		console.error('Error processing subscription.created:', error)
	}
}

/**
 * Handle subscription updated event
 * - Update status when subscription changes (active, past_due, canceled, etc.)
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription, locals: App.Locals) {
	const productType = subscription.metadata?.product_type

	if (productType !== 'sponsor') {
		return
	}

	const sponsorId = subscription.metadata?.sponsor_id

	try {
		let ourSubscription = locals.sponsorSubscriptionService.getByStripeSubscriptionId(
			subscription.id
		)

		// Fallback: try to find by subscription ID from metadata if Stripe ID not linked yet
		if (!ourSubscription) {
			const subscriptionIdFromMeta = subscription.metadata?.subscription_id
			if (subscriptionIdFromMeta) {
				ourSubscription =
					locals.sponsorSubscriptionService.getSubscriptionById(subscriptionIdFromMeta)
				if (ourSubscription) {
					locals.sponsorSubscriptionService.setStripeSubscriptionId(
						ourSubscription.id,
						subscription.id
					)
				}
			}
		}

		if (!ourSubscription) {
			console.error(`No local subscription found for Stripe subscription ${subscription.id}`)
			return
		}

		// Update period
		const periodStart = new Date(subscription.current_period_start * 1000)
		const periodEnd = new Date(subscription.current_period_end * 1000)
		locals.sponsorSubscriptionService.updatePeriod(ourSubscription.id, periodStart, periodEnd)

		// Update status based on Stripe status
		const stripeStatus = subscription.status
		locals.sponsorSubscriptionService.updateStatus(ourSubscription.id, stripeStatus)

		// Handle cancel_at_period_end
		if (subscription.cancel_at_period_end) {
			locals.sponsorSubscriptionService.markCancelled(ourSubscription.id, true)
		}

		// Update sponsor status based on subscription status
		if (sponsorId) {
			switch (stripeStatus) {
				case 'active':
					locals.sponsorService.activateSponsor(sponsorId)
					locals.sponsorService.setExpiresAt(sponsorId, periodEnd)
					// Update FeedItem end date
					locals.feedItemService.updateSponsorFeedItemEndDate(sponsorId, periodEnd)
					break
				case 'past_due':
					// Keep sponsor active but log warning
					console.warn(`Sponsor ${sponsorId} subscription is past due`)
					break
				case 'canceled':
				case 'unpaid':
					locals.sponsorService.cancelSponsor(sponsorId)
					// Deactivate FeedItem
					locals.feedItemService.deactivateSponsorFeedItem(sponsorId)
					break
				case 'paused':
					locals.sponsorService.pauseSponsor(sponsorId)
					// Deactivate FeedItem while paused
					locals.feedItemService.deactivateSponsorFeedItem(sponsorId)
					break
			}
		}

		console.log(`Subscription ${subscription.id} updated to status: ${stripeStatus}`)
	} catch (error) {
		console.error('Error processing subscription.updated:', error)
	}
}

/**
 * Handle subscription deleted event
 * - Mark sponsor as cancelled
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription, locals: App.Locals) {
	const productType = subscription.metadata?.product_type

	if (productType !== 'sponsor') {
		return
	}

	const sponsorId = subscription.metadata?.sponsor_id

	try {
		let ourSubscription = locals.sponsorSubscriptionService.getByStripeSubscriptionId(
			subscription.id
		)

		// Fallback: try to find by subscription ID from metadata
		if (!ourSubscription) {
			const subscriptionIdFromMeta = subscription.metadata?.subscription_id
			if (subscriptionIdFromMeta) {
				ourSubscription =
					locals.sponsorSubscriptionService.getSubscriptionById(subscriptionIdFromMeta)
			}
		}

		if (ourSubscription) {
			locals.sponsorSubscriptionService.markCancelled(ourSubscription.id, false)
		}

		if (sponsorId) {
			locals.sponsorService.cancelSponsor(sponsorId)
			// Deactivate FeedItem
			locals.feedItemService.deactivateSponsorFeedItem(sponsorId)
			console.log(`Sponsor ${sponsorId} cancelled due to subscription deletion`)
		}
	} catch (error) {
		console.error('Error processing subscription.deleted:', error)
	}
}

/**
 * Handle invoice paid event
 * - Extend subscription period after successful payment
 * - Record payment in sponsor_payments table
 */
async function handleInvoicePaid(invoice: Stripe.Invoice, locals: App.Locals) {
	// Skip if not a subscription invoice
	if (!invoice.subscription) {
		return
	}

	const subscriptionId =
		typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription.id

	try {
		const ourSubscription =
			locals.sponsorSubscriptionService.getByStripeSubscriptionId(subscriptionId)

		if (!ourSubscription) {
			// Not a sponsor subscription
			return
		}

		// Get the updated subscription to get the new period
		const stripeSubscription = await locals.stripeService.getSubscription(subscriptionId)
		const periodStart = new Date(stripeSubscription.current_period_start * 1000)
		const periodEnd = new Date(stripeSubscription.current_period_end * 1000)

		// Update subscription period
		locals.sponsorSubscriptionService.updatePeriod(ourSubscription.id, periodStart, periodEnd)
		locals.sponsorSubscriptionService.updateStatus(ourSubscription.id, 'active')

		// Update sponsor expiration
		const sponsor = locals.sponsorService.getSponsorById(ourSubscription.sponsor_id)
		if (sponsor) {
			locals.sponsorService.activateSponsor(ourSubscription.sponsor_id)
			locals.sponsorService.setExpiresAt(ourSubscription.sponsor_id, periodEnd)
			// Extend FeedItem end date on renewal
			locals.feedItemService.updateSponsorFeedItemEndDate(ourSubscription.sponsor_id, periodEnd)
		}

		console.log(
			`Invoice ${invoice.id} paid for subscription ${subscriptionId}, period extended to ${periodEnd.toISOString()}`
		)
	} catch (error) {
		console.error('Error processing invoice.paid:', error)
	}
}
