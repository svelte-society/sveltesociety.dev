import { emailList, createEmail, sendEmail } from 'better-svelte-email/preview'
import { Renderer } from 'better-svelte-email'
import type { PageServerLoad, Actions } from './$types'
import { dev } from '$app/environment'
import { EmailService } from '$lib/server/services/email'
import appStyles from '../../../../../app.css?raw'

const renderer = new Renderer({ customCSS: appStyles })
const emailService = new EmailService()

export const load: PageServerLoad = ({ url }) => {
	const emails = emailList({ path: '/src/lib/templates/email' })
	const baseUrl = dev ? url.origin : 'https://sveltesociety.dev'
	return { emails, baseUrl }
}

export const actions: Actions = {
	...createEmail({ renderer }),
	...sendEmail({
		renderer,
		customSendEmailFunction: async ({ to, subject, html }) => {
			const success = await emailService.sendEmail({
				to,
				subject,
				body: html
			})

			if (success) {
				return { success: true }
			}

			return {
				success: false,
				error: 'Failed to send email via Plunk'
			}
		}
	})
}
