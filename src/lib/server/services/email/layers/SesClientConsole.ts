import { Effect, Layer } from 'effect'
import { SesClientService } from '../services/SesClient'

/**
 * Console-logging SES client for development.
 * Logs email details to console instead of sending via AWS SES.
 */
export const SesClientConsole = Layer.succeed(SesClientService, {
	sendEmail: (params) =>
		Effect.sync(() => {
			const timestamp = new Date().toISOString()
			const messageId = `dev-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

			console.log('\n' + '='.repeat(60))
			console.log('📧 EMAIL (dev mode - not sent)')
			console.log('='.repeat(60))
			console.log(`Time:    ${timestamp}`)
			console.log(`From:    ${params.from}`)
			console.log(`To:      ${params.to.join(', ')}`)
			console.log(`Subject: ${params.subject}`)
			if (params.replyTo) {
				console.log(`ReplyTo: ${params.replyTo}`)
			}
			console.log('-'.repeat(60))
			console.log('Text:')
			console.log(params.text)
			console.log('-'.repeat(60))
			console.log(`Message ID: ${messageId}`)
			console.log('='.repeat(60) + '\n')

			return messageId
		})
})
