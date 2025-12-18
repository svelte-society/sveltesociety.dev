import { Effect, Layer } from 'effect'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { EmailSendError } from '../schemas'
import { EmailConfig } from '../services/EmailConfig'
import { SesClientService } from '../services/SesClient'

export const SesClientLive = Layer.effect(
  SesClientService,
  Effect.gen(function* () {
    const config = yield* EmailConfig

    const client = new SESClient({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
      }
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
