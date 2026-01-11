import { getRequestEvent, query, form } from '$app/server'
import { fail, redirect } from '@sveltejs/kit'
import { jobSubmissionSchema, type JobSubmissionData } from './schema'
import type { StoredJobData } from '$lib/server/services/jobs'
import { uploadImageFile } from '$lib/server/services/s3-storage'

/**
 * Generate a slug from a title
 */
function generateSlug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '')
		.slice(0, 50)
}

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

	// Upload company logo to S3 if provided
	let companyLogoUrl: string | null = null
	if (data.company_logo) {
		companyLogoUrl = await uploadImageFile(
			data.company_logo,
			`jobs/${generateSlug(data.company_name)}`
		)
	}

	// Store job data in payment metadata (will be used after payment succeeds)
	const jobData: StoredJobData = {
		company_name: data.company_name,
		company_logo: companyLogoUrl,
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

	let checkoutUrl: string

	try {
		// Create a pending payment record
		const paymentId = locals.paymentService.createPayment({
			employer_email: data.employer_email,
			tier_id: tier.id,
			amount_cents: tier.price_cents,
			metadata: jobData as unknown as Record<string, unknown>
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
		locals.db
			.prepare('UPDATE payments SET stripe_checkout_session_id = $session_id WHERE id = $id')
			.run({
				session_id: checkoutResult.sessionId,
				id: paymentId
			})

		checkoutUrl = checkoutResult.url
	} catch (error) {
		console.error('Error creating checkout session:', error)
		return fail(500, {
			error: 'Checkout failed',
			message: 'Failed to create checkout session. Please try again.'
		})
	}

	// Redirect to Stripe checkout (outside try/catch)
	redirect(303, checkoutUrl)
})
