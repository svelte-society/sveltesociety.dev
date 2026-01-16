import { getRequestEvent, query, form } from '$app/server'
import { fail, redirect } from '@sveltejs/kit'
import { sponsorSubmissionSchema, type SponsorSubmissionData } from './schema'
import { uploadImageFile } from '$lib/server/services/s3-storage'
import { generateSlug } from '$lib/utils/slug'

/**
 * Get available sponsor tiers
 */
export const getSponsorTiers = query(async () => {
	const { locals } = getRequestEvent()
	return locals.sponsorTierService.getActiveTiers()
})

/**
 * Submit sponsor application and redirect to Stripe checkout
 */
export const submitSponsor = form(sponsorSubmissionSchema, async (data: SponsorSubmissionData) => {
	const { locals, url } = getRequestEvent()

	// Get the selected tier
	const tier = locals.sponsorTierService.getTierById(data.tier_id)
	if (!tier) {
		return fail(400, {
			error: 'Invalid tier',
			message: 'The selected sponsor tier is not valid.'
		})
	}

	// Validate tagline length against tier limit
	if (data.tagline.length > tier.max_tagline_length) {
		return fail(400, {
			error: 'Tagline too long',
			message: `Tagline must be ${tier.max_tagline_length} characters or less for this tier.`
		})
	}

	// Upload logo to S3
	let logoUrl: string
	try {
		logoUrl = await uploadImageFile(data.logo, `sponsors/${generateSlug(data.company_name)}`)
	} catch {
		return fail(500, {
			error: 'Upload failed',
			message: 'Failed to upload logo. Please try again.'
		})
	}

	// Create the sponsor record
	const sponsorId = locals.sponsorService.createSponsor({
		company_name: data.company_name,
		logo_url: logoUrl,
		tagline: data.tagline,
		website_url: data.website_url,
		discount_code: data.discount_code,
		discount_description: data.discount_description
	})

	// Determine pricing and mode based on billing type
	const price = locals.sponsorTierService.getPriceForBillingType(tier, data.billing_type)
	const mode = data.billing_type === 'one_time' ? 'payment' : 'subscription'
	const billingInterval =
		data.billing_type === 'monthly' ? 'month' : data.billing_type === 'yearly' ? 'year' : undefined

	// Create the subscription record
	const subscriptionId = locals.sponsorSubscriptionService.createSubscription({
		sponsor_id: sponsorId,
		tier_id: tier.id,
		billing_type: data.billing_type,
		amount_cents: price
	})

	let checkoutUrl: string

	try {
		const baseUrl = url.origin
		const checkoutResult = await locals.stripeService.createGenericCheckoutSession({
			tier: {
				...tier,
				price_cents: price // Use the billing-specific price
			},
			mode: mode as 'payment' | 'subscription',
			billingInterval,
			successUrl: `${baseUrl}/sponsors/submit/checkout/success?session_id={CHECKOUT_SESSION_ID}&subscription_id=${subscriptionId}`,
			cancelUrl: `${baseUrl}/sponsors/submit/checkout/cancel?subscription_id=${subscriptionId}`,
			productType: 'sponsor',
			productDescription: `${tier.display_name} Sponsorship on Svelte Society`,
			metadata: {
				sponsor_id: sponsorId,
				subscription_id: subscriptionId,
				company_name: data.company_name
			}
		})

		// Update subscription with checkout session ID
		locals.db
			.prepare(
				'UPDATE sponsor_subscriptions SET stripe_checkout_session_id = $session_id WHERE id = $id'
			)
			.run({
				session_id: checkoutResult.sessionId,
				id: subscriptionId
			})

		checkoutUrl = checkoutResult.url
	} catch (error) {
		console.error('Error creating checkout session:', error)
		// Clean up the sponsor and subscription records on failure
		locals.db
			.prepare('DELETE FROM sponsor_subscriptions WHERE id = $id')
			.run({ id: subscriptionId })
		locals.db.prepare('DELETE FROM sponsors WHERE id = $id').run({ id: sponsorId })

		return fail(500, {
			error: 'Checkout failed',
			message: 'Failed to create checkout session. Please try again.'
		})
	}

	// Redirect to Stripe checkout
	redirect(303, checkoutUrl)
})
