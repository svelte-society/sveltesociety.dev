import { Effect, Layer, Ref } from 'effect'
import { EmailSendError } from '../schemas'
import { SesClientService } from '../services/SesClient'

/**
 * A recorded email from SesClientTest
 */
export interface RecordedEmail {
  readonly to: ReadonlyArray<string>
  readonly subject: string
  readonly html: string
  readonly text: string
  readonly from: string
  readonly replyTo?: string
  readonly sentAt: Date
}

/**
 * Test SES client that records emails instead of sending them.
 * Always succeeds unless configured otherwise.
 */
export const SesClientTest = Layer.succeed(SesClientService, {
  sendEmail: (params) =>
    Effect.succeed(`test-message-${Date.now()}`)
})

/**
 * Create a test SES client with a shared ref to record sent emails.
 * Useful for asserting that emails were sent with correct content.
 *
 * @example
 * ```ts
 * const ref = Ref.unsafeMake<RecordedEmail[]>([])
 * const layer = makeSesClientTest(ref)
 *
 * // Run your test...
 *
 * const sent = Ref.get(ref).pipe(Effect.runSync)
 * expect(sent).toHaveLength(1)
 * expect(sent[0].to).toContain('user@example.com')
 * ```
 */
export const makeSesClientTest = (
  recordRef: Ref.Ref<RecordedEmail[]>,
  options?: {
    /** If provided, sendEmail will fail with this error */
    failWith?: string
    /** If provided, sendEmail will fail after this many calls */
    failAfter?: number
  }
) =>
  Layer.effect(
    SesClientService,
    Effect.gen(function* () {
      let callCount = 0

      return {
        sendEmail: (params) =>
          Effect.gen(function* () {
            callCount++

            // Check if we should fail
            if (options?.failWith) {
              return yield* Effect.fail(new EmailSendError({ message: options.failWith }))
            }

            if (options?.failAfter !== undefined && callCount > options.failAfter) {
              return yield* Effect.fail(
                new EmailSendError({ message: `Failed after ${options.failAfter} calls` })
              )
            }

            // Record the email
            const recorded: RecordedEmail = {
              to: params.to,
              subject: params.subject,
              html: params.html,
              text: params.text,
              from: params.from,
              replyTo: params.replyTo,
              sentAt: new Date()
            }

            yield* Ref.update(recordRef, (emails) => [...emails, recorded])

            return `test-message-${Date.now()}-${callCount}`
          })
      }
    })
  )

/**
 * Create a test SES client that always fails with the given error.
 */
export const makeSesClientFailing = (errorMessage: string) =>
  Layer.succeed(SesClientService, {
    sendEmail: () => Effect.fail(new EmailSendError({ message: errorMessage }))
  })
