/**
 * Sponsor services for managing sponsorships
 *
 * This module provides:
 * - SponsorTierService: Manages sponsor pricing tiers
 * - SponsorService: Manages sponsor profiles
 * - SponsorSubscriptionService: Manages Stripe subscriptions
 */

export { SponsorTierService, type SponsorTier, type LogoSize } from './sponsor-tier'
export {
	SponsorService,
	type Sponsor,
	type SponsorStatus,
	type CreateSponsorData,
	type UpdateSponsorData
} from './sponsor'
export {
	SponsorSubscriptionService,
	type SponsorSubscription,
	type SubscriptionStatus,
	type BillingType,
	type CreateSubscriptionData
} from './sponsor-subscription'
