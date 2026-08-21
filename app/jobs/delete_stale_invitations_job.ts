import Invitation from '#models/invitation'
import logger from '@adonisjs/core/services/logger'
import { Job } from '@rlanz/bull-queue'
import { DateTime } from 'luxon'

export default class DeleteStaleInvitationsJob extends Job {
  // This is the path to the file that is used to create the job
  static get $$filepath() {
    return import.meta.url
  }

  /**
   * Base Entry point
   */
  async handle() {
    const cutoffDate = DateTime.now().minus({ days: 30 }).toSQL()
    const now = DateTime.now().toSQL()

    const deletedRows = await Invitation.query()
      .whereIn('status', ['accepted', 'declined', 'expired'])
      .andWhere('updated_at', '<', cutoffDate)
      .orWhere('expires_at', '<', now)
      .delete()

    logger.info(`[Cron] Pruned ${deletedRows} stale invitations.`)
  }

  /**
   * This is an optional method that gets called when the retries has exceeded and is marked failed.
   */
  async rescue(error: Error) {
    logger.error(
      { error: error.message, stack: error.stack },
      '[Cron] DeleteStaleInvitationsJob failed to execute.'
    )
  }
}
