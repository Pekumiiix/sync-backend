import type PasswordResetRequested from '#events/password_reset_requested'
import env from '#start/env'
import mail from '@adonisjs/mail/services/main'

export default class SendPasswordResetEmail {
  async handle(event: PasswordResetRequested) {
    const { user, resetToken } = event

    const resetLink = `${env.get('FRONTEND_URL')}/reset-password?token=${resetToken}`

    await mail.send((message) => {
      message.to(user.email)
      message.from(env.get('MAIL_FROM_ADDRESS'), env.get('MAIL_FROM_NAME'))
      message.subject('Reset your password')

      message.htmlView('emails/reset-password', {
        firstName: user.firstName,
        resetLink: resetLink,
      })
    })
  }
}
