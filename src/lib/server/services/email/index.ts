import { ConfigProvider, Layer } from 'effect'

// Re-export schemas and error types
export {
	EmailOptions,
	EmailResult,
	QueuedEmail,
	EmailNotConfigured,
	EmailSendError,
	EmailQueueError,
	StoreError
} from './schemas'

export type { NewEmail } from './schemas'

// Re-export service definitions (interfaces)
export {
	KeyValueStore,
	KeyValueStoreConfig,
	type KeyValueStoreConfigShape,
	EmailQueueService,
	SesClientService,
	EmailService
} from './services'

// Re-export live layer implementations
export {
	KeyValueStoreLive,
	KeyValueStoreConfigLive,
	EmailQueueLive,
	SesClientLive,
	SesClientConsole,
	EmailServiceLive
} from './layers'

// Re-export test layer implementations
export {
	KeyValueStoreTest,
	SesClientTest,
	makeSesClientTest,
	makeSesClientFailing,
	type RecordedEmail,
	EmailServiceTest
} from './layers'

// =============================================================================
// Test Helpers
// =============================================================================

/**
 * Default test configuration values.
 */
export const testConfig = {
	region: 'us-east-1',
	accessKeyId: 'test-access-key',
	secretAccessKey: 'test-secret-key',
	fromEmail: 'test@example.com',
	rateLimitMs: 0,
	maxBatchSize: 50,
	maxRetries: 3
} as const

/**
 * Create a ConfigProvider for testing with custom overrides.
 * Use with Layer.setConfigProvider to inject test config.
 */
export const makeTestConfigProvider = (
	overrides: Partial<{
		region: string
		accessKeyId: string
		secretAccessKey: string
		fromEmail: string
		rateLimitMs: number
		maxBatchSize: number
		maxRetries: number
	}> = {}
) =>
	ConfigProvider.fromMap(
		new Map([
			['AWS_SES_REGION', overrides.region ?? testConfig.region],
			['AWS_SES_ACCESS_KEY', overrides.accessKeyId ?? testConfig.accessKeyId],
			['AWS_SES_SECRET_KEY', overrides.secretAccessKey ?? testConfig.secretAccessKey],
			['AWS_SES_FROM_EMAIL', overrides.fromEmail ?? testConfig.fromEmail],
			['AWS_SES_RATE_LIMIT_MS', String(overrides.rateLimitMs ?? testConfig.rateLimitMs)],
			['AWS_SES_MAX_BATCH_SIZE', String(overrides.maxBatchSize ?? testConfig.maxBatchSize)],
			['AWS_SES_MAX_RETRIES', String(overrides.maxRetries ?? testConfig.maxRetries)]
		])
	)

/**
 * Layer that sets test configuration for all Effect config reads.
 */
export const TestConfigLayer = Layer.setConfigProvider(makeTestConfigProvider())

// =============================================================================
// Composed Layers
// =============================================================================

import {
	KeyValueStoreLive,
	KeyValueStoreTest,
	KeyValueStoreConfigLive,
	EmailQueueLive,
	SesClientLive,
	SesClientTest,
	EmailServiceLive
} from './layers'

// Full email service with LMDB storage (production)
// Requires AWS_SES_* environment variables
export const EmailLive = EmailServiceLive.pipe(
	Layer.provide(SesClientLive),
	Layer.provide(EmailQueueLive),
	Layer.provide(KeyValueStoreLive),
	Layer.provide(KeyValueStoreConfigLive)
)

// Email service with in-memory storage but real SES (integration testing)
// Requires AWS_SES_* environment variables
export const EmailLiveTest = EmailServiceLive.pipe(
	Layer.provide(SesClientLive),
	Layer.provide(EmailQueueLive),
	Layer.provide(KeyValueStoreTest)
)

// Email service fully mocked (unit testing - no external deps)
// Uses TestConfigLayer for config values
export const EmailTestLayer = EmailServiceLive.pipe(
	Layer.provide(SesClientTest),
	Layer.provide(EmailQueueLive),
	Layer.provide(KeyValueStoreTest),
	Layer.provide(TestConfigLayer)
)

// =============================================================================
// Runtime / SvelteKit Integration
// =============================================================================

export { createEmailClient, disposeEmailRuntime, type EmailClient } from './runtime'
