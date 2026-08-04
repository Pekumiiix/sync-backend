import { type BrowserType } from '#enums/browser'
import User from '#models/user'
import { BookmarkService } from '#services/bookmark_service'
import logger from '@adonisjs/core/services/logger'
import { Job } from '@rlanz/bull-queue'

interface ProcessBookmarkJobPayload {
  url: string
  userId: string
  folderId: string
  browser: BrowserType
}

export default class ProcessBookmarkJob extends Job {
  // This is the path to the file that is used to create the job
  static get $$filepath() {
    return import.meta.url
  }

  /**
   * Base Entry point
   */
  async handle(payload: ProcessBookmarkJobPayload) {
    const { url, userId, folderId, browser } = payload

    const user = await User.findOrFail(userId)

    const openGraphData = await BookmarkService.previewBookmark(url)

    await BookmarkService.createBookmark(user, {
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
