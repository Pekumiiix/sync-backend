import { events } from '#generated/events'
import Bookmark from '#models/bookmark'
import Folder from '#models/folder'
import BookmarkTransformer from '#transformers/bookmark_transformer'
import {
  CreateBookmarkType,
  GetBookmarksQueryParams,
  UpdateBookmarkType,
} from '#validators/bookmark'
import type { GetFolderParams } from '#validators/folder'
import { Exception } from '@adonisjs/core/exceptions'
import db from '@adonisjs/lucid/services/db'
import { FolderService } from './folder_service.ts'
import User from '#models/user'

export class BookmarkService {
  static async getBookmarkById(bookmarkId: string) {
    const bookmark = await Bookmark.query()
      .where('id', bookmarkId)
      .preload('user')
      .preload('folder', (query) => query.select('id', 'name'))
      .firstOrFail()

    return bookmark
  }

  static async createBookmark(user: User, data: CreateBookmarkType) {
    const { folder, permission } = await FolderService.getFolderWithPermissions(data.folderId, user)

    if (permission.accessLevel !== 'editor') {
      throw new Exception('You do not have permission to add a bookmark to this folder.', {
        status: 403,
      })
    }

    const bookmark = await db.transaction(async (trx) => {
      const newBookmark = await folder.related('bookmarks').create(
        {
          ...data,
          userId: user.id,
          isPinned: false,
        },
        { client: trx }
      )

      return newBookmark
    })

    events.BookmarkCreated.dispatch(user, folder.id)

    return bookmark
  }

  static async deleteBookmark(bookmarkId: string, user: User) {
    const bookmark = await Bookmark.findOrFail(bookmarkId)

    const { permission } = await FolderService.getFolderWithPermissions(bookmark.folderId, user)

    if (permission.accessLevel !== 'editor') {
      throw new Exception('You do not have permission to delete this bookmark.', { status: 403 })
    }

    await db.transaction(async (trx) => {
      bookmark.useTransaction(trx)

      await bookmark.delete()
    })
  }

  static async updateBookmark(bookmarkId: string, user: User, data: UpdateBookmarkType) {
    const bookmark = await this.getBookmarkById(bookmarkId)

    const { permission } = await FolderService.getFolderWithPermissions(bookmark.folderId, user)

    if (permission.accessLevel !== 'editor') {
      throw new Exception('You do not have permission to update this bookmark.', { status: 403 })
    }

    bookmark.merge(data)

    await bookmark.save()

    return bookmark
  }

  static async setPinStatus(bookmarkId: string, user: User, isPinned: boolean) {
    const bookmark = await this.getBookmarkById(bookmarkId)

    const { permission } = await FolderService.getFolderWithPermissions(bookmark.folderId, user)

    if (permission.accessLevel !== 'editor') {
      throw new Exception('You do not have permission to update this bookmark.', { status: 403 })
    }

    bookmark.isPinned = isPinned

    await bookmark.save()

    return bookmark
  }

  static async moveBookmark(bookmarkId: string, newFolderId: string, user: User) {
    const bookmark = await this.getBookmarkById(bookmarkId)

    const oldFolderId = bookmark.folderId

    const { permission: currentPermission } = await FolderService.getFolderWithPermissions(
      oldFolderId,
      user
    )

    if (currentPermission.accessLevel !== 'editor') {
      throw new Exception('You do not have permission to move this bookmark.', { status: 403 })
    }

    const { permission: newPermission } = await FolderService.getFolderWithPermissions(
      newFolderId,
      user
    )

    if (newPermission.accessLevel !== 'editor') {
      throw new Exception(
        'You do not have permission to move a bookmark to the destination folder.',
        { status: 403 }
      )
    }

    await db.transaction(async (trx) => {
      bookmark.useTransaction(trx)

      bookmark.folderId = newFolderId

      await bookmark.save()

      await trx.from('folders').where('id', oldFolderId).decrement('bookmark_count', 1)
      await trx.from('folders').where('id', newFolderId).increment('bookmark_count', 1)
    })

    return bookmark
  }

  static async pinnedBookmarks(folder: Folder) {
    const pinnedBookmarks = await folder
      .related('bookmarks')
      .query()
      .where('is_pinned', true)
      .preload('user')
      .preload('folder')
      .orderBy('updated_at', 'desc')

    return BookmarkTransformer.transform(pinnedBookmarks)
  }

  static async getPaginatedBookmarks(folder: Folder, queryParams: GetFolderParams) {
    const {
      page = 1,
      limit = 20,
      sortByBrowser = 'all',
      sortByDate = 'newest',
      sortByTitle,
    } = queryParams

    const bookmarksQuery = folder
      .related('bookmarks')
      .query()
      .preload('user')
      .preload('folder')
      .where('is_pinned', false)

    if (sortByBrowser !== 'all') {
      bookmarksQuery.where('browser', sortByBrowser)
    }

    if (sortByTitle) {
      bookmarksQuery.orderBy('title', sortByTitle)
    } else {
      bookmarksQuery.orderBy('created_at', sortByDate === 'oldest' ? 'asc' : 'desc')
    }

    const paginatedBookmarks = await bookmarksQuery.paginate(page, limit)

    return paginatedBookmarks
  }

  static async getAllForUser(userId: string, query: GetBookmarksQueryParams) {
    const {
      page = 1,
      limit = 20,
      sortByBrowser = 'all',
      sortByDate = 'newest',
      sortByTitle,
    } = query

    const pinnedQuery = Bookmark.query()
      .whereIn('folder_id', (builder) => {
        builder.select('folder_id').from('members').where('user_id', userId)
      })
      .where('is_pinned', true)
      .preload('user')
      .preload('folder', (query) => {
        query.select('id', 'name', 'is_system')
      })
      .orderBy('updated_at', 'desc')

    const unpinnedQuery = Bookmark.query()
      .whereIn('folder_id', (builder) => {
        builder.select('folder_id').from('members').where('user_id', userId)
      })
      .where('is_pinned', false)
      .preload('user')
      .preload('folder', (query) => {
        query.select('id', 'name', 'is_system')
      })

    if (sortByBrowser !== 'all') {
      unpinnedQuery.where('browser', sortByBrowser)
    }

    if (sortByTitle) {
      unpinnedQuery.orderBy('title', sortByTitle)
    } else {
      unpinnedQuery.orderBy('created_at', sortByDate === 'oldest' ? 'asc' : 'desc')
    }

    const [pinnedBookmarks, paginatedBookmarks] = await Promise.all([
      pinnedQuery,
      unpinnedQuery.paginate(page, limit),
    ])

    return {
      pinnedBookmarks,
      paginatedBookmarks,
    }
  }
}
