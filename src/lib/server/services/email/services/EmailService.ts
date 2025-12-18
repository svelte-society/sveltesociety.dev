import { Context, Effect } from 'effect'
import { EmailOptions, EmailResult, EmailSendError, EmailQueueError } from '../schemas'

export class EmailService extends Context.Tag('EmailService')<
  EmailService,
  {
    readonly send: (
      options: typeof EmailOptions.Type
    ) => Effect.Effect<typeof EmailResult.Type, EmailSendError | EmailQueueError>

    readonly sendBatch: (
      recipients: ReadonlyArray<string>,
      options: Omit<typeof EmailOptions.Type, 'to'>
    ) => Effect.Effect<ReadonlyArray<typeof EmailResult.Type>, EmailSendError | EmailQueueError>

    readonly processQueue: () => Effect.Effect<
      { readonly processed: number; readonly failed: number },
      EmailSendError | EmailQueueError
    >

    readonly getStats: () => Effect.Effect<
      { readonly pending: number; readonly failed: number },
      EmailQueueError
    >
  }
>() {}
