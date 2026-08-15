import env from '#start/env'
import logger from '@adonisjs/core/services/logger'
import mail from '@adonisjs/mail/services/main'
import { Job } from '@rlanz/bull-queue'

interface SendVerificationEmailJobPayload {
  email: string
  firstName: string
  verificationCode: string
}

export default class SendVerificationEmailJob extends Job {
  // This is the path to the file that is used to create the job
  static get $$filepath() {
    return import.meta.url
  }

  /**
   * Base Entry point
   */
  async handle(payload: SendVerificationEmailJobPayload) {
    const { email, firstName, verificationCode } = payload

    const verificationLink = `${env.get('FRONTEND_URL')}/auth/verify-email`

    await mail.send((message) => {
      message.to(email)
      message.from(env.get('MAIL_FROM_ADDRESS'), env.get('MAIL_FROM_NAME'))
      message.subject('Verify your email address')
      message.htmlView('emails/verify_email', {
        firstName: firstName,
        verifyUrl: verificationLink,
        code: verificationCode,
      })
    })
  }

  /**
   * This is an optional method that gets called when the retries has exceeded and is marked failed.
   */
  async rescue(payload: SendVerificationEmailJobPayload) {
    logger.error({ payload }, 'Failed to send verification email after retries')
  }
}
