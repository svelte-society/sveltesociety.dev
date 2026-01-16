/**
 * Shared payment services for Stripe integration
 *
 * This module provides:
 * - StripeService: Handles checkout sessions, subscriptions, webhooks
 * - Shared types for payment tiers and checkout parameters
 */

export { StripeService } from './stripe'
export type {
	PaymentTier,
	ProductType,
	BillingMode,
	BillingInterval,
	CreateCheckoutParams,
	CheckoutSessionResult,
	JobCheckoutParams
} from './types'
