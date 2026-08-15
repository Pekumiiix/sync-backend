import type UserRegistered from '#events/user_registered'
import SendVerificationEmailJob from '#jobs/send_verification_email_job'
import queue from '@rlanz/bull-queue/services/main'

export default class SendVerificationEmail {
  async handle(event: UserRegistered) {
    await queue.dispatch(
      SendVerificationEmailJob,
      {
        email: event.user.email,
        firstName: event.user.firstName,
        verificationCode: event.verificationCode,
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
