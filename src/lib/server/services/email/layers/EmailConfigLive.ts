import { Config, Effect, Layer } from 'effect'
import { EmailConfig } from '../services/EmailConfig'

const EmailConfigEffect = Effect.gen(function* () {
  const region = yield* Config.string('AWS_SES_REGION')
  const accessKeyId = yield* Config.string('AWS_SES_ACCESS_KEY')
  const secretAccessKey = yield* Config.string('AWS_SES_SECRET_KEY')
  const fromEmail = yield* Config.string('AWS_SES_FROM_EMAIL')
  const rateLimitMs = yield* Config.number('AWS_SES_RATE_LIMIT_MS').pipe(Config.withDefault(100))
  const maxBatchSize = yield* Config.number('AWS_SES_MAX_BATCH_SIZE').pipe(Config.withDefault(50))
  const maxRetries = yield* Config.number('AWS_SES_MAX_RETRIES').pipe(Config.withDefault(3))

  return { region, accessKeyId, secretAccessKey, fromEmail, rateLimitMs, maxBatchSize, maxRetries }
})

export const EmailConfigLive = Layer.effect(EmailConfig, EmailConfigEffect)
