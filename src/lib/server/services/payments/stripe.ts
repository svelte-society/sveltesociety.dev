import Stripe from 'stripe'
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from '$env/static/private'
import type {
	PaymentTier,
	CreateCheckoutParams,
	CheckoutSessionResult,
	JobCheckoutParams
} from './types'

/**
 * Shared Stripe service for handling payments and subscriptions
 *
 * Supports:
 * - One-time payments (job postings)
 * - Subscriptions (sponsor monthly/yearly)
 */
export class StripeService {
	private stripe: Stripe

	constructor(secretKey: string = STRIPE_SECRET_KEY) {
		this.stripe = new Stripe(secretKey, {
			apiVersion: '2025-12-15.clover'
		})
	}

	/**
	 * Create a Stripe Checkout session for any product type
	 * Supports both one-time payments and subscriptions
	 */
	async createGenericCheckoutSession(params: CreateCheckoutParams): Promise<CheckoutSessionResult> {
		const {
			tier,
			mode,
			billingInterval,
			successUrl,
			cancelUrl,
			metadata = {},
			productType,
			customerEmail,
			productDescription
		} = params

		// Determine which price ID to use based on mode and interval
		let priceId: string | null = null
		if (mode === 'subscription' && billingInterval) {
			priceId =
				billingInterval === 'year' ? (tier.stripe_yearly_price_id ?? null) : (tier.stripe_monthly_price_id ?? null)
		} else {
			priceId = tier.stripe_price_id ?? null
		}

		// Build line items - use existing price ID or create one-time price
		const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = priceId
			? [{ price: priceId, quantity: 1 }]
			: [
					{
						price_data: {
							currency: 'usd',
							product_data: {
								name: `${tier.display_name} ${productType === 'job' ? 'Job Posting' : 'Sponsorship'}`,
								description: productDescription || `${tier.display_name} on Svelte Society`
							},
							unit_amount: tier.price_cents,
							...(mode === 'subscription' && billingInterval
								? { recurring: { interval: billingInterval } }
								: {})
						},
						quantity: 1
					}
				]

		const sessionParams: Stripe.Checkout.SessionCreateParams = {
			mode,
			line_items: lineItems,
			success_url: successUrl,
			cancel_url: cancelUrl,
			automatic_tax: { enabled: true },
			tax_id_collection: { enabled: true },
			metadata: {
				tier_id: tier.id,
				tier_name: tier.name,
				product_type: productType,
				...metadata
			}
		}

		// Add customer email if provided, otherwise Stripe will collect it
		if (customerEmail) {
			sessionParams.customer_email = customerEmail
		}

		// Add invoice creation for one-time payments
		if (mode === 'payment') {
			sessionParams.invoice_creation = {
				enabled: true,
				invoice_data: {
					description: `${tier.display_name} ${productType === 'job' ? 'Job Posting' : 'Sponsorship'} - Svelte Society`,
					metadata: {
						tier_id: tier.id,
						tier_name: tier.name,
						product_type: productType
					}
				}
			}
			sessionParams.payment_intent_data = {
				metadata: {
					tier_id: tier.id,
					tier_name: tier.name,
					product_type: productType,
					...metadata
				}
			}
		}

		// Add subscription-specific data
		if (mode === 'subscription') {
			sessionParams.subscription_data = {
				metadata: {
					tier_id: tier.id,
					tier_name: tier.name,
					product_type: productType,
					...metadata
				}
			}
		}

		const session = await this.stripe.checkout.sessions.create(sessionParams)

		if (!session.url) {
			throw new Error('Failed to create checkout session URL')
		}

		return {
			sessionId: session.id,
			url: session.url
		}
	}

	/**
	 * Create a Stripe Checkout session for a job posting
	 * Backwards-compatible method for existing job submission flow
	 */
	async createCheckoutSession(params: JobCheckoutParams): Promise<CheckoutSessionResult> {
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
								description: tier.duration_days
									? `${tier.duration_days}-day job listing on Svelte Society`
									: `Job listing on Svelte Society`
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
			automatic_tax: { enabled: true },
			tax_id_collection: { enabled: true },
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
			expand: ['payment_intent', 'customer', 'subscription']
		})
	}

	/**
	 * Retrieve a subscription by ID
	 */
	async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
		return this.stripe.subscriptions.retrieve(subscriptionId)
	}

	/**
	 * Cancel a subscription
	 */
	async cancelSubscription(
		subscriptionId: string,
		options?: { cancelAtPeriodEnd?: boolean }
	): Promise<Stripe.Subscription> {
		if (options?.cancelAtPeriodEnd) {
			return this.stripe.subscriptions.update(subscriptionId, {
				cancel_at_period_end: true
			})
		}
		return this.stripe.subscriptions.cancel(subscriptionId)
	}

	/**
	 * Construct and verify a webhook event from the raw body and signature
	 */
	constructWebhookEvent(
		payload: string | Buffer,
		signature: string,
		webhookSecret: string = STRIPE_WEBHOOK_SECRET
	): Stripe.Event {
		return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret)
	}

	/**
	 * Get the payment intent from a checkout session
	 */
	async getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
		return this.stripe.paymentIntents.retrieve(paymentIntentId)
	}

	/**
	 * Get an invoice by ID
	 */
	async getInvoice(invoiceId: string): Promise<Stripe.Invoice> {
		return this.stripe.invoices.retrieve(invoiceId)
	}

	/**
	 * Create or update a Stripe Price for a tier
	 * Returns the Stripe Price ID
	 */
	async createOrUpdatePrice(
		tier: PaymentTier & { duration_days?: number },
		productType: 'job' | 'sponsor' = 'job',
		recurring?: { interval: 'month' | 'year' }
	): Promise<string> {
		// First, create or find a product
		const products = await this.stripe.products.list({
			active: true,
			limit: 100
		})

		const productMetaKey = `${productType}_tier_name`
		let product = products.data.find((p) => p.metadata[productMetaKey] === tier.name)

		if (!product) {
			const description =
				productType === 'job' && tier.duration_days
					? `${tier.duration_days}-day job listing on Svelte Society`
					: `${tier.display_name} ${productType} on Svelte Society`

			product = await this.stripe.products.create({
				name: `${tier.display_name} ${productType === 'job' ? 'Job Posting' : 'Sponsorship'}`,
				description,
				metadata: {
					[productMetaKey]: tier.name,
					tier_id: tier.id,
					product_type: productType
				}
			})
		}

		// Create a new price (prices are immutable in Stripe)
		const priceParams: Stripe.PriceCreateParams = {
			product: product.id,
			unit_amount: tier.price_cents,
			currency: 'usd',
			metadata: {
				tier_name: tier.name,
				tier_id: tier.id,
				product_type: productType
			}
		}

		if (recurring) {
			priceParams.recurring = { interval: recurring.interval }
		}

		const price = await this.stripe.prices.create(priceParams)

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

	/**
	 * Get customer details from a customer ID
	 */
	async getCustomer(customerId: string): Promise<Stripe.Customer | Stripe.DeletedCustomer> {
		return this.stripe.customers.retrieve(customerId)
	}
}
