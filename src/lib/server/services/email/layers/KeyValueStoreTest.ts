import { Effect, Layer } from 'effect'
import { KeyValueStore } from '../services/KeyValueStore'

export const KeyValueStoreTest = Layer.sync(KeyValueStore, () => {
  const store = new Map<string, unknown>()
  return {
    get: <T>(key: string) => Effect.succeed(store.get(key) as T | undefined),
    put: <T>(key: string, value: T) =>
      Effect.sync(() => {
        store.set(key, value)
      }),
    remove: (key: string) =>
      Effect.sync(() => {
        store.delete(key)
      }),
    entries: <T>() =>
      Effect.succeed(Array.from(store.entries()).map(([key, value]) => ({ key, value: value as T })))
  }
})
