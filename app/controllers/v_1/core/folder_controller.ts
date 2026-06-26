import {
  createFolderValidator,
  getFolderParamValidator,
  joinFolderValidator,
  updateFolderValidator,
} from '#validators/folder'
import type { HttpContext } from '@adonisjs/core/http'
import { apiError } from '#utils/response'
import FolderTransformer from '#transformers/folder_transformer'
import { events } from '#generated/events'
import FolderService from '#services/folder_service'
import Folder from '#models/folder'
import hash from '@adonisjs/core/services/hash'
import Member from '#models/member'
import db from '@adonisjs/lucid/services/db'
import { FolderIndexResponse, FolderStoreResponse, ShowFolderResponse } from '#interfaces/folders'
import { ApiSuccessResponse } from '#interfaces/api'

export default class FoldersController {
  async index(ctx: HttpContext) {
    const { response, auth } = ctx

    const user = auth.user!

    const ownedFolders = await user.related('ownedFolders').query().orderBy('createdAt', 'asc')

    const sharedFolders = await user.related('sharedFolders').query().orderBy('createdAt', 'asc')

    const formattedResponse: FolderIndexResponse = ctx.serialize(
      {
        systemFolders: FolderTransformer.transform(ownedFolders.filter((f) => f.isSystem)),
        ownedFolders: FolderTransformer.transform(ownedFolders.filter((f) => !f.isSystem)),
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

    const folder = await user
      .related('ownedFolders')
      .create({ name, isSystem: false, bookmarkCount: 0, recentBookmarksImages: [] })

    await events.FolderCreated.dispatch(folder, user)

    const formattedResponse: FolderStoreResponse = ctx.serialize(
      { folder: FolderTransformer.transform(folder) },
      'Folder created successfully!'
    )

    return response.created(formattedResponse)
  }

  async destroy(ctx: HttpContext) {
    const { params, response, auth } = ctx

    const folderId = params.folderId

    const user = auth.user!

    const folder = await user.related('ownedFolders').query().where('id', folderId).firstOrFail()

    if (folder.isSystem) {
      return response.badRequest(apiError('System folders cannot be deleted.'))
    }

    await folder.delete()

    const formattedResponse: ApiSuccessResponse = ctx.serialize(
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

    const { folder, permission } = await FolderService.getFolderWithPermissions(folderId, user)

    if (permission.accessLevel !== 'editor') {
      return response.forbidden(apiError('You do not have permission to update this folder.'))
    }

    folder.name = name

    await folder.save()

    const formattedResponse: FolderStoreResponse = ctx.serialize(
      { folder: FolderTransformer.transform(folder) },
      'Folder updated successfully!'
    )

    return response.ok(formattedResponse)
  }

  async show(ctx: HttpContext) {
    const { params, response, auth, request } = ctx

    const {
      page = 1,
      limit = 20,
      sortByBrowser = 'all',
      sortByDate = 'newest',
      sortByTitle,
    } = await request.validateUsing(getFolderParamValidator, { data: request.qs() })

    const folderId = params.folderId

    const user = auth.user!

    const { folder, permission } = await FolderService.getFolderWithPermissions(folderId, user)

    const members = await Member.query().where('folder_id', folder.id).preload('user').limit(3)

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
    const meta = paginatedBookmarks.getMeta()

    const formattedResponse: ShowFolderResponse = ctx.serialize(
      {
        folder: {
          id: folder.id,
          name: folder.name,
          isSystem: folder.isSystem,
          bookmarkCount: folder.bookmarkCount,
          memberCount: folder.memberCount,
        },
        permission,
        previewMembers: members.map((member) => ({
          id: member.user.id,
          firstName: member.user.firstName,
          lastName: member.user.lastName,
          avatarUrl: member.user.avatarUrl,
        })),
        pinnedBookmarks: bookmarksArray.filter((b) => b.isPinned),
        bookmarks: bookmarksArray.filter((b) => !b.isPinned),
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

    const folder = await Folder.query().where('id', folderId).firstOrFail()

    if (folder.userId === user.id) {
      return response.badRequest(
        apiError('You are the owner of this folder and already have full access.')
      )
    }

    const membership = await user
      .related('memberships')
      .query()
      .where('folderId', folder.id)
      .first()

    if (membership) {
      return response.badRequest(apiError('You are already a member of this folder.'))
    }

    if (folder.password !== null) {
      const isPasswordValid = await hash.verify(folder.password, password || '')

      if (!isPasswordValid) {
        return response.unauthorized(apiError('Invalid password provided for this folder.'))
      }
    }

    const trx = await db.transaction()

    try {
      await Member.create(
        {
          userId: user.id,
          folderId: folder.id,
          role: 'member',
          accessLevel: 'viewer',
        },
        { client: trx }
      )

      await trx.commit()
    } catch (error) {
      await trx.rollback()

      return response.internalServerError(
        apiError('An error occurred while trying to join the folder.')
      )
    }

    events.MemberJoined.dispatch(folder.id, user)

    const formattedResponse: ApiSuccessResponse = ctx.serialize(
      null,
      'Successfully joined the folder.'
    )

    return response.ok(formattedResponse)
  }
}
