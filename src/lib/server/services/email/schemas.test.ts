import { describe, expect, test } from 'bun:test'
import { Schema } from 'effect'
import {
  EmailOptions,
  EmailResult,
  QueuedEmail,
  EmailNotConfigured,
  EmailSendError,
  EmailQueueError,
  StoreError
} from './schemas'

describe('EmailOptions schema', () => {
  const decode = Schema.decodeUnknownSync(EmailOptions)

  test('accepts valid email with string recipient', () => {
    const input = {
      to: 'user@example.com',
      subject: 'Test Subject',
      html: '<p>Hello</p>',
      text: 'Hello'
    }
    const result = decode(input)
    expect(result.to).toBe('user@example.com')
    expect(result.subject).toBe('Test Subject')
  })

  test('accepts valid email with array recipients', () => {
    const input = {
      to: ['user1@example.com', 'user2@example.com'],
      subject: 'Test Subject',
      html: '<p>Hello</p>',
      text: 'Hello'
    }
    const result = decode(input)
    expect(result.to).toEqual(['user1@example.com', 'user2@example.com'])
  })

  test('accepts optional from and replyTo', () => {
    const input = {
      to: 'user@example.com',
      subject: 'Test',
      html: '<p>Hi</p>',
      text: 'Hi',
      from: 'sender@example.com',
      replyTo: 'reply@example.com'
    }
    const result = decode(input)
    expect(result.from).toBe('sender@example.com')
    expect(result.replyTo).toBe('reply@example.com')
  })

  test('rejects missing required fields', () => {
    expect(() => decode({ to: 'user@example.com' })).toThrow()
    expect(() => decode({ subject: 'Test' })).toThrow()
    expect(() => decode({})).toThrow()
  })
})

describe('EmailResult schema', () => {
  const decode = Schema.decodeUnknownSync(EmailResult)

  test('accepts successful result', () => {
    const input = {
      success: true,
      messageId: 'msg-123',
      queueId: 'queue-456'
    }
    const result = decode(input)
    expect(result.success).toBe(true)
    expect(result.messageId).toBe('msg-123')
  })

  test('accepts failed result with error', () => {
    const input = {
      success: false,
      error: 'Something went wrong',
      queueId: 'queue-456'
    }
    const result = decode(input)
    expect(result.success).toBe(false)
    expect(result.error).toBe('Something went wrong')
  })

  test('accepts minimal result', () => {
    const result = decode({ success: true })
    expect(result.success).toBe(true)
    expect(result.messageId).toBeUndefined()
  })
})

describe('QueuedEmail schema', () => {
  const decode = Schema.decodeUnknownSync(QueuedEmail)

  test('accepts valid queued email', () => {
    const input = {
      id: 'uuid-123',
      to: ['user@example.com'],
      subject: 'Test',
      html: '<p>Hi</p>',
      text: 'Hi',
      from: 'sender@example.com',
      status: 'pending',
      attempts: 0,
      createdAt: Date.now()
    }
    const result = decode(input)
    expect(result.id).toBe('uuid-123')
    expect(result.status).toBe('pending')
    expect(result.attempts).toBe(0)
  })

  test('accepts all valid statuses', () => {
    const base = {
      id: 'uuid-123',
      to: ['user@example.com'],
      subject: 'Test',
      html: '<p>Hi</p>',
      text: 'Hi',
      from: 'sender@example.com',
      attempts: 0,
      createdAt: Date.now()
    }

    expect(decode({ ...base, status: 'pending' }).status).toBe('pending')
    expect(decode({ ...base, status: 'processing' }).status).toBe('processing')
    expect(decode({ ...base, status: 'failed' }).status).toBe('failed')
  })

  test('rejects invalid status', () => {
    const input = {
      id: 'uuid-123',
      to: ['user@example.com'],
      subject: 'Test',
      html: '<p>Hi</p>',
      text: 'Hi',
      from: 'sender@example.com',
      status: 'invalid',
      attempts: 0,
      createdAt: Date.now()
    }
    expect(() => decode(input)).toThrow()
  })

  test('accepts optional lastError and replyTo', () => {
    const input = {
      id: 'uuid-123',
      to: ['user@example.com'],
      subject: 'Test',
      html: '<p>Hi</p>',
      text: 'Hi',
      from: 'sender@example.com',
      replyTo: 'reply@example.com',
      status: 'failed',
      attempts: 3,
      lastError: 'Connection timeout',
      createdAt: Date.now()
    }
    const result = decode(input)
    expect(result.replyTo).toBe('reply@example.com')
    expect(result.lastError).toBe('Connection timeout')
  })
})

describe('Error classes', () => {
  test('EmailNotConfigured has correct tag', () => {
    const error = new EmailNotConfigured({ message: 'Missing AWS credentials' })
    expect(error._tag).toBe('EmailNotConfigured')
    expect(error.message).toBe('Missing AWS credentials')
  })

  test('EmailSendError has correct tag and optional fields', () => {
    const error = new EmailSendError({
      message: 'Failed to send',
      queueId: 'queue-123',
      cause: new Error('Network error')
    })
    expect(error._tag).toBe('EmailSendError')
    expect(error.message).toBe('Failed to send')
    expect(error.queueId).toBe('queue-123')
  })

  test('EmailQueueError has correct tag', () => {
    const error = new EmailQueueError({
      message: 'Queue full',
      operation: 'add'
    })
    expect(error._tag).toBe('EmailQueueError')
    expect(error.operation).toBe('add')
  })

  test('StoreError has correct tag', () => {
    const error = new StoreError({
      message: 'Database error',
      operation: 'put'
    })
    expect(error._tag).toBe('StoreError')
    expect(error.operation).toBe('put')
  })
})
