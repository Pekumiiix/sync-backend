import { createBookmarkValidator } from '#validators/extension'
import type { HttpContext } from '@adonisjs/core/http'
import queue from '@rlanz/bull-queue/services/main'
import ProcessBookmarkJob from '#jobs/process_bookmark_job'
import { type ApiSuccessResponse } from '#interfaces/api'
import { DateTime } from 'luxon'
import { apiError } from '#utils/response'
import redis from '@adonisjs/redis/services/main'
import { type ExtensionStatusResponse } from '#interfaces/extension'

export default class BookmarkController {
  async store(ctx: HttpContext) {
    const { response, auth, request } = ctx

    const { urls, browser } = await request.validateUsing(createBookmarkValidator)

    const user = auth.user!

    const cooldownHours = user.settings.syncFrequencyInHours

    if (cooldownHours > 0 && user.lastSyncedAt) {
      const nextSyncAllowedAt = user.lastSyncedAt.plus({ hours: cooldownHours })

      if (DateTime.now() < nextSyncAllowedAt) {
        return response.tooManyRequests(
          apiError('Sync frequency limit reached. Please try again later.')
        )
      }
    }

    const unsortedFolder = await user
      .related('ownedFolders')
      .query()
      .where('is_system', true)
      .where('name', 'Unsorted')
      .firstOrFail()

    user.lastSyncedAt = DateTime.now()

    await user.save()

    const trackerKey = `sync_tracker:${user.id}`

    await redis.hset(trackerKey, 'total', urls.length)
    await redis.hsetnx(trackerKey, 'processed', 0)
    await redis.expire(trackerKey, 60 * 60 * 24)

    for (const url of urls) {
      await queue.dispatch(ProcessBookmarkJob, {
        url,
        userId: user.id,
        folderId: unsortedFolder.id,
        browser,
      })
    }

    const formattedResponse: ApiSuccessResponse = await ctx.serialize(
      null,
      'Bookmark creation has been queued and will be processed shortly!'
    )

    return response.accepted(formattedResponse)
  }

  async status(ctx: HttpContext) {
    const { response, auth } = ctx

    const user = auth.user!

    const trackerKey = `sync_tracker:${user.id}`

    const data = await redis.hgetall(trackerKey)

    if (!data || !data.total) {
      const formattedResponse: ExtensionStatusResponse = await ctx.serialize(
        { total: 0, processed: 0, isComplete: true },
        'No sync process found.'
      )

      return response.ok(formattedResponse)
    }

    const total = Number.parseInt(data.total, 10)
    const processed = Number.parseInt(data.processed, 10)
    const isComplete = processed >= total

    if (isComplete) {
      await redis.del(trackerKey)
    }

    const formattedResponse: ExtensionStatusResponse = await ctx.serialize(
      { total, processed, isComplete },
      'Sync status retrieved successfully.'
    )

    return response.ok(formattedResponse)
  }
}
