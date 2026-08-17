import Invitation from '#models/invitation'
import logger from '@adonisjs/core/services/logger'
import { Job } from '@rlanz/bull-queue'
import { DateTime } from 'luxon'

interface ExpirePendingInvitationsJobPayload {}

export default class ExpirePendingInvitationsJob extends Job {
  // This is the path to the file that is used to create the job
  static get $$filepath() {
    return import.meta.url
  }

  /**
   * Base Entry point
   */
  async handle(payload: ExpirePendingInvitationsJobPayload) {
    const now = DateTime.now().toSQL()

    await Invitation.query()
      .where('status', 'pending')
      .andWhere('expires_at', '<', now)
      .update('status', 'expired')

    logger.info(`[Cron] ExpirePendingInvitationsJob executed successfully.`)
  }

  /**
   * This is an optional method that gets called when the retries has exceeded and is marked failed.
   */
  async rescue(payload: ExpirePendingInvitationsJobPayload, error: Error) {
    logger.error(
      { error: error.message, stack: error.stack },
      '[Cron] ExpirePendingInvitationJob failed to execute.'
    )
  }
}
