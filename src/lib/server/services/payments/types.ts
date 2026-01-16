/**
 * Shared payment types for Stripe integration
 *
 * These types are generic enough to support different payment scenarios:
 * - Job postings (one-time payments)
 * - Sponsor subscriptions (monthly/yearly + one-time)
 */

/**
 * Generic tier interface for any product that can be purchased
 * Works for both jobs (one-time) and sponsors (subscriptions)
 */
export interface PaymentTier {
	id: string
	name: string
	display_name: string
	price_cents: number
	stripe_price_id?: string | null
	// Optional subscription fields (for sponsors)
	stripe_monthly_price_id?: string | null
	stripe_yearly_price_id?: string | null
}

/**
 * Product types that can be purchased through Stripe
 */
export type ProductType = 'job' | 'sponsor'

/**
 * Billing mode for checkout sessions
 */
export type BillingMode = 'payment' | 'subscription'

/**
 * Billing interval for subscriptions
 */
export type BillingInterval = 'month' | 'year'

/**
 * Parameters for creating a Stripe checkout session
 */
export interface CreateCheckoutParams {
	tier: PaymentTier
	mode: BillingMode
	billingInterval?: BillingInterval // Required for subscriptions
	successUrl: string
	cancelUrl: string
	metadata?: Record<string, string>
	productType: ProductType
	customerEmail?: string // Optional - Stripe collects if not provided
	// Product-specific description fields
	productDescription?: string
}

/**
 * Result from creating a checkout session
 */
export interface CheckoutSessionResult {
	sessionId: string
	url: string
}

/**
 * Legacy interface for backwards compatibility with jobs
 * Maps to the old CreateCheckoutSessionParams from jobs/stripe.ts
 */
export interface JobCheckoutParams {
	tier: PaymentTier & { duration_days?: number }
	employerEmail: string
	successUrl: string
	cancelUrl: string
	metadata?: Record<string, string>
}
