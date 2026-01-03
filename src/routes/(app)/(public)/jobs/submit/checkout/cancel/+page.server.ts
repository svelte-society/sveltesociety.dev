import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals, url }) => {
	const paymentId = url.searchParams.get('payment_id')

	if (paymentId) {
		// Mark payment as failed/cancelled
		try {
			locals.paymentService.updatePaymentStatus(paymentId, 'failed')
		} catch (error) {
			console.error('Error updating payment status:', error)
		}
	}

	return {
		paymentId
	}
}
