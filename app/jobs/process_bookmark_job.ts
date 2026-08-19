import { type BrowserType } from '#enums/browser'
import User from '#models/user'
import { BookmarkService } from '#services/bookmark_service'
import MetadataExtractorService from '#services/metadata_extractor_service'
import { inject } from '@adonisjs/core'
import logger from '@adonisjs/core/services/logger'
import redis from '@adonisjs/redis/services/main'
import { Job } from '@rlanz/bull-queue'

interface ProcessBookmarkJobPayload {
  url: string
  userId: string
  folderId: string
  browser: BrowserType
}

@inject()
export default class ProcessBookmarkJob extends Job {
  constructor(
    protected metadataExtractorService: MetadataExtractorService,
    protected bookmarkService: BookmarkService
  ) {
    super()
  }

  // This is the path to the file that is used to create the job
  static get $$filepath() {
    return import.meta.url
  }

  /**
   * Base Entry point
   */
  async handle(payload: ProcessBookmarkJobPayload) {
    const { url, userId, folderId, browser } = payload

    const user = await User.find(userId)

    if (!user) {
      logger.warn(`User ${userId} not found. Discarding ProcessBookmarkJob for ${url}.`)
      return
    }

    const openGraphData = await this.metadataExtractorService.extract(url)

    await this.bookmarkService.createBookmark(user, {
      title: openGraphData.title,
      description: openGraphData.description,
      websiteName: openGraphData.websiteName,
      faviconUrl: openGraphData.faviconUrl,
      coverImageUrl: openGraphData.coverImageUrl,
      tags: [],
      folderId,
      url,
      domain: openGraphData.domain,
      browser,
    })

    await redis.hincrby(`sync_tracker:${payload.userId}`, 'processed', 1)
  }

  /**
   * This is an optional method that gets called when the retries has exceeded and is marked failed.
   */
  async rescue(payload: ProcessBookmarkJobPayload) {
    logger.error(
      {
        url: payload.url,
        payload,
      },
      '[ProcessBookmark] Job permanently failed'
    )
  }
}
