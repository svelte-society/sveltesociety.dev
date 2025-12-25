import { Config, Effect, Layer } from 'effect'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { EmailSendError } from '../schemas'
import { SesClientService } from '../services/SesClient'

/**
 * SES client layer that reads config from ConfigProvider.
 * In production, uses environment variables via default ConfigProvider.
 * In tests, provide a custom ConfigProvider via Layer.setConfigProvider.
 */
export const SesClientLive = Layer.effect(
  SesClientService,
  Effect.gen(function* () {
    const region = yield* Config.string('AWS_SES_REGION')
    const accessKeyId = yield* Config.string('AWS_SES_ACCESS_KEY')
    const secretAccessKey = yield* Config.string('AWS_SES_SECRET_KEY')

    const client = new SESClient({
      region,
      credentials: { accessKeyId, secretAccessKey }
    })

    return {
      sendEmail: (params) =>
        Effect.tryPromise({
          try: async () => {
            const command = new SendEmailCommand({
              Source: params.from,
              Destination: { ToAddresses: [...params.to] },
              Message: {
                Subject: { Data: params.subject, Charset: 'UTF-8' },
                Body: {
                  Html: { Data: params.html, Charset: 'UTF-8' },
                  Text: { Data: params.text, Charset: 'UTF-8' }
                }
              },
              ReplyToAddresses: params.replyTo ? [params.replyTo] : undefined
            })

            const response = await client.send(command)
            return response.MessageId ?? 'unknown'
          },
          catch: (error) =>
            new EmailSendError({
              message: error instanceof Error ? error.message : 'Unknown SES error'
            })
        })
    }
  })
)
