import app from '@adonisjs/core/services/app'
import queue from '@rlanz/bull-queue/services/main'
import DeleteStaleInvitationsJob from '#jobs/delete_stale_invitations_job'

app.ready(async () => {
  await queue.dispatch(
    DeleteStaleInvitationsJob,
    {},
    {
      jobId: 'delete-stale-invitations-cron',
      repeat: {
        pattern: '0 0 * * *',
      },
    }
  )
})
