import { Layer } from 'effect'
import { EmailConfig, type EmailConfigShape } from '../services/EmailConfig'

/**
 * Default test configuration values.
 * Override by creating your own Layer.succeed(EmailConfig, {...})
 */
const defaultTestConfig: EmailConfigShape = {
  region: 'us-east-1',
  accessKeyId: 'test-access-key',
  secretAccessKey: 'test-secret-key',
  fromEmail: 'test@example.com',
  rateLimitMs: 0, // No rate limiting in tests
  maxBatchSize: 50,
  maxRetries: 3
}

/**
 * Test configuration layer with sensible defaults.
 * Use this in unit tests to avoid needing real AWS credentials.
 */
export const EmailConfigTest = Layer.succeed(EmailConfig, defaultTestConfig)

/**
 * Create a test config layer with custom values.
 */
export const makeEmailConfigTest = (overrides: Partial<EmailConfigShape> = {}) =>
  Layer.succeed(EmailConfig, { ...defaultTestConfig, ...overrides })
