import {
  addPasswordValidator,
  createFolderValidator,
  joinFolderValidator,
  updateFolderValidator,
} from '#validators/folder'
import type { HttpContext } from '@adonisjs/core/http'
import FolderTransformer from '#transformers/folder_transformer'
import { FolderService } from '#services/folder_service'
import {
  type FolderIndexResponse,
  type FolderStoreResponse,
  type ShowFolderResponse,
} from '#interfaces/folders'
import { type ApiSuccessResponse } from '#interfaces/api'
import { BookmarkService } from '#services/bookmark_service'
import BookmarkTransformer from '#transformers/bookmark_transformer'
import { getBookmarksQueryValidator } from '#validators/bookmark'
import Folder from '#models/folder'
import { MemberService } from '#services/member_service'

export default class FoldersController {
  async index(ctx: HttpContext) {
    const { response, auth } = ctx

    const user = auth.user!

    const { systemFolders, ownedFolders, sharedFolders } = await FolderService.getFolders(user)

    const formattedResponse: FolderIndexResponse = await ctx.serialize(
      {
        systemFolders: FolderTransformer.transform(systemFolders),
        ownedFolders: FolderTransformer.transform(ownedFolders),
        sharedFolders: FolderTransformer.transform(sharedFolders), //TODO: Transform shared folders to include permission data
      },
      'Folders retrieved successfully!'
    )

    return response.ok(formattedResponse)
  }

  async store(ctx: HttpContext) {
    const { request, response, auth } = ctx

    const { name } = await request.validateUsing(createFolderValidator)

    const user = auth.user!

    const folder = await FolderService.createFolder(user, name)

    const formattedResponse: FolderStoreResponse = await ctx.serialize(
      { folder: FolderTransformer.transform(folder) },
      'Folder created successfully!'
    )

    return response.created(formattedResponse)
  }

  async destroy(ctx: HttpContext) {
    const { params, response, auth } = ctx

    const folderId = params.folderId

    const user = auth.user!

    await FolderService.deleteFolder(folderId, user)

    const formattedResponse: ApiSuccessResponse = await ctx.serialize(
      null,
      'Folder and its bookmarks deleted successfully!'
    )

    return response.ok(formattedResponse)
  }

  async update(ctx: HttpContext) {
    const { params, request, response, auth } = ctx

    const folderId = params.folderId

    const { name } = await request.validateUsing(updateFolderValidator)

    const user = auth.user!

    const folder = await FolderService.updateFolder(folderId, user, name)

    const formattedResponse: FolderStoreResponse = await ctx.serialize(
      { folder: FolderTransformer.transform(folder) },
      'Folder updated successfully!'
    )

    return response.ok(formattedResponse)
  }

  async show(ctx: HttpContext) {
    const { params, response, auth, request } = ctx

    const query = await request.validateUsing(getBookmarksQueryValidator, { data: request.qs() })

    const folderId = params.folderId

    const user = auth.user!

    const { folder, permission, previewMembers } = await FolderService.getFolderWithPermissions(
      folderId,
      user
    )

    const [pinnedBookmarks, paginatedBookmarks] = await Promise.all([
      BookmarkService.pinnedBookmarks(folder),
      BookmarkService.getPaginatedBookmarksForFolder(folder, query),
    ])

    const unpinnedBookmarks = paginatedBookmarks.all()
    const meta = paginatedBookmarks.getMeta()

    const formattedResponse: ShowFolderResponse = await ctx.serialize(
      {
        folder: {
          id: folder.id,
          name: folder.name,
          isSystem: folder.isSystem,
          bookmarkCount: folder.bookmarkCount,
          memberCount: folder.memberCount,
          isProtected: folder.password !== null,
        },
        permission,
        previewMembers,
        pinnedBookmarks,
        bookmarks: BookmarkTransformer.transform(unpinnedBookmarks),
        meta: {
          currentPage: meta.currentPage,
          totalPages: meta.lastPage,
        },
      },
      'Folder retrieved successfully!'
    )

    return response.ok(formattedResponse)
  }

  async join(ctx: HttpContext) {
    const { params, response, auth, request } = ctx

    const { password } = await request.validateUsing(joinFolderValidator)

    const folderId = params.folderId

    const user = auth.user!

    await FolderService.joinFolder(folderId, user, password)

    const formattedResponse: ApiSuccessResponse = await ctx.serialize(
      null,
      'Successfully joined the folder.'
    )

    return response.ok(formattedResponse)
  }

  async addPassword(ctx: HttpContext) {
    const { params, response, auth, request } = ctx

    const folderId = params.folderId

    const { password } = await request.validateUsing(addPasswordValidator)

    const user = auth.user!

    const folder = await Folder.findOrFail(folderId)

    await MemberService.requireRole(user.id, folderId, 'owner')

    folder.password = password

    await folder.save()

    const formattedResponse: ApiSuccessResponse = await ctx.serialize(
      null,
      'Folder password updated successfully.'
    )

    return response.ok(formattedResponse)
  }

  async removePassword(ctx: HttpContext) {
    const { params, response, auth } = ctx

    const folderId = params.folderId

    const user = auth.user!

    const folder = await Folder.findOrFail(folderId)

    await MemberService.requireRole(user.id, folderId, 'owner')

    folder.password = null

    await folder.save()

    const formattedResponse: ApiSuccessResponse = await ctx.serialize(
      null,
      'Folder password removed successfully.'
    )

    return response.ok(formattedResponse)
  }
}
