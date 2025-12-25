import { Context, Effect } from 'effect'
import { EmailQueueError, QueuedEmail, type NewEmail } from '../schemas'

export class EmailQueueService extends Context.Tag('EmailQueueService')<
  EmailQueueService,
  {
    readonly add: (email: NewEmail) => Effect.Effect<string, EmailQueueError>
    readonly get: (id: string) => Effect.Effect<typeof QueuedEmail.Type | undefined, EmailQueueError>
    readonly getPending: (
      limit?: number
    ) => Effect.Effect<ReadonlyArray<typeof QueuedEmail.Type>, EmailQueueError>
    readonly markProcessing: (id: string) => Effect.Effect<void, EmailQueueError>
    readonly markComplete: (id: string) => Effect.Effect<void, EmailQueueError>
    readonly markFailed: (id: string, error: string) => Effect.Effect<void, EmailQueueError>
    readonly count: () => Effect.Effect<{ pending: number; failed: number }, EmailQueueError>
  }
>() {}
