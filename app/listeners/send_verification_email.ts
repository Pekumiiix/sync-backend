import mail from '@adonisjs/mail/services/main'
import env from '#start/env'
import type UserRegistered from '#events/user_registered'

export default class SendVerificationEmail {
  async handle(event: UserRegistered) {
    const { user, verificationCode } = event

    const verificationLink = `${env.get('FRONTEND_URL')}/auth/verify-email`

    await mail.send((message) => {
      message.to(user.email)
      message.from(env.get('MAIL_FROM_ADDRESS'), env.get('MAIL_FROM_NAME'))
      message.subject('Verify your email address')
      message.htmlView('emails/verify_email', {
        firstName: user.firstName,
        verifyUrl: verificationLink,
        code: verificationCode,
      })
    })
  }
}
