import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals, url }) => {
	const sessionId = url.searchParams.get('session_id')
	const subscriptionId = url.searchParams.get('subscription_id')

	if (!sessionId || !subscriptionId) {
		throw error(400, { message: 'Invalid checkout session' })
	}

	// Get the subscription record
	const subscription = locals.sponsorSubscriptionService.getSubscriptionById(subscriptionId)
	if (!subscription) {
		throw error(404, { message: 'Subscription not found' })
	}

	if (
		!subscription.stripe_checkout_session_id ||
		subscription.stripe_checkout_session_id !== sessionId
	) {
		throw error(400, { message: 'Checkout session does not match subscription' })
	}

	// Get the sponsor
	const sponsor = locals.sponsorService.getSponsorById(subscription.sponsor_id)
	if (!sponsor) {
		throw error(404, { message: 'Sponsor not found' })
	}

	// Get the tier
	const tier = locals.sponsorTierService.getTierById(subscription.tier_id)
	if (!tier) {
		throw error(500, { message: 'Invalid tier configuration' })
	}

	// Verify the checkout session with Stripe
	try {
		const session = await locals.stripeService.getCheckoutSession(sessionId)

		if (session.id !== subscription.stripe_checkout_session_id) {
			throw error(400, { message: 'Checkout session mismatch' })
		}

		if (session.metadata?.subscription_id !== subscriptionId) {
			throw error(400, { message: 'Invalid checkout metadata' })
		}

		if (session.metadata?.sponsor_id !== sponsor.id) {
			throw error(400, { message: 'Invalid sponsor metadata' })
		}

		if (session.payment_status !== 'paid' && session.status !== 'complete') {
			// Payment not complete yet - might be processing
			return {
				status: 'processing',
				message: 'Your payment is being processed. Please wait...'
			}
		}

		// For one-time payments, update here (webhook handles subscriptions)
		// Check both subscription AND sponsor status to handle race conditions with webhooks
		const isSubscriptionIncomplete = subscription.status === 'incomplete'
		const isSponsorNotActive = sponsor.status !== 'active'

		if (session.mode === 'payment' && isSubscriptionIncomplete && isSponsorNotActive) {
			const now = new Date()
			const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days

			// Get customer email from Stripe session
			const customerEmail = session.customer_details?.email || session.customer_email
			if (customerEmail) {
				locals.sponsorService.setContactEmail(sponsor.id, customerEmail)
			}

			// Activate the subscription and sponsor
			locals.sponsorSubscriptionService.activateSubscription(subscriptionId, now, expiresAt)
			locals.sponsorService.activateSponsor(sponsor.id)
			locals.sponsorService.setExpiresAt(sponsor.id, expiresAt)
		}

		// Return success data
		return {
			status: 'success',
			sponsor: {
				id: sponsor.id,
				company_name: sponsor.company_name,
				logo_url: sponsor.logo_url
			},
			tier: {
				name: tier.display_name,
				logo_size: tier.logo_size
			},
			billing_type: subscription.billing_type,
			message: getSuccessMessage(subscription.billing_type)
		}
	} catch (err) {
		if (err && typeof err === 'object' && 'status' in err) {
			throw err
		}
		console.error('Error processing checkout success:', err)
		throw error(500, { message: 'Failed to process payment. Please contact support.' })
	}
}

function getSuccessMessage(billingType: string): string {
	switch (billingType) {
		case 'monthly':
			return 'Your monthly sponsorship is now active!'
		case 'yearly':
			return 'Your yearly sponsorship is now active!'
		case 'one_time':
			return 'Your 30-day sponsorship is now active!'
		default:
			return 'Your sponsorship is now active!'
	}
}
