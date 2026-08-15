import env from '#start/env'
import { type ContactData } from '#validators/marketing'
import logger from '@adonisjs/core/services/logger'
import mail from '@adonisjs/mail/services/main'
import { Job } from '@rlanz/bull-queue'

type SendContactEmailJobPayload = ContactData

export default class SendContactEmailJob extends Job {
  // This is the path to the file that is used to create the job
  static get $$filepath() {
    return import.meta.url
  }

  /**
   * Base Entry point
   */
  async handle(payload: SendContactEmailJobPayload) {
    await mail.send((message) => {
      message
        .to('amaopelumi96@gmail.com')
        .from(env.get('MAIL_FROM_ADDRESS'))
        .replyTo(payload.email)
        .subject(`New Contact Inquiry from ${payload.company || payload.firstName}`)
        .htmlView('emails/contact_inquiry', { ...payload })
    })
  }

  /**
   * This is an optional method that gets called when the retries has exceeded and is marked failed.
   */
  async rescue(payload: SendContactEmailJobPayload) {
    logger.error({ payload }, 'SendContactEmailJob failed after maximum retries')
  }
}
