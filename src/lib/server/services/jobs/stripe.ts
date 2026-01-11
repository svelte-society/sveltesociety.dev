import Stripe from 'stripe'
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from '$env/static/private'
import type { JobTier } from './job-tier'

export interface CreateCheckoutSessionParams {
	tier: JobTier
	employerEmail: string
	successUrl: string
	cancelUrl: string
	metadata?: Record<string, string>
}

export interface CheckoutSessionResult {
	sessionId: string
	url: string
}

export class StripeService {
	private stripe: Stripe

	constructor(secretKey: string = STRIPE_SECRET_KEY) {
		this.stripe = new Stripe(secretKey, {
			apiVersion: '2025-12-15.clover'
		})
	}

	/**
	 * Create a Stripe Checkout session for a job posting
	 */
	async createCheckoutSession(params: CreateCheckoutSessionParams): Promise<CheckoutSessionResult> {
		const { tier, employerEmail, successUrl, cancelUrl, metadata = {} } = params

		// If tier has a Stripe price ID, use it; otherwise create a one-time price
		const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = tier.stripe_price_id
			? [{ price: tier.stripe_price_id, quantity: 1 }]
			: [
					{
						price_data: {
							currency: 'usd',
							product_data: {
								name: `${tier.display_name} Job Posting`,
								description: `${tier.duration_days}-day job listing on Svelte Society`
							},
							unit_amount: tier.price_cents
						},
						quantity: 1
					}
				]

		const session = await this.stripe.checkout.sessions.create({
			mode: 'payment',
			customer_email: employerEmail,
			line_items: lineItems,
			success_url: successUrl,
			cancel_url: cancelUrl,
			// Enable automatic tax calculation (VAT for EU customers)
			automatic_tax: {
				enabled: true
			},
			// Allow businesses to enter their VAT number for reverse charge
			tax_id_collection: {
				enabled: true
			},
			// Enable invoice creation for receipts and record keeping
			invoice_creation: {
				enabled: true,
				invoice_data: {
					description: `${tier.display_name} Job Posting - Svelte Society`,
					metadata: {
						tier_id: tier.id,
						tier_name: tier.name
					}
				}
			},
			metadata: {
				tier_id: tier.id,
				tier_name: tier.name,
				employer_email: employerEmail,
				...metadata
			},
			payment_intent_data: {
				metadata: {
					tier_id: tier.id,
					tier_name: tier.name,
					employer_email: employerEmail,
					...metadata
				}
			}
		})

		if (!session.url) {
			throw new Error('Failed to create checkout session URL')
		}

		return {
			sessionId: session.id,
			url: session.url
		}
	}

	/**
	 * Retrieve a checkout session by ID
	 */
	async getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
		return this.stripe.checkout.sessions.retrieve(sessionId, {
			expand: ['payment_intent', 'customer']
		})
	}

	/**
	 * Construct and verify a webhook event from the raw body and signature
	 */
	constructWebhookEvent(payload: string | Buffer, signature: string, webhookSecret: string = STRIPE_WEBHOOK_SECRET): Stripe.Event {
		return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret)
	}

	/**
	 * Get the payment intent from a checkout session
	 */
	async getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
		return this.stripe.paymentIntents.retrieve(paymentIntentId)
	}

	/**
	 * Create or update a Stripe Price for a job tier
	 * Returns the Stripe Price ID
	 */
	async createOrUpdatePrice(tier: JobTier): Promise<string> {
		// First, create or find a product for job postings
		const products = await this.stripe.products.list({
			active: true,
			limit: 100
		})

		let product = products.data.find((p) => p.metadata.tier_name === tier.name)

		if (!product) {
			product = await this.stripe.products.create({
				name: `${tier.display_name} Job Posting`,
				description: `${tier.duration_days}-day job listing on Svelte Society`,
				metadata: {
					tier_name: tier.name,
					tier_id: tier.id
				}
			})
		}

		// Create a new price (prices are immutable in Stripe)
		const price = await this.stripe.prices.create({
			product: product.id,
			unit_amount: tier.price_cents,
			currency: 'usd',
			metadata: {
				tier_name: tier.name,
				tier_id: tier.id
			}
		})

		return price.id
	}

	/**
	 * Issue a refund for a payment
	 */
	async refundPayment(paymentIntentId: string, reason?: string): Promise<Stripe.Refund> {
		return this.stripe.refunds.create({
			payment_intent: paymentIntentId,
			reason: 'requested_by_customer',
			metadata: reason ? { reason } : undefined
		})
	}
}
