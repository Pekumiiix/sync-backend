import mail from '@adonisjs/mail/services/main'
import env from '#start/env'
import UserRegistered from '#events/user_registered'
import logger from '@adonisjs/core/services/logger'

export default class SendVerificationEmail {
  async handle(event: UserRegistered) {
    const { user, verificationCode } = event

    const verificationLink = `${env.get('FRONTEND_URL')}/verify-email`

    try {
      await mail.send((message) => {
        message.to(user.email)
        message.from(env.get('MAIL_FROM_ADDRESS'), env.get('MAIL_FROM_NAME'))
        message.subject('Verify your email address')
        message.htmlView('emails/verify_email', {
          firstName: user.firstName,
          verificationLink,
          code: verificationCode,
        })
      })
    } catch (error) {
      logger.error('Error sending verification email:', error)
    }
  }
}
