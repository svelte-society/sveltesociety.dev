import { Effect, Layer } from 'effect'
import { EmailResult } from '../schemas'
import { EmailService } from '../services/EmailService'

export const EmailServiceTest = Layer.succeed(EmailService, {
  send: () =>
    Effect.succeed(new EmailResult({ success: true, messageId: 'test-id', queueId: 'test-queue' })),
  sendBatch: (recipients) =>
    Effect.succeed(recipients.map(() => new EmailResult({ success: true, messageId: 'test-id' }))),
  processQueue: () => Effect.succeed({ processed: 0, failed: 0 }),
  getStats: () => Effect.succeed({ pending: 0, failed: 0 })
})
