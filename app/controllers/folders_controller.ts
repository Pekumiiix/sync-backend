import {
  createFolderValidator,
  getFolderParamValidator,
  updateFolderValidator,
} from '#validators/folder'
import type { HttpContext } from '@adonisjs/core/http'
import { apiError } from '../utils/response.ts'
import FolderTransformer from '#transformers/folder_transformer'
import { events } from '#generated/events'
import FolderService from '../sevices/folder_service.ts'

export default class FoldersController {
  /**
   * @index
   * @operationId getFolders
   * @summary Retrieve all folders
   * @description Fetches all folders for the authenticated user.
   * @responseBody 200 - { "success": true, "message": "Folders retrieved successfully!", "data": "<FolderIndexData>" }
   * @responseBody 401 - <ApiErrorResponse>
   */
  async index(ctx: HttpContext) {
    const { response, auth } = ctx

    const user = auth.user!

    const ownedFolders = await user.related('ownedFolders').query().orderBy('createdAt', 'asc')

    const sharedFolders = await user.related('sharedFolders').query().orderBy('createdAt', 'asc')

    const formattedResponse = ctx.serialize(
      {
        systemFolders: FolderTransformer.transform(ownedFolders.filter((f) => f.isSystem)),
        ownedFolders: FolderTransformer.transform(ownedFolders.filter((f) => !f.isSystem)),
        sharedFolders: FolderTransformer.transform(sharedFolders), //TODO: Transform shared folders to include permission data
      },
      'Folders retrieved successfully!'
    )

    return response.ok(formattedResponse)
  }

  /**
   * @store
   * @operationId createFolder
   * @summary Create a new folder
   * @description Creates a new custom folder for the authenticated user.
   * @requestBody <createFolderValidator>
   * @responseBody 201 - { "success": true, "message": "Folder created successfully!", "data": "<FolderSingleData>" }
   * @responseBody 422 - <ApiValidationError>
   */
  async store(ctx: HttpContext) {
    const { request, response, auth } = ctx

    const { name } = await request.validateUsing(createFolderValidator)

    const user = auth.user!

    const folder = await user
      .related('ownedFolders')
      .create({ name, isSystem: false, bookmarkCount: 0, recentBookmarksImages: [] })

    await events.FolderCreated.dispatch(folder, user)

    const formattedResponse = ctx.serialize(
      { folder: FolderTransformer.transform(folder) },
      'Folder created successfully!'
    )

    return response.created(formattedResponse)
  }

  /**
   * @destroy
   * @operationId deleteFolder
   * @summary Delete a folder
   * @description Deletes a custom folder and automatically cascades to delete all bookmarks inside it. System folders cannot be deleted.
   * @responseBody 200 - <ApiSuccessMessage>
   * @responseBody 400 - <ApiErrorResponse>
   * @responseBody 404 - <ApiErrorResponse>
   */
  async destroy(ctx: HttpContext) {
    const { params, response, auth } = ctx

    const folderId = params.id

    const user = auth.user!

    const folder = await user.related('ownedFolders').query().where('id', folderId).firstOrFail()

    if (folder.isSystem) {
      return response.badRequest(apiError('System folders cannot be deleted.'))
    }

    await folder.delete()

    const formattedResponse = ctx.serialize(null, 'Folder and its bookmarks deleted successfully!')

    return response.ok(formattedResponse)
  }

  /**
   * @update
   * @operationId updateFolder
   * @summary Update a folder
   * @description Renames an existing custom folder. Users can only update folders that belong to them.
   * @paramPath id - string - Required. The UUID of the folder to update.
   * @requestBody <updateFolderValidator>
   * @responseBody 200 - { "success": true, "message": "Folder updated successfully!", "data": "<FolderSingleData>" }
   * @responseBody 403 - <ApiErrorResponse>
   * @responseBody 404 - <ApiErrorResponse>
   * @responseBody 422 - <ApiValidationError>
   */
  async update(ctx: HttpContext) {
    const { params, request, response, auth } = ctx

    const folderId = params.id

    const { name } = await request.validateUsing(updateFolderValidator)

    const user = auth.user!

    const { folder, permission } = await FolderService.getFolderWithPermissions(folderId, user)

    if (permission.accessLevel !== 'editor') {
      return response.forbidden(apiError('You do not have permission to update this folder.'))
    }

    folder.name = name

    await folder.save()

    const formattedResponse = ctx.serialize(
      { folder: FolderTransformer.transform(folder) },
      'Folder updated successfully!'
    )

    return response.ok(formattedResponse)
  }

  /**
   * @show
   * @operationId getFolder
   * @summary Retrieve a single folder
   * @description Fetches a specific folder and its paginated bookmarks. Supports filtering by browser and sorting by date or title.
   * @paramPath id - string - Required. The UUID of the folder.
   * @paramQuery page - number - Optional. The page number for pagination (default: 1).
   * @paramQuery limit - number - Optional. Items per page (default: 20).
   * @paramQuery sortByBrowser - string - Optional. Filter by browser (e.g., 'chrome', 'arc', 'all').
   * @paramQuery sortByDate - string - Optional. 'newest' or 'oldest' (default: 'newest').
   * @paramQuery sortByTitle - string - Optional. 'asc' or 'desc'.
   * @responseBody 200 - { "success": true, "message": "Folder retrieved successfully!", "data": "<FolderShowData>" }
   * @responseBody 404 - <ApiErrorResponse>
   * @responseBody 422 - <ApiValidationError>
   */
  async show(ctx: HttpContext) {
    const { params, response, auth, request } = ctx

    const {
      page = 1,
      limit = 20,
      sortByBrowser = 'all',
      sortByDate = 'newest',
      sortByTitle,
    } = await request.validateUsing(getFolderParamValidator)

    const folderId = params.id

    const user = auth.user!

    const { folder, permission } = await FolderService.getFolderWithPermissions(folderId, user)

    const bookmarksQuery = folder.related('bookmarks').query().preload('user')

    if (sortByBrowser !== 'all') {
      bookmarksQuery.where('browser', sortByBrowser)
    }

    if (sortByDate === 'oldest') {
      bookmarksQuery.orderBy('createdAt', 'asc')
    } else {
      bookmarksQuery.orderBy('createdAt', 'desc')
    }

    if (sortByTitle && sortByTitle === 'asc') {
      bookmarksQuery.orderBy('title', 'asc')
    } else if (sortByTitle === 'desc') {
      bookmarksQuery.orderBy('title', 'desc')
    }

    const paginatedBookmarks = await bookmarksQuery.paginate(page, limit)

    const bookmarksArray = paginatedBookmarks.all()

    const formattedResponse = ctx.serialize(
      {
        folder: {
          id: folder.id,
          name: folder.name,
          isSystem: folder.isSystem,
          bookmarkCount: folder.bookmarkCount,
          memberCount: folder.memberCount,
        },
        permission,
        pinnedBookmarks: bookmarksArray.filter((b) => b.isPinned),
        data: bookmarksArray.filter((b) => !b.isPinned),
        meta: {
          totalCount: folder.bookmarkCount,
          currentPage: page,
          totalPages: Math.ceil(folder.bookmarkCount / limit),
          hasNextPage: page * limit < folder.bookmarkCount,
        },
      },
      'Folder retrieved successfully!'
    )

    return response.ok(formattedResponse)
  }
}
