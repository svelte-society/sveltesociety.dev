import { describe, expect, test, beforeEach } from 'bun:test'
import { Effect, Layer } from 'effect'
import { KeyValueStore, KeyValueStoreTest } from './index'

describe('KeyValueStoreTest', () => {
  const runWithStore = <A, E>(effect: Effect.Effect<A, E, KeyValueStore>) =>
    Effect.runPromise(effect.pipe(Effect.provide(KeyValueStoreTest)))

  test('get returns undefined for non-existent key', async () => {
    const result = await runWithStore(
      Effect.gen(function* () {
        const store = yield* KeyValueStore
        return yield* store.get<string>('non-existent')
      })
    )
    expect(result).toBeUndefined()
  })

  test('put and get round-trip works', async () => {
    const result = await runWithStore(
      Effect.gen(function* () {
        const store = yield* KeyValueStore
        yield* store.put('key1', { name: 'test', value: 42 })
        return yield* store.get<{ name: string; value: number }>('key1')
      })
    )
    expect(result).toEqual({ name: 'test', value: 42 })
  })

  test('put overwrites existing value', async () => {
    const result = await runWithStore(
      Effect.gen(function* () {
        const store = yield* KeyValueStore
        yield* store.put('key1', 'first')
        yield* store.put('key1', 'second')
        return yield* store.get<string>('key1')
      })
    )
    expect(result).toBe('second')
  })

  test('remove deletes key', async () => {
    const result = await runWithStore(
      Effect.gen(function* () {
        const store = yield* KeyValueStore
        yield* store.put('to-delete', 'value')
        yield* store.remove('to-delete')
        return yield* store.get<string>('to-delete')
      })
    )
    expect(result).toBeUndefined()
  })

  test('remove on non-existent key is no-op', async () => {
    await runWithStore(
      Effect.gen(function* () {
        const store = yield* KeyValueStore
        yield* store.remove('non-existent')
      })
    )
    // Should not throw
  })

  test('entries returns all key-value pairs', async () => {
    const result = await runWithStore(
      Effect.gen(function* () {
        const store = yield* KeyValueStore
        yield* store.put('a', 1)
        yield* store.put('b', 2)
        yield* store.put('c', 3)
        return yield* store.entries<number>()
      })
    )
    expect(result).toHaveLength(3)
    expect(result.map((e) => e.key).sort()).toEqual(['a', 'b', 'c'])
    expect(result.map((e) => e.value).sort()).toEqual([1, 2, 3])
  })

  test('entries returns empty array for empty store', async () => {
    const result = await runWithStore(
      Effect.gen(function* () {
        const store = yield* KeyValueStore
        return yield* store.entries<unknown>()
      })
    )
    expect(result).toEqual([])
  })

  test('handles complex objects', async () => {
    const complexObject = {
      id: 'test-123',
      nested: { deep: { value: [1, 2, 3] } },
      date: new Date().toISOString(),
      nullable: null
    }

    const result = await runWithStore(
      Effect.gen(function* () {
        const store = yield* KeyValueStore
        yield* store.put('complex', complexObject)
        return yield* store.get<typeof complexObject>('complex')
      })
    )
    expect(result).toEqual(complexObject)
  })
})
