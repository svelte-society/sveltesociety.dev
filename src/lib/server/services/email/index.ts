import { Layer } from 'effect'

// Re-export schemas and errors
export {
  EmailOptions,
  EmailResult,
  QueuedEmail,
  EmailNotConfigured,
  EmailSendError,
  EmailQueueError,
  StoreError,
  type NewEmail
} from './schemas'

// Re-export service definitions (interfaces)
export {
  EmailConfig,
  type EmailConfigShape,
  KeyValueStore,
  KeyValueStoreConfig,
  type KeyValueStoreConfigShape,
  EmailQueueService,
  SesClientService,
  EmailService
} from './services'

// Re-export live layer implementations
export {
  EmailConfigLive,
  KeyValueStoreLive,
  KeyValueStoreConfigLive,
  EmailQueueLive,
  SesClientLive,
  EmailServiceLive
} from './layers'

// Re-export test layer implementations
export {
  EmailConfigTest,
  makeEmailConfigTest,
  KeyValueStoreTest,
  SesClientTest,
  makeSesClientTest,
  makeSesClientFailing,
  type RecordedEmail,
  EmailServiceTest
} from './layers'

// =============================================================================
// Composed Layers
// =============================================================================

import {
  EmailConfigLive,
  EmailConfigTest,
  KeyValueStoreLive,
  KeyValueStoreTest,
  KeyValueStoreConfigLive,
  EmailQueueLive,
  SesClientLive,
  SesClientTest,
  EmailServiceLive
} from './layers'

// Full email service with LMDB storage (production)
export const EmailLive = EmailServiceLive.pipe(
  Layer.provide(SesClientLive),
  Layer.provide(EmailQueueLive),
  Layer.provide(KeyValueStoreLive),
  Layer.provide(KeyValueStoreConfigLive),
  Layer.provide(EmailConfigLive)
)

// Email service with in-memory storage but real SES (integration testing)
export const EmailLiveTest = EmailServiceLive.pipe(
  Layer.provide(SesClientLive),
  Layer.provide(EmailQueueLive),
  Layer.provide(KeyValueStoreTest),
  Layer.provide(EmailConfigLive)
)

// Email service fully mocked (unit testing - no external deps)
export const EmailTestLayer = EmailServiceLive.pipe(
  Layer.provide(SesClientTest),
  Layer.provide(EmailQueueLive),
  Layer.provide(KeyValueStoreTest),
  Layer.provide(EmailConfigTest)
)
