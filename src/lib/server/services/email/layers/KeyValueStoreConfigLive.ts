import { Layer } from 'effect'
import { KeyValueStoreConfig } from '../services/KeyValueStore'

export const KeyValueStoreConfigLive = Layer.succeed(KeyValueStoreConfig, {
  path: '.data/email-queue'
})
