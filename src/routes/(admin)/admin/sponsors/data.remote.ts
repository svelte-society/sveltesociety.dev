import { query, form } from '$app/server'
import { getRequestEvent } from '$app/server'
import { z } from 'zod/v4'
import { checkAdminAuth } from '../authorization.remote'
import type { SponsorStatus } from '$lib/server/services/sponsors'
import { dev } from '$app/environment'

// Use dev URL locally, production URL otherwise
const BASE_URL = dev ? 'http://localhost:5173' : 'https://sveltesociety.dev'

const sponsorFiltersSchema = z.object({
	status: z.enum(['pending', 'active', 'paused', 'expired', 'cancelled', 'all']).default('all'),
	search: z.string().optional(),
	page: z.number().int().positive().default(1),
	perPage: z.number().int().positive().default(50)
})

const sponsorIdSchema = z.object({
	id: z.string().min(1, 'Sponsor ID is required')
})

const updateSponsorSchema = z.object({
	id: z.string().min(1, 'Sponsor ID is required'),
	company_name: z.string().min(1, 'Company name is required'),
	tagline: z.string().min(1, 'Tagline is required'),
	website_url: z.string().url('Please enter a valid URL'),
	discount_code: z.string().optional(),
	discount_description: z.string().optional(),
	status: z.enum(['pending', 'active', 'paused', 'expired', 'cancelled'])
})

export type SponsorWithSubscription = {
	id: string
	company_name: string
	logo_url: string
	tagline: string
	website_url: string
	contact_email: string | null
	discount_code: string | null
	discount_description: string | null
	status: SponsorStatus
	created_at: string
	updated_at: string
	activated_at: string | null
	expires_at: string | null
	tier_name?: string
	billing_type?: string
	subscription_status?: string
}

function getFiltersFromUrl(url: URL) {
	const sp = url.searchParams
	return {
		search: sp.get('search') || undefined,
		status: (sp.get('status') || 'all') as
			| 'pending'
			| 'active'
			| 'paused'
			| 'expired'
			| 'cancelled'
			| 'all',
		page: parseInt(sp.get('page') || '1')
	}
}

export const getSponsors = query(sponsorFiltersSchema, async (filters) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()
	const { page, perPage, search, status } = filters

	// Get all sponsors
	let sponsors = locals.sponsorService.getAllSponsors()

	// Filter by status
	if (status !== 'all') {
		sponsors = sponsors.filter((s) => s.status === status)
	}

	// Filter by search
	if (search) {
		const lowerSearch = search.toLowerCase()
		sponsors = sponsors.filter(
			(s) =>
				s.company_name.toLowerCase().includes(lowerSearch) ||
				s.tagline.toLowerCase().includes(lowerSearch) ||
				s.contact_email?.toLowerCase().includes(lowerSearch)
		)
	}

	// Get subscription info for each sponsor
	const sponsorsWithSubscriptions: SponsorWithSubscription[] = sponsors.map((sponsor) => {
		const subscription = locals.sponsorSubscriptionService.getActiveSubscription(sponsor.id)
		const tier = subscription ? locals.sponsorTierService.getTierById(subscription.tier_id) : null

		return {
			...sponsor,
			tier_name: tier?.display_name,
			billing_type: subscription?.billing_type,
			subscription_status: subscription?.status
		}
	})

	// Paginate
	const offset = (page - 1) * perPage
	const paginatedSponsors = sponsorsWithSubscriptions.slice(offset, offset + perPage)

	return {
		sponsors: paginatedSponsors,
		pagination: {
			count: sponsorsWithSubscriptions.length,
			perPage,
			currentPage: page
		}
	}
})

export const getSponsor = query(sponsorIdSchema, async ({ id }) => {
	checkAdminAuth()
	const { locals } = getRequestEvent()

	const sponsor = locals.sponsorService.getSponsorById(id)
	if (!sponsor) return null

	const subscription = locals.sponsorSubscriptionService.getActiveSubscription(id)
	const tier = subscription ? locals.sponsorTierService.getTierById(subscription.tier_id) : null

	return {
		...sponsor,
		tier_name: tier?.display_name,
		tier_id: tier?.id,
		billing_type: subscription?.billing_type,
		subscription_status: subscription?.status,
		subscription_id: subscription?.id,
		stripe_subscription_id: subscription?.stripe_subscription_id,
		current_period_start: subscription?.current_period_start,
		current_period_end: subscription?.current_period_end
	}
})

export const updateSponsor = form(updateSponsorSchema, async (data) => {
	checkAdminAuth()
	const { locals, url } = getRequestEvent()

	try {
		locals.sponsorService.updateSponsor(data.id, {
			company_name: data.company_name,
			tagline: data.tagline,
			website_url: data.website_url,
			discount_code: data.discount_code || null,
			discount_description: data.discount_description || null,
			status: data.status
		})

		await getSponsors(getFiltersFromUrl(url)).refresh()
		await getSponsor({ id: data.id }).refresh()

		return {
			success: true,
			text: 'Sponsor updated successfully!'
		}
	} catch (error) {
		console.error('Error updating sponsor:', error)
		return {
			success: false,
			text: 'An error occurred while updating the sponsor.'
		}
	}
})

