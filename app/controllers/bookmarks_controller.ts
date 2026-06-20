import Bookmark from '#models/bookmark'
import type { HttpContext } from '@adonisjs/core/http'
import FolderService from '../sevices/folder_service.ts'
import { apiError } from '../utils/response.ts'
// import { createBookmarkValidator } from '#validators/bookmark'

export default class BookmarksController {
  /**
   * @destroy
   * @operationId deleteBookmark
   * @summary Delete a bookmark
   * @description Deletes a bookmark from a folder. The user must have 'editor' access level in the parent folder to perform this action.
   * @responseBody 200 - <ApiSuccessMessage>
   * @responseBody 403 - <ApiErrorResponse>
   * @responseBody 404 - <ApiErrorResponse>
   */
  async destroy(ctx: HttpContext) {
    const { response, auth, params } = ctx

    const user = auth.user!

    const bookmarkId = params.id

    const bookmark = await Bookmark.query().where('id', bookmarkId).firstOrFail()

    const { permission } = await FolderService.getFolderWithPermissions(bookmark.folderId, user)

    if (permission.accessLevel !== 'editor') {
      return response.forbidden(apiError('You do not have permission to delete this bookmark.'))
    }

    await bookmark.delete()

    const formattedResponse = ctx.serialize(null, 'Bookmark deleted successfully!')

    return response.ok(formattedResponse)
  }
}
