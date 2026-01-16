import { getRequestEvent, query } from '$app/server'

/**
 * Get active sponsor tiers for display
 */
export const getSponsorTiers = query(async () => {
	const { locals } = getRequestEvent()
	return locals.sponsorTierService.getActiveTiers()
})
