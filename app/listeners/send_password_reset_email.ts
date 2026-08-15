import type PasswordResetRequested from '#events/password_reset_requested'
import SendPasswordResetEmailJob from '#jobs/send_password_reset_email_job'
import queue from '@rlanz/bull-queue/services/main'

export default class SendPasswordResetEmail {
  async handle(event: PasswordResetRequested) {
    await queue.dispatch(
      SendPasswordResetEmailJob,
      {
        firstName: event.user.firstName,
        email: event.user.email,
        resetToken: event.resetToken,
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      }
    )
  }
}
