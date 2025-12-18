import { Context } from 'effect'

export interface EmailConfigShape {
  readonly region: string
  readonly accessKeyId: string
  readonly secretAccessKey: string
  readonly fromEmail: string
  readonly rateLimitMs: number
  readonly maxBatchSize: number
  readonly maxRetries: number
}

export class EmailConfig extends Context.Tag('EmailConfig')<EmailConfig, EmailConfigShape>() {}
