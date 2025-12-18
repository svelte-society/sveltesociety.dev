import { Effect, Layer } from 'effect'
import { open, type Database } from 'lmdb'
import { StoreError } from '../schemas'
import { KeyValueStore, KeyValueStoreConfig } from '../services/KeyValueStore'

export const KeyValueStoreLive = Layer.scoped(
  KeyValueStore,
  Effect.gen(function* () {
    const { path } = yield* KeyValueStoreConfig

    const db: Database = yield* Effect.acquireRelease(
      Effect.sync(() => open({ path, compression: true })),
      (db) => Effect.sync(() => db.close())
    )

    const wrap = <A>(operation: string, fn: () => A): Effect.Effect<A, StoreError> =>
      Effect.try({
        try: fn,
        catch: (e) => new StoreError({ message: e instanceof Error ? e.message : 'Unknown', operation })
      })

    return {
      get: <T>(key: string) => wrap('get', () => db.get(key) as T | undefined),
      put: <T>(key: string, value: T) =>
        wrap('put', () => {
          db.putSync(key, value)
        }),
      remove: (key: string) => wrap('remove', () => db.removeSync(key)),
      entries: <T>() =>
        wrap('entries', () =>
          Array.from(db.getRange()).map(({ key, value }) => ({ key: String(key), value: value as T }))
        )
    }
  })
)
