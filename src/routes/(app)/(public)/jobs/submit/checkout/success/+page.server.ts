import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { StoredJobData } from '$lib/server/services/jobs'

export const load: PageServerLoad = async ({ locals, url }) => {
	const sessionId = url.searchParams.get('session_id')
	const paymentId = url.searchParams.get('payment_id')

	if (!sessionId || !paymentId) {
		throw error(400, { message: 'Invalid checkout session' })
	}

	// Get the payment record
	const payment = locals.paymentService.getPaymentById(paymentId)
	if (!payment) {
		throw error(404, { message: 'Payment not found' })
	}

	// If job is already created, redirect to it
	if (payment.content_id) {
		const job = locals.contentService.getContentById(payment.content_id)
		if (job) {
			redirect(303, `/jobs/${job.slug}`)
		}
	}

	// Verify the checkout session with Stripe
	try {
		const session = await locals.stripeService.getCheckoutSession(sessionId)

		if (session.payment_status !== 'paid') {
			// Payment not complete yet - might be processing
			return {
				status: 'processing',
				message: 'Your payment is being processed. Please wait...'
			}
		}

		// Payment successful - create the job
		const tier = locals.jobTierService.getTierById(payment.tier_id)
		if (!tier) {
			throw error(500, { message: 'Invalid tier configuration' })
		}

		// Calculate expiration date
		const expiresAt = locals.jobTierService.calculateExpirationDate(tier.id)

		// Parse the job data from payment metadata
		if (!payment.metadata) {
			throw error(500, { message: 'Payment metadata missing' })
		}
		const jobData = payment.metadata as unknown as StoredJobData

		// Generate slug
		const slug = jobData.title
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.replace(/^-|-$/g, '')
			.slice(0, 50)

		// Create the job content
		const jobId = await locals.contentService.addContent({
			title: jobData.title,
			type: 'job',
			slug,
			description: jobData.description,
			body: jobData.body,
			status: 'pending_review', // Jobs require review before going live
			tags: [], // Jobs don't require tags
			published_at: null, // Will be set when published after review
			metadata: {
				company_name: jobData.company_name,
				company_logo: jobData.company_logo,
				company_website: jobData.company_website,
				employer_email: jobData.employer_email,
				position_type: jobData.position_type,
				seniority_level: jobData.seniority_level,
				salary_min: jobData.salary_min,
				salary_max: jobData.salary_max,
				salary_currency: jobData.salary_currency,
				remote_status: jobData.remote_status,
				remote_restrictions: jobData.remote_restrictions,
				location: jobData.location,
				tier_id: tier.id,
				tier_name: tier.name,
				expires_at: expiresAt.toISOString(),
				payment_id: paymentId
			}
		})

		// Fetch the created job to get the final slug (database trigger may modify it)
		const job = locals.contentService.getContentById(jobId)
		if (!job) {
			throw error(500, { message: 'Failed to create job listing' })
		}

		// Update payment with content ID and mark as succeeded
		locals.paymentService.linkPaymentToContent(paymentId, jobId)
		locals.paymentService.updatePaymentStatus(paymentId, 'succeeded')

		// Update payment intent ID from session
		const paymentIntentId = typeof session.payment_intent === 'string'
			? session.payment_intent
			: session.payment_intent?.id

		if (paymentIntentId) {
			locals.paymentService.updatePaymentIntentId(paymentId, paymentIntentId)
		}

		// Send confirmation email
		await locals.plunkService.sendJobPostingConfirmation({
			employerEmail: jobData.employer_email,
			jobTitle: jobData.title,
			tierName: tier.display_name,
			expiresAt: expiresAt.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			}),
			jobUrl: `${url.origin}/jobs/${job.slug}`,
			editUrl: `${url.origin}/jobs/${job.slug}` // TODO: Add edit functionality
		})

		return {
			status: 'success',
			job: {
				id: job.id,
				title: job.title,
				slug: job.slug
			},
			tier: {
				name: tier.display_name,
				duration_days: tier.duration_days
			},
			expiresAt: expiresAt.toISOString()
		}
	} catch (err) {
		console.error('Error processing checkout success:', err)
		throw error(500, { message: 'Failed to process payment. Please contact support.' })
	}
}
