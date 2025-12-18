import { Context, Effect } from 'effect'
import { EmailSendError } from '../schemas'

export class SesClientService extends Context.Tag('SesClientService')<
  SesClientService,
  {
    readonly sendEmail: (params: {
      readonly to: ReadonlyArray<string>
      readonly subject: string
      readonly html: string
      readonly text: string
      readonly from: string
      readonly replyTo?: string
    }) => Effect.Effect<string, EmailSendError>
  }
>() {}
