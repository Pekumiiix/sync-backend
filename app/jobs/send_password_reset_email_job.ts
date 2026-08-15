import env from '#start/env'
import logger from '@adonisjs/core/services/logger'
import mail from '@adonisjs/mail/services/main'
import { Job } from '@rlanz/bull-queue'

interface SendPasswordResetEmailJobPayload {
  firstName: string
  email: string
  resetToken: string
}

export default class SendPasswordResetEmailJob extends Job {
  // This is the path to the file that is used to create the job
  static get $$filepath() {
    return import.meta.url
  }

  /**
   * Base Entry point
   */
  async handle(payload: SendPasswordResetEmailJobPayload) {
    const { firstName, email, resetToken } = payload

    const resetLink = `${env.get('FRONTEND_URL')}/auth/reset-password?token=${resetToken}`

    await mail.send((message) => {
      message.to(email)
      message.from(env.get('MAIL_FROM_ADDRESS'), env.get('MAIL_FROM_NAME'))
      message.subject('Reset your password')

      message.htmlView('emails/password_reset', {
        firstName: firstName,
        resetUrl: resetLink,
      })
    })
  }

  /**
   * This is an optional method that gets called when the retries has exceeded and is marked failed.
   */
  async rescue(payload: SendPasswordResetEmailJobPayload) {
    logger.error({ payload }, 'Failed to send password reset email after retries')
  }
}
