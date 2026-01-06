import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, locals }) => {
	const { token } = params

	// 1. Look up pending subscription by token
	const pending = locals.newsletterService.getPendingByToken(token)

	if (!pending) {
		// Token invalid or expired
		return { status: 'invalid' as const }
	}

	// 2. Subscribe the contact in Plunk
	const subscribeResult = await locals.emailService.subscribeContact(pending.email)

	if (!subscribeResult.success) {
		console.error('Failed to subscribe contact in Plunk:', pending.email)
		return { status: 'error' as const }
	}

	// 3. Delete the pending subscription
	locals.newsletterService.deletePending(pending.email)

	// 4. Return success status
	return { status: 'success' as const }
}
