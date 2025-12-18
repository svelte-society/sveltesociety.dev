import { describe, expect, test } from 'bun:test'
import { Effect, Layer } from 'effect'
import {
  EmailQueueService,
  EmailQueueLive,
  KeyValueStoreTest,
  type NewEmail
} from './index'

describe('EmailQueueService', () => {
  // Create a fresh test layer for each test
  const makeTestLayer = () =>
    EmailQueueLive.pipe(Layer.provide(KeyValueStoreTest))

  const runWithQueue = <A, E>(effect: Effect.Effect<A, E, EmailQueueService>) =>
    Effect.runPromise(effect.pipe(Effect.provide(makeTestLayer())))

  const sampleEmail: NewEmail = {
    to: ['user@example.com'],
    subject: 'Test Subject',
    html: '<p>Hello</p>',
    text: 'Hello',
    from: 'sender@example.com'
  }

  test('add creates a new queued email with pending status', async () => {
    const result = await runWithQueue(
      Effect.gen(function* () {
        const queue = yield* EmailQueueService
        const id = yield* queue.add(sampleEmail)
        const email = yield* queue.get(id)
        return { id, email }
      })
    )

    expect(result.id).toBeDefined()
    expect(result.email).toBeDefined()
    expect(result.email!.status).toBe('pending')
    expect(result.email!.attempts).toBe(0)
    expect(result.email!.to).toEqual(['user@example.com'])
  })

  test('add generates unique IDs', async () => {
    const result = await runWithQueue(
      Effect.gen(function* () {
        const queue = yield* EmailQueueService
        const id1 = yield* queue.add(sampleEmail)
        const id2 = yield* queue.add(sampleEmail)
        const id3 = yield* queue.add(sampleEmail)
        return [id1, id2, id3]
      })
    )

    const uniqueIds = new Set(result)
    expect(uniqueIds.size).toBe(3)
  })

  test('get returns undefined for non-existent ID', async () => {
    const result = await runWithQueue(
      Effect.gen(function* () {
        const queue = yield* EmailQueueService
        return yield* queue.get('non-existent-id')
      })
    )
    expect(result).toBeUndefined()
  })

  test('getPending returns only pending emails sorted by createdAt', async () => {
    const result = await runWithQueue(
      Effect.gen(function* () {
        const queue = yield* EmailQueueService

        // Add emails with slight delays to ensure different createdAt
        const id1 = yield* queue.add({ ...sampleEmail, subject: 'First' })
        yield* Effect.sleep('10 millis')
        const id2 = yield* queue.add({ ...sampleEmail, subject: 'Second' })
        yield* Effect.sleep('10 millis')
        const id3 = yield* queue.add({ ...sampleEmail, subject: 'Third' })

        // Mark one as processing
        yield* queue.markProcessing(id2)

        return yield* queue.getPending()
      })
    )

    expect(result).toHaveLength(2)
    expect(result[0].subject).toBe('First')
    expect(result[1].subject).toBe('Third')
  })

  test('getPending respects limit parameter', async () => {
    const result = await runWithQueue(
      Effect.gen(function* () {
        const queue = yield* EmailQueueService

        yield* queue.add({ ...sampleEmail, subject: 'Email 1' })
        yield* queue.add({ ...sampleEmail, subject: 'Email 2' })
        yield* queue.add({ ...sampleEmail, subject: 'Email 3' })
        yield* queue.add({ ...sampleEmail, subject: 'Email 4' })

        return yield* queue.getPending(2)
      })
    )

    expect(result).toHaveLength(2)
  })

  test('markProcessing updates status and increments attempts', async () => {
    const result = await runWithQueue(
      Effect.gen(function* () {
        const queue = yield* EmailQueueService
        const id = yield* queue.add(sampleEmail)

        yield* queue.markProcessing(id)
        const afterFirst = yield* queue.get(id)

        yield* queue.markProcessing(id)
        const afterSecond = yield* queue.get(id)

        return { afterFirst, afterSecond }
      })
    )

    expect(result.afterFirst!.status).toBe('processing')
    expect(result.afterFirst!.attempts).toBe(1)
    expect(result.afterSecond!.attempts).toBe(2)
  })

  test('markComplete removes the email from queue', async () => {
    const result = await runWithQueue(
      Effect.gen(function* () {
        const queue = yield* EmailQueueService
        const id = yield* queue.add(sampleEmail)

        yield* queue.markComplete(id)
        return yield* queue.get(id)
      })
    )

    expect(result).toBeUndefined()
  })

  test('markFailed updates status and records error', async () => {
    const result = await runWithQueue(
      Effect.gen(function* () {
        const queue = yield* EmailQueueService
        const id = yield* queue.add(sampleEmail)

        yield* queue.markFailed(id, 'Connection timeout')
        return yield* queue.get(id)
      })
    )

    expect(result!.status).toBe('failed')
    expect(result!.lastError).toBe('Connection timeout')
  })

  test('count returns correct pending and failed counts', async () => {
    const result = await runWithQueue(
      Effect.gen(function* () {
        const queue = yield* EmailQueueService

        // Add 3 emails
        const id1 = yield* queue.add({ ...sampleEmail, subject: 'Email 1' })
        const id2 = yield* queue.add({ ...sampleEmail, subject: 'Email 2' })
        const id3 = yield* queue.add({ ...sampleEmail, subject: 'Email 3' })

        // Mark one as processing (not counted as pending)
        yield* queue.markProcessing(id1)

        // Mark one as failed
        yield* queue.markFailed(id2, 'Error')

        return yield* queue.count()
      })
    )

    expect(result.pending).toBe(1) // Only id3
    expect(result.failed).toBe(1) // Only id2
  })

  test('count returns zeros for empty queue', async () => {
    const result = await runWithQueue(
      Effect.gen(function* () {
        const queue = yield* EmailQueueService
        return yield* queue.count()
      })
    )

    expect(result.pending).toBe(0)
    expect(result.failed).toBe(0)
  })

  test('preserves replyTo field', async () => {
    const emailWithReplyTo: NewEmail = {
      ...sampleEmail,
      replyTo: 'reply@example.com'
    }

    const result = await runWithQueue(
      Effect.gen(function* () {
        const queue = yield* EmailQueueService
        const id = yield* queue.add(emailWithReplyTo)
        return yield* queue.get(id)
      })
    )

    expect(result!.replyTo).toBe('reply@example.com')
  })
})
