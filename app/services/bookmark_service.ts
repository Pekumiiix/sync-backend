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
import mql from '@microlink/mql'
import { type UrlData } from '#interfaces/bookmarks'

export class BookmarkService {
  static async getBookmarkById(bookmarkId: string) {
    const bookmark = await Bookmark.query()
      .where('id', bookmarkId)
      .preload('user', (query) => query.select('first_name', 'last_name', 'avatar_url'))
      .preload('folder', (query) => query.select('name'))
      .firstOrFail()

    return bookmark
  }

  static async previewBookmark(url: string) {
    const parsedUrl = new URL(url)

    const domain = parsedUrl.hostname.replace('www.', '')

    let mqlResponse

    try {
      mqlResponse = (await mql(url)) as any
    } catch (error) {
      console.error('[BookmarkService] Network or parsing error:', error)
      throw new Error('Failed to connect to the URL preview service.')
    }

    const { status, data } = mqlResponse

    if (status !== 'success') {
      throw new Error(data?.message || 'Microlink returned an unsuccessful status.')
    }

    const openGraphData: UrlData = {
      title: data.title,
      description: data.description,
      coverImageUrl: data.image?.url || undefined,
      faviconUrl: data.logo?.url || undefined,
      websiteName: data.publisher || undefined,
      domain,
      url: parsedUrl.href,
    }

    return openGraphData
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
    const bookmark = await this.getBookmarkById(bookmarkId)

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

  static groupFolders(bookmarks: Bookmark[]): Record<string, Bookmark[]> {
    const folderGroups = bookmarks.reduce(
      (acc, bookmark) => {
        if (!acc[bookmark.folderId]) {
          acc[bookmark.folderId] = []
        }
        acc[bookmark.folderId].push(bookmark)
        return acc
      },
      {} as Record<string, typeof bookmarks>
    )

    return folderGroups
  }

  static async bulkDeleteBookmarks(bookmarkIds: string[], user: User) {
    if (!bookmarkIds.length) return

    const bookmarks = await Bookmark.query().whereIn('id', bookmarkIds)

    if (bookmarks.length !== bookmarkIds.length) {
      throw new Exception('One or more bookmarks not found.', { status: 404 })
    }

    const folderGroups = this.groupFolders(bookmarks)

    const uniqueFolderIds = Object.keys(folderGroups)

    await Promise.all(
      uniqueFolderIds.map((folderId) =>
        MemberService.requireAccessLevel(user.id, folderId, 'editor')
      )
    )

    await db.transaction(async (trx) => {
      await Bookmark.query({ client: trx }).whereIn('id', bookmarkIds).delete()

      await Promise.all(
        uniqueFolderIds.map(async (folderId) => {
          const deleteCount = folderGroups[folderId].length

          await trx.from('folders').where('id', folderId).decrement('bookmark_count', deleteCount)

          await trx
            .from('folders')
            .where('id', folderId)
            .update({ updated_at: DateTime.now().toSQL() })

          await FolderService.syncFolderRecentImages(folderId, trx)
        })
      )
    })

    for (const bookmark of bookmarks) {
      events.BookmarkDeleted.dispatch(user, bookmark.folderId, bookmark.title)
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

    const groupedFolders = this.groupFolders(bookmarks)

    const uniqueFolder = Object.keys(groupedFolders)

    await Promise.all(
      uniqueFolder.map((folderId) => MemberService.requireAccessLevel(user.id, folderId, 'editor'))
    )

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

    const oldFolderGroups = this.groupFolders(bookmarks)

    const uniqueFolderIds = Object.keys(oldFolderGroups)

    await Promise.all(
      uniqueFolderIds.map((oldFolderId) =>
        MemberService.requireAccessLevel(user.id, oldFolderId, 'editor')
      )
    )

    await MemberService.requireAccessLevel(user.id, newFolderId, 'editor')

    await db.transaction(async (trx) => {
      await Bookmark.query({ client: trx })
        .whereIn('id', bookmarkIds)
        .update({ folderId: newFolderId })

      await Promise.all(
        uniqueFolderIds.map(async (folderId) => {
          const decrementCount = oldFolderGroups[folderId].length

          await trx
            .from('folders')
            .where('id', folderId)
            .decrement('bookmark_count', decrementCount)

          await trx
            .from('folders')
            .where('id', folderId)
            .update({ updated_at: DateTime.now().toSQL() })

          await FolderService.syncFolderRecentImages(folderId, trx)
        })
      )

      const totalMovedCount = bookmarkIds.length
      await trx
        .from('folders')
        .where('id', newFolderId)
        .increment('bookmark_count', totalMovedCount)

      await trx
        .from('folders')
        .where('id', newFolderId)
        .update({ updated_at: DateTime.now().toSQL() })

      await FolderService.syncFolderRecentImages(newFolderId, trx)
    })

    for (const bookmark of bookmarks) {
      bookmark.folderId = newFolderId
    }

    return bookmarks
  }

  static async pinnedBookmarks(folder: Folder, userId: string) {
    const [pinnedBookmarks, { accessLevel }] = await Promise.all([
      folder
        .related('bookmarks')
        .query()
        .where('is_pinned', true)
        .preload('user', (query) => query.select('first_name', 'last_name', 'avatar_url'))
        .preload('folder', (query) => query.select('name'))
        .orderBy('updated_at', 'desc'),

      MemberService.checkPermissions(userId, folder.id),
    ])

    return BookmarkTransformer.transform(pinnedBookmarks, accessLevel)
  }

  static async getPaginatedBookmarksForFolder(
    folder: Folder,
    queryParams: GetBookmarksQueryParams
  ) {
    const { page = 1, limit = 20, sort = 'title_desc', filter = 'all' } = queryParams

    const bookmarksQuery = folder
      .related('bookmarks')
      .query()
      .preload('user', (query) => query.select('first_name', 'last_name', 'avatar_url'))
      .preload('folder', (query) => query.select('name'))
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
      .preload('user', (q) => q.select('first_name', 'last_name', 'avatar_url'))
      .preload('folder', (q) =>
        q
          .select('name')
          .preload('members', (memberQuery) =>
            memberQuery.select('access_level').where('user_id', userId)
          )
      )

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
