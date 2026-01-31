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

	// 3. If a user was logged in when subscribing, store their plunk_contact_id
	// We use the user_id from the pending record since the user may have a different
	// email in their account (e.g., GitHub OAuth users often have null email)
	if (subscribeResult.id && pending.user_id) {
		locals.userService.updateNewsletterPreference(pending.user_id, 'subscribed', subscribeResult.id)
	}

	// 4. Delete the pending subscription
	locals.newsletterService.deletePending(pending.email)

	// 5. Return success status
	return { status: 'success' as const }
}
