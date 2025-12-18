import { Context, Effect } from 'effect'
import { StoreError } from '../schemas'

export interface KeyValueStoreConfigShape {
  readonly path: string
}

export class KeyValueStoreConfig extends Context.Tag('KeyValueStoreConfig')<
  KeyValueStoreConfig,
  KeyValueStoreConfigShape
>() {}

export class KeyValueStore extends Context.Tag('KeyValueStore')<
  KeyValueStore,
  {
    readonly get: <T>(key: string) => Effect.Effect<T | undefined, StoreError>
    readonly put: <T>(key: string, value: T) => Effect.Effect<void, StoreError>
    readonly remove: (key: string) => Effect.Effect<void, StoreError>
    readonly entries: <T>() => Effect.Effect<ReadonlyArray<{ key: string; value: T }>, StoreError>
  }
>() {}
