import { createBookmarkValidator } from '#validators/extension'
import type { HttpContext } from '@adonisjs/core/http'
import queue from '@rlanz/bull-queue/services/main'
import ProcessBookmarkJob from '#jobs/process_bookmark_job'
import { type ApiSuccessResponse } from '#interfaces/api'

export default class BookmarkController {
  async store(ctx: HttpContext) {
    const { response, auth, request } = ctx

    const { urls, browser } = await request.validateUsing(createBookmarkValidator)

    const user = auth.user!

    const unsortedFolder = await user
      .related('ownedFolders')
      .query()
      .where('is_system', true)
      .where('name', 'Unsorted')
      .firstOrFail()

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
}
