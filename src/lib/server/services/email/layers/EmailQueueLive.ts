import { Effect, Layer } from 'effect'
import { randomUUID } from 'crypto'
import { EmailQueueError, QueuedEmail, type NewEmail } from '../schemas'
import { KeyValueStore } from '../services/KeyValueStore'
import { EmailQueueService } from '../services/EmailQueue'

export const EmailQueueLive = Layer.effect(
  EmailQueueService,
  Effect.gen(function* () {
    const store = yield* KeyValueStore

    const wrapError = <A, E>(
      effect: Effect.Effect<A, E>,
      operation: string
    ): Effect.Effect<A, EmailQueueError> =>
      Effect.catchAll(effect, (e) =>
        Effect.fail(
          new EmailQueueError({
            message: e instanceof Error ? e.message : String(e),
            operation
          })
        )
      )

    return {
      add: (email: NewEmail) =>
        wrapError(
          Effect.gen(function* () {
            const id = randomUUID()
            const queuedEmail: typeof QueuedEmail.Type = {
              ...email,
              id,
              status: 'pending',
              attempts: 0,
              createdAt: Date.now()
            }
            yield* store.put(id, queuedEmail)
            return id
          }),
          'add'
        ),

      get: (id: string) => wrapError(store.get<typeof QueuedEmail.Type>(id), 'get'),

      getPending: (limit?: number) =>
        wrapError(
          Effect.gen(function* () {
            const all = yield* store.entries<typeof QueuedEmail.Type>()
            const pending = all.filter((e) => e.value.status === 'pending').map((e) => e.value)
            pending.sort((a, b) => a.createdAt - b.createdAt)
            return limit ? pending.slice(0, limit) : pending
          }),
          'getPending'
        ),

      markProcessing: (id: string) =>
        wrapError(
          Effect.gen(function* () {
            const email = yield* store.get<typeof QueuedEmail.Type>(id)
            if (email)
              yield* store.put(id, {
                ...email,
                status: 'processing' as const,
                attempts: email.attempts + 1
              })
          }),
          'markProcessing'
        ),

      markComplete: (id: string) => wrapError(store.remove(id), 'markComplete'),

      markFailed: (id: string, error: string) =>
        wrapError(
          Effect.gen(function* () {
            const email = yield* store.get<typeof QueuedEmail.Type>(id)
            if (email) yield* store.put(id, { ...email, status: 'failed' as const, lastError: error })
          }),
          'markFailed'
        ),

      count: () =>
        wrapError(
          Effect.gen(function* () {
            const all = yield* store.entries<typeof QueuedEmail.Type>()
            let pending = 0,
              failed = 0
            for (const { value } of all) {
              if (value.status === 'pending') pending++
              else if (value.status === 'failed') failed++
            }
            return { pending, failed }
          }),
          'count'
        )
    }
  })
)
