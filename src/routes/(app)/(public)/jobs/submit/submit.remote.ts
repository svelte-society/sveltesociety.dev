import { getRequestEvent, query, form } from '$app/server'
import { fail, redirect } from '@sveltejs/kit'
import { jobSubmissionSchema, type JobSubmissionData } from './schema'

/**
 * Get available job tiers
 */
export const getJobTiers = query(async () => {
	const { locals } = getRequestEvent()
	return locals.jobTierService.getActiveTiers()
})

/**
 * Submit job and redirect to Stripe checkout
 */
export const submitJob = form(jobSubmissionSchema, async (data: JobSubmissionData) => {
	const { locals, url } = getRequestEvent()

	// Get the selected tier
	const tier = locals.jobTierService.getTierById(data.tier_id)
	if (!tier) {
		return fail(400, {
			error: 'Invalid tier',
			message: 'The selected pricing tier is not valid.'
		})
	}

	// Store job data in payment metadata (will be used after payment succeeds)
	const jobData = {
		company_name: data.company_name,
		company_logo: data.company_logo || null,
		company_website: data.company_website || null,
		employer_email: data.employer_email,
		title: data.title,
		description: data.description,
		body: data.body,
		position_type: data.position_type,
		seniority_level: data.seniority_level,
		remote_status: data.remote_status,
		remote_restrictions: data.remote_restrictions || null,
		location: data.location || null,
		salary_min: data.salary_min ?? null,
		salary_max: data.salary_max ?? null,
		salary_currency: data.salary_currency
	}

	try {
		// Create a pending payment record
		const paymentId = locals.paymentService.createPayment({
			employer_email: data.employer_email,
			tier_id: tier.id,
			amount_cents: tier.price_cents,
			metadata: jobData
		})

		// Create Stripe checkout session
		const baseUrl = url.origin
		const checkoutResult = await locals.stripeService.createCheckoutSession({
			tier,
			employerEmail: data.employer_email,
			successUrl: `${baseUrl}/jobs/submit/checkout/success?session_id={CHECKOUT_SESSION_ID}&payment_id=${paymentId}`,
			cancelUrl: `${baseUrl}/jobs/submit/checkout/cancel?payment_id=${paymentId}`,
			metadata: {
				payment_id: paymentId,
				job_title: data.title
			}
		})

		// Update payment with Stripe session ID
		locals.paymentService.updatePaymentStatus(paymentId, 'pending')
		locals.db.prepare('UPDATE payments SET stripe_checkout_session_id = $session_id WHERE id = $id').run({
			session_id: checkoutResult.sessionId,
			id: paymentId
		})

		// Redirect to Stripe checkout
		redirect(303, checkoutResult.url)
	} catch (error) {
		console.error('Error creating checkout session:', error)
		return fail(500, {
			error: 'Checkout failed',
			message: 'Failed to create checkout session. Please try again.'
		})
	}
})
