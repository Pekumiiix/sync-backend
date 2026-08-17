import Notification from '#models/notification'
import logger from '@adonisjs/core/services/logger'
import { Job } from '@rlanz/bull-queue'
import { DateTime } from 'luxon'

interface DeleteStaleNotificationsJobPayload {}

export default class DeleteStaleNotificationsJob extends Job {
  // This is the path to the file that is used to create the job
  static get $$filepath() {
    return import.meta.url
  }

  /**
   * Base Entry point
   */
  async handle(payload: DeleteStaleNotificationsJobPayload) {
    const cutoffDate = DateTime.now().minus({ days: 60 }).toSQL()

    const deletedRows = await Notification.query().where('created_at', '<', cutoffDate).delete()

    logger.info(`[Cron] Pruned ${deletedRows} stale invitations.`)
  }

  /**
   * This is an optional method that gets called when the retries has exceeded and is marked failed.
   */
  async rescue(payload: DeleteStaleNotificationsJobPayload, error: Error) {
    logger.error(
      { error: error.message, stack: error.stack },
      '[Queue] PruneOldNotificationsJob failed to execute.'
    )
  }
}
