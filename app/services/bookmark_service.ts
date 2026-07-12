import { events } from '#generated/events'
import Bookmark from '#models/bookmark'
import type Folder from '#models/folder'
import BookmarkTransformer from '#transformers/bookmark_transformer'
import {
  type CreateBookmarkType,
  type GetBookmarksQueryParams,
  type UpdateBookmarkType,
} from '#validators/bookmark'
import { Exception } from '@adonisjs/core/exceptions'
import db from '@adonisjs/lucid/services/db'
import { FolderService } from './folder_service.ts'
import type User from '#models/user'
import { MemberService } from './member_service.ts'
import { DateTime } from 'luxon'

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

      await trx
        .from('folders')
        .where('id', folder.id)
        .update({ updated_at: DateTime.now().toSQL() })

      return newBookmark
    })

    bookmark.$setRelated('user', user)
    bookmark.$setRelated('folder', folder)

    events.BookmarkCreated.dispatch(user, folder.id)

    return bookmark
  }

  static async deleteBookmark(bookmarkId: string, user: User) {
    const bookmark = await Bookmark.findOrFail(bookmarkId)

    await MemberService.requireAccessLevel(user.id, bookmark.folderId, 'editor')

    await db.transaction(async (trx) => {
      bookmark.useTransaction(trx)

      await bookmark.delete()

      await trx
        .from('folders')
        .where('id', bookmark.folderId)
        .update({ updated_at: DateTime.now().toSQL() })
    })

    events.BookmarkDeleted.dispatch(user, bookmark.folderId, bookmark.title)
  }

  static async bulkDeleteBookmarks(bookmarkIds: string[], user: User) {
    if (!bookmarkIds.length) return []

    const bookmarks = await Bookmark.query().whereIn('id', bookmarkIds)

    if (bookmarks.length !== bookmarkIds.length) {
      throw new Exception('One or more bookmarks not found.', { status: 404 })
    }

    const folderId = bookmarks[0].folderId

    const allFromSameFolder = bookmarks.every((b) => b.folderId === folderId)

    if (!allFromSameFolder) {
      throw new Exception('All bookmarks must originate from the same folder.', { status: 400 })
    }

    await MemberService.requireAccessLevel(user.id, folderId, 'editor')

    await db.transaction(async (trx) => {
      await Bookmark.query({ client: trx }).whereIn('id', bookmarkIds).delete()

      const moveCount = bookmarkIds.length

      await trx.from('folders').where('id', folderId).decrement('bookmark_count', moveCount)
      await trx.from('folders').where('id', folderId).update({ updated_at: DateTime.now().toSQL() })

      await FolderService.syncFolderRecentImages(folderId, trx)
    })

    for (const bookmark of bookmarks) {
      events.BookmarkDeleted.dispatch(user, folderId, bookmark.title)
    }
  }

  static async updateBookmark(bookmarkId: string, user: User, data: UpdateBookmarkType) {
    const bookmark = await this.getBookmarkById(bookmarkId)

    await MemberService.requireAccessLevel(user.id, bookmark.folderId, 'editor')

    bookmark.merge(data)

    await bookmark.save()

    events.BookmarkUpdated.dispatch(user, bookmark.folderId)

    return bookmark
  }

  static async setPinStatus(bookmarkId: string, user: User, isPinned: boolean) {
    const bookmark = await this.getBookmarkById(bookmarkId)

    await MemberService.requireAccessLevel(user.id, bookmark.folderId, 'editor')

    bookmark.isPinned = isPinned

    await bookmark.save()

    return bookmark
  }

  static async bulkUnpinBookmarks(bookmarkIds: string[], user: User) {
    if (!bookmarkIds.length) return []

    const bookmarks = await Bookmark.query().whereIn('id', bookmarkIds)

    if (bookmarks.length !== bookmarkIds.length) {
      throw new Exception('One or more bookmarks not found.', { status: 404 })
    }

    const folderId = bookmarks[0].folderId

    const allFromSameFolder = bookmarks.every((b) => b.folderId === folderId)

    if (!allFromSameFolder) {
      throw new Exception('All bookmarks must originate from the same folder.', { status: 400 })
    }

    await MemberService.requireAccessLevel(user.id, folderId, 'editor')

    await db.transaction(async (trx) => {
      await Bookmark.query({ client: trx }).whereIn('id', bookmarkIds).update({ isPinned: false })
    })
  }

  static async moveBookmark(bookmarkId: string, newFolderId: string, user: User) {
    const bookmark = await this.getBookmarkById(bookmarkId)

    const oldFolderId = bookmark.folderId

    if (oldFolderId === newFolderId) {
      throw new Exception('Bookmark is already in the specified folder.', { status: 400 })
    }

    await MemberService.requireAccessLevel(user.id, oldFolderId, 'editor')

    await MemberService.requireAccessLevel(user.id, newFolderId, 'editor')

    await db.transaction(async (trx) => {
      bookmark.useTransaction(trx)

      bookmark.folderId = newFolderId

      await bookmark.save()

      await trx.from('folders').where('id', oldFolderId).decrement('bookmark_count', 1)
      await trx
        .from('folders')
        .where('id', oldFolderId)
        .update({ updated_at: DateTime.now().toSQL() })
      await trx.from('folders').where('id', newFolderId).increment('bookmark_count', 1)
      await trx
        .from('folders')
        .where('id', newFolderId)
        .update({ updated_at: DateTime.now().toSQL() })

      await FolderService.syncFolderRecentImages(oldFolderId, trx)
      await FolderService.syncFolderRecentImages(newFolderId, trx)
    })

    await bookmark.load('folder')

    return bookmark
  }

  static async bulkMoveBookmarks(bookmarkIds: string[], newFolderId: string, user: User) {
    if (!bookmarkIds.length) return []

    const bookmarks = await Bookmark.query().whereIn('id', bookmarkIds)

    if (bookmarks.length !== bookmarkIds.length) {
      throw new Exception('One or more bookmarks not found.', { status: 404 })
    }

    const oldFolderId = bookmarks[0].folderId

    const allFromSameFolder = bookmarks.every((b) => b.folderId === oldFolderId)

    if (!allFromSameFolder) {
      throw new Exception('All bookmarks must originate from the same folder.', { status: 400 })
    }

    if (oldFolderId === newFolderId) {
      return bookmarks
    }

    await MemberService.requireAccessLevel(user.id, oldFolderId, 'editor')
    await MemberService.requireAccessLevel(user.id, newFolderId, 'editor')

    await db.transaction(async (trx) => {
      await Bookmark.query({ client: trx })
        .whereIn('id', bookmarkIds)
        .update({ folderId: newFolderId })

      const moveCount = bookmarkIds.length

      await trx.from('folders').where('id', oldFolderId).decrement('bookmark_count', moveCount)
      await trx
        .from('folders')
        .where('id', oldFolderId)
        .update({ updated_at: DateTime.now().toSQL() })
      await trx.from('folders').where('id', newFolderId).increment('bookmark_count', moveCount)
      await trx
        .from('folders')
        .where('id', newFolderId)
        .update({ updated_at: DateTime.now().toSQL() })

      await FolderService.syncFolderRecentImages(oldFolderId, trx)
      await FolderService.syncFolderRecentImages(newFolderId, trx)
    })

    await bookmarks[0].load('folder')

    return bookmarks
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

  static async getPaginatedBookmarksForFolder(
    folder: Folder,
    queryParams: GetBookmarksQueryParams
  ) {
    const { page = 1, limit = 20, sort = 'title_desc', filter = 'all' } = queryParams

    const bookmarksQuery = folder
      .related('bookmarks')
      .query()
      .preload('user')
      .preload('folder')
      .where('is_pinned', false)

    if (filter !== 'all') {
      bookmarksQuery.where('browser', filter)
    }

    if (sort === 'title_asc') {
      bookmarksQuery.orderBy('title', 'asc')
    } else if (sort === 'title_desc') {
      bookmarksQuery.orderBy('title', 'desc')
    } else if (sort === 'oldest' || sort === 'newest') {
      bookmarksQuery.orderBy('created_at', sort === 'oldest' ? 'asc' : 'desc')
    }

    const paginatedBookmarks = await bookmarksQuery.paginate(page, limit)

    return paginatedBookmarks
  }

  static async getAllForUser(userId: string, query: GetBookmarksQueryParams) {
    const { page = 1, limit = 20, sort = 'title_desc', filter = 'all' } = query

    const baseQuery = Bookmark.query()
      .where((builder) => {
        builder.whereIn(
          'folder_id',
          db.from('members').select('folder_id').where('user_id', userId)
        )
        builder.orWhereIn('folder_id', db.from('folders').select('id').where('user_id', userId))
      })
      .preload('user')
      .preload('folder', (q) => q.select('id', 'name'))

    if (filter !== 'all') {
      baseQuery.where('browser', filter)
    }

    const pinnedQuery = baseQuery.clone().where('is_pinned', true).orderBy('updated_at', 'desc')

    const unpinnedQuery = baseQuery.clone().where('is_pinned', false)

    if (sort === 'title_asc') {
      unpinnedQuery.orderBy('title', 'asc')
    } else if (sort === 'title_desc') {
      unpinnedQuery.orderBy('title', 'desc')
    } else if (sort === 'oldest' || sort === 'newest') {
      unpinnedQuery.orderBy('created_at', sort === 'oldest' ? 'asc' : 'desc')
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

  static async getAllBrowserTypesForUser(userId: string) {
    const browserTypes = await Bookmark.query()
      .select('browser')
      .where((query) => {
        query.whereIn('folderId', db.from('members').select('folder_id').where('user_id', userId))
        query.orWhereIn('folderId', db.from('folders').select('id').where('user_id', userId))
      })
      .whereNotNull('browser')
      .distinct('browser')

    return browserTypes
  }

  static async getAllBrowserTypesForFolder(folderId: string) {
    const browserTypes = await Bookmark.query()
      .select('browser')
      .where('folderId', folderId)
      .whereNotNull('browser')
      .distinct('browser')

    return browserTypes
  }
}
