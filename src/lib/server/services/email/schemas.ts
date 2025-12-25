import { Schema } from 'effect'

// =============================================================================
// Schemas
// =============================================================================

export class EmailOptions extends Schema.Class<EmailOptions>('EmailOptions')({
  to: Schema.Union(Schema.String, Schema.Array(Schema.String)),
  subject: Schema.String,
  html: Schema.String,
  text: Schema.String,
  from: Schema.optional(Schema.String),
  replyTo: Schema.optional(Schema.String)
}) {}

export class EmailResult extends Schema.Class<EmailResult>('EmailResult')({
  success: Schema.Boolean,
  messageId: Schema.optional(Schema.String),
  error: Schema.optional(Schema.String),
  queueId: Schema.optional(Schema.String)
}) {}

export class QueuedEmail extends Schema.Class<QueuedEmail>('QueuedEmail')({
  id: Schema.String,
  to: Schema.Array(Schema.String),
  subject: Schema.String,
  html: Schema.String,
  text: Schema.String,
  from: Schema.String,
  replyTo: Schema.optional(Schema.String),
  status: Schema.Literal('pending', 'processing', 'failed'),
  attempts: Schema.Number,
  lastError: Schema.optional(Schema.String),
  createdAt: Schema.Number
}) {}

export type NewEmail = Omit<typeof QueuedEmail.Type, 'id' | 'status' | 'attempts' | 'createdAt'>

// =============================================================================
// Errors
// =============================================================================

export class EmailNotConfigured extends Schema.TaggedError<EmailNotConfigured>()(
  'EmailNotConfigured',
  { message: Schema.String }
) {}

export class EmailSendError extends Schema.TaggedError<EmailSendError>()(
  'EmailSendError',
  {
    message: Schema.String,
    queueId: Schema.optional(Schema.String),
    cause: Schema.optional(Schema.Unknown)
  }
) {}

export class EmailQueueError extends Schema.TaggedError<EmailQueueError>()(
  'EmailQueueError',
  {
    message: Schema.String,
    operation: Schema.String
  }
) {}

export class StoreError extends Schema.TaggedError<StoreError>()(
  'StoreError',
  { message: Schema.String, operation: Schema.String }
) {}