export const activateSponsor = form(sponsorIdSchema, async (data) => {
	checkAdminAuth()
	const { locals, url } = getRequestEvent()

	try {
		// Get sponsor details before activation for the social event
		const sponsor = locals.sponsorService.getSponsorById(data.id)
		if (!sponsor) {
			return { success: false, text: 'Sponsor not found' }
		}

		// Activate the sponsor
		locals.sponsorService.activateSponsor(data.id)

		// Also activate the subscription so it shows up in the active_sponsors view
		// Use getSubscriptionsBySponsor to find any subscription (not just 'active' ones)
		const subscriptions = locals.sponsorSubscriptionService.getSubscriptionsBySponsor(data.id)
		const subscription = subscriptions[0] // Get the most recent subscription
		let periodEnd: Date | null = null
		if (subscription && subscription.status !== 'active') {
			// Set the subscription period to start now and end in 30 days as a default fallback.
			// This is used when:
			// 1. Admin manually activates a pending sponsor before payment completes
			// 2. One-time payment sponsors that need manual activation
			// For Stripe-managed recurring subscriptions, these values will be overwritten
			// by webhook events (subscription.created, subscription.updated, invoice.paid)
			// with the actual billing period from Stripe.
			const now = new Date()
			periodEnd = new Date()
			periodEnd.setDate(periodEnd.getDate() + 30)
			locals.sponsorSubscriptionService.activateSubscription(subscription.id, now, periodEnd)
		} else if (subscription?.current_period_end) {
			periodEnd = new Date(subscription.current_period_end)
		}

		// Create FeedItem for the activated sponsor
		if (subscription) {
			const tier = locals.sponsorTierService.getTierById(subscription.tier_id)
			const isPremium = tier?.logo_size === 'large'
			locals.feedItemService.createSponsorFeedItem({
				sponsorId: data.id,
				isPremium,
				endDate: periodEnd
			})
		}

		// Trigger social event handler for sponsor activated
		if (locals.user) {
			locals.socialEventHandler.handleSponsorActivated({
				sponsor_id: data.id,
				sponsor_name: sponsor.company_name,
				sponsor_tagline: sponsor.tagline ?? undefined,
				sponsor_url: sponsor.website_url ?? undefined,
				link_url: sponsor.website_url || `${BASE_URL}/sponsors`,
				triggered_by_user_id: locals.user.id
			})
		}

		await getSponsors(getFiltersFromUrl(url)).refresh()
		await getSponsor({ id: data.id }).refresh()

		return {
			success: true,
			text: 'Sponsor activated successfully!'
		}
	} catch (error) {
		console.error('Error activating sponsor:', error)
		return {
			success: false,
			text: 'An error occurred while activating the sponsor.'
		}
	}
})

export const pauseSponsor = form(sponsorIdSchema, async (data) => {
	checkAdminAuth()
	const { locals, url } = getRequestEvent()

	try {
		locals.sponsorService.pauseSponsor(data.id)

		// Also pause the subscription
		const subscriptions = locals.sponsorSubscriptionService.getSubscriptionsBySponsor(data.id)
		const subscription = subscriptions.find((s) => s.status === 'active')
		if (subscription) {
			locals.sponsorSubscriptionService.updateStatus(subscription.id, 'paused')
		}

		// Deactivate FeedItem while paused
		locals.feedItemService.deactivateSponsorFeedItem(data.id)

		await getSponsors(getFiltersFromUrl(url)).refresh()
		await getSponsor({ id: data.id }).refresh()

		return {
			success: true,
			text: 'Sponsor paused successfully!'
		}
	} catch (error) {
		console.error('Error pausing sponsor:', error)
		return {
			success: false,
			text: 'An error occurred while pausing the sponsor.'
		}
	}
})

export const cancelSponsor = form(sponsorIdSchema, async (data) => {
	checkAdminAuth()
	const { locals, url } = getRequestEvent()

	try {
		locals.sponsorService.cancelSponsor(data.id)

		// Also cancel all subscriptions for this sponsor
		const subscriptions = locals.sponsorSubscriptionService.getSubscriptionsBySponsor(data.id)
		for (const subscription of subscriptions) {
			if (subscription.status !== 'canceled') {
				locals.sponsorSubscriptionService.updateStatus(subscription.id, 'canceled')

				// Also cancel the Stripe subscription if exists
				if (subscription.stripe_subscription_id) {
					try {
						await locals.stripeService.cancelSubscription(subscription.stripe_subscription_id)
					} catch (stripeError) {
						console.error('Error cancelling Stripe subscription:', stripeError)
						// Continue even if Stripe cancellation fails - we've already marked it cancelled locally
					}
				}
			}
		}

		// Deactivate FeedItem
		locals.feedItemService.deactivateSponsorFeedItem(data.id)

		await getSponsors(getFiltersFromUrl(url)).refresh()
		await getSponsor({ id: data.id }).refresh()

		return {
			success: true,
			text: 'Sponsor cancelled successfully!'
		}
	} catch (error) {
		console.error('Error cancelling sponsor:', error)
		return {
			success: false,
			text: 'An error occurred while cancelling the sponsor.'
		}
	}
})
