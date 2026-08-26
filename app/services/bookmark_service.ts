import { events } from '#generated/events'
import Bookmark from '#models/bookmark'
import Folder from '#models/folder'
import BookmarkTransformer from '#transformers/bookmark_transformer'
import {
  type CreateBookmarkType,
  type GetBookmarksQueryParams,
  type UpdateBookmarkType,
} from '#validators/bookmark'
import { Exception } from '@adonisjs/core/exceptions'
import db from '@adonisjs/lucid/services/db'
import { FolderService } from './folder_service.ts'
import User from '#models/user'
import { MemberService } from './member_service.ts'
import { DateTime } from 'luxon'
// import mql from '@microlink/mql'
import { inject } from '@adonisjs/core'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

@inject()
export class BookmarkService {
  constructor(
    protected folderService: FolderService,
    protected memberService: MemberService
  ) {}

  private async _syncFolderStats(
    folderId: string,
    countDelta: number,
    trx: TransactionClientContract
  ) {
    const updatePayload: Record<string, any> = {
      updated_at: DateTime.now().toSQL(),
    }

    if (countDelta !== 0) {
      const operator = countDelta > 0 ? '+' : '-'
      updatePayload.bookmark_count = db.raw(`bookmark_count ${operator} ?`, [Math.abs(countDelta)])
    }

    await trx.from('folders').where('id', folderId).update(updatePayload)

    await this.folderService.syncFolderRecentImages(folderId, trx)
  }

  private async _syncBulkFolderStats(
    folderGroups: Record<string, Bookmark[]>,
    isDelete: boolean,
    trx: TransactionClientContract
  ) {
    const foldersGroupedByDelta: Record<number, string[]> = {}

    for (const [folderId, items] of Object.entries(folderGroups)) {
      const count = items.length
      if (count === 0) continue

      if (!foldersGroupedByDelta[count]) {
        foldersGroupedByDelta[count] = []
      }
      foldersGroupedByDelta[count].push(folderId)
    }

    const operator = isDelete ? '-' : '+'

    for (const [countStr, folderIds] of Object.entries(foldersGroupedByDelta)) {
      const delta = Number(countStr)

      await trx
        .from('folders')
        .whereIn('id', folderIds)
        .update({
          updated_at: DateTime.now().toSQL(),
          bookmark_count: db.raw(`bookmark_count ${operator} ?`, [delta]),
        })
    }
  }

  private _groupBookmarksByFolder(bookmarks: Bookmark[]): Record<string, Bookmark[]> {
    const groups: Record<string, Bookmark[]> = {}
    for (const bookmark of bookmarks) {
      groups[bookmark.folderId] ??= []
      groups[bookmark.folderId].push(bookmark)
    }
    return groups
  }

  async getBookmarkById(bookmarkId: string): Promise<Bookmark> {
    return await Bookmark.query()
      .where('id', bookmarkId)
      .preload('user', (query) => query.select('first_name', 'last_name', 'avatar_url'))
      .preload('folder', (query) => query.select('name'))
      .firstOrFail()
  }

  async createBookmark(user: User, data: CreateBookmarkType) {
    const { folder, permission } = await this.folderService.getFolderWithPermissions(
      data.folderId,
      user
    )

    if (permission.accessLevel !== 'editor') {
      throw new Exception('You do not have permission to add a bookmark to this folder.', {
        status: 403,
      })
    }

    const bookmarkPayload = {
      ...data,
      userId: user.id,
      isPinned: false,
    }

    const { bookmark, isNewRecord } = await db.transaction(async (trx) => {
      let newBookmark: Bookmark
      let isNew = true

      if (user.settings?.autoMergeDuplicate) {
        const existing = await Bookmark.query({ client: trx })
          .where('url', data.url)
          .andWhere('folderId', folder.id)
          .first()

        if (existing) {
          newBookmark = await existing.useTransaction(trx).merge(bookmarkPayload).save()
          isNew = false
        } else {
          newBookmark = await folder.related('bookmarks').create(bookmarkPayload, { client: trx })
        }
      } else {
        newBookmark = await folder.related('bookmarks').create(bookmarkPayload, { client: trx })
      }

      if (isNew) {
        await this._syncFolderStats(folder.id, 1, trx)
      }

      return { bookmark: newBookmark, isNewRecord: isNew }
    })

    bookmark.$setRelated('user', user)
    bookmark.$setRelated('folder', folder)

    if (isNewRecord) {
      events.BookmarkCreated.dispatch(user, folder.id)
    } else {
      events.BookmarkUpdated.dispatch(user, folder.id)
    }

    return bookmark
  }

  async deleteBookmark(bookmarkId: string, user: User) {
    const bookmark = await this.getBookmarkById(bookmarkId)

    await this.memberService.requireAccessLevel(user.id, bookmark.folderId, 'editor')

    await db.transaction(async (trx) => {
      bookmark.useTransaction(trx)

      await bookmark.delete()

      await this._syncFolderStats(bookmark.folderId, -1, trx)
    })

    events.BookmarkDeleted.dispatch(user, bookmark.folderId, bookmark.title)
  }

  async bulkDeleteBookmarks(bookmarkIds: string[], user: User) {
    if (!bookmarkIds.length) return

    const bookmarks = await Bookmark.query()
      .select('id', 'folderId', 'title')
      .whereIn('id', bookmarkIds)

    if (bookmarks.length !== bookmarkIds.length) {
      throw new Exception('One or more bookmarks not found.', { status: 404 })
    }

    const folderGroups = this._groupBookmarksByFolder(bookmarks)
    const uniqueFolderIds = Object.keys(folderGroups)

    await this.memberService.requireAccessLevelBulk(user.id, uniqueFolderIds, 'editor')

    await db.transaction(async (trx) => {
      await Bookmark.query({ client: trx }).whereIn('id', bookmarkIds).delete()

      await this._syncBulkFolderStats(folderGroups, true, trx)

      await this.folderService.syncBulkFolderRecentImages(uniqueFolderIds, trx)
    })

    for (const bookmark of bookmarks) {
      events.BookmarkDeleted.dispatch(user, bookmark.folderId, bookmark.title)
    }
  }

  async updateBookmark(bookmarkId: string, user: User, data: UpdateBookmarkType) {
    const bookmark = await this.getBookmarkById(bookmarkId)

    await this.memberService.requireAccessLevel(user.id, bookmark.folderId, 'editor')

    bookmark.merge(data)

    await bookmark.save()

    events.BookmarkUpdated.dispatch(user, bookmark.folderId)

    return bookmark
  }

  async setPinStatus(bookmarkId: string, user: User, isPinned: boolean) {
    const bookmark = await this.getBookmarkById(bookmarkId)

    await this.memberService.requireAccessLevel(user.id, bookmark.folderId, 'editor')

    bookmark.isPinned = isPinned

    await bookmark.save()

    return bookmark
  }

  async bulkUnpinBookmarks(bookmarkIds: string[], user: User) {
    if (!bookmarkIds.length) return []

    const bookmarks = await Bookmark.query().whereIn('id', bookmarkIds)

    if (bookmarks.length !== bookmarkIds.length) {
      throw new Exception('One or more bookmarks not found.', { status: 404 })
    }

    const groupedFolders = this._groupBookmarksByFolder(bookmarks)
    const uniqueFolderIds = Object.keys(groupedFolders)

    await this.memberService.requireAccessLevelBulk(user.id, uniqueFolderIds, 'editor')

    await Bookmark.query().whereIn('id', bookmarkIds).update({ isPinned: false })
  }

  async moveBookmark(bookmarkId: string, newFolderId: string, user: User) {
    const bookmark = await this.getBookmarkById(bookmarkId)
    const oldFolderId = bookmark.folderId

    if (oldFolderId === newFolderId) {
      throw new Exception('Bookmark is already in the specified folder.', { status: 400 })
    }

    await Promise.all([
      this.memberService.requireAccessLevel(user.id, oldFolderId, 'editor'),
      this.memberService.requireAccessLevel(user.id, newFolderId, 'editor'),
    ])

    await db.transaction(async (trx) => {
      bookmark.useTransaction(trx)

      bookmark.folderId = newFolderId

      await bookmark.save()

      await Promise.all([
        this._syncFolderStats(oldFolderId, -1, trx),
        this._syncFolderStats(newFolderId, 1, trx),
      ])
    })

    await bookmark.load('folder', (query) => query.select('name'))

    return bookmark
  }

  async bulkMoveBookmarks(bookmarkIds: string[], newFolderId: string, user: User) {
    if (!bookmarkIds.length) return []

    const bookmarks = await Bookmark.query().whereIn('id', bookmarkIds)

    if (bookmarks.length !== bookmarkIds.length) {
      throw new Exception('One or more bookmarks not found.', { status: 404 })
    }

    const bookmarksToMove = bookmarks.filter((b) => b.folderId !== newFolderId)

    if (!bookmarksToMove.length) return bookmarks

    const bookmarkIdsToMove = bookmarksToMove.map((b) => b.id)
    const oldFolderGroups = this._groupBookmarksByFolder(bookmarksToMove)
    const uniqueFolderIds = Object.keys(oldFolderGroups)

    await Promise.all([
      this.memberService.requireAccessLevelBulk(user.id, uniqueFolderIds, 'editor'),
      this.memberService.requireAccessLevel(user.id, newFolderId, 'editor'),
    ])

    await db.transaction(async (trx) => {
      await Bookmark.query({ client: trx })
        .whereIn('id', bookmarkIdsToMove)
        .update({ folder_id: newFolderId })

      await this._syncBulkFolderStats(oldFolderGroups, true, trx)
      await this._syncFolderStats(newFolderId, bookmarksToMove.length, trx)

      const allAffectedFolderIds = [...uniqueFolderIds, newFolderId]
      await this.folderService.syncBulkFolderRecentImages(allAffectedFolderIds, trx)
    })

    for (const bookmark of bookmarksToMove) {
      bookmark.folderId = newFolderId
    }

    return bookmarks
  }

  async pinnedBookmarks(folder: Folder, userId: string) {
    const [pinnedBookmarks, { accessLevel }] = await Promise.all([
      folder
        .related('bookmarks')
        .query()
        .where('is_pinned', true)
        .preload('user', (query) => query.select('first_name', 'last_name', 'avatar_url'))
        .preload('folder', (query) => query.select('name'))
        .orderBy('updated_at', 'desc'),

      this.memberService.checkPermissions(userId, folder.id),
    ])

    return BookmarkTransformer.transform(pinnedBookmarks, accessLevel)
  }

  async getPaginatedBookmarksForFolder(
    folder: Folder,
    queryParams: GetBookmarksQueryParams,
    userId: string
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

    const [pinnedBookmarks, bookmarks] = await Promise.all([
      this.pinnedBookmarks(folder, userId),
      bookmarksQuery.paginate(page, limit),
    ])

    return { pinnedBookmarks, bookmarks }
  }

  async getAllForUser(userId: string, query: GetBookmarksQueryParams) {
    const { page = 1, limit = 20, sort = 'title_desc', filter = 'all' } = query

    const allowedFolderIds = await this.folderService.getAccessibleFolderIds(userId)

    if (allowedFolderIds.length === 0) {
      return {
        pinnedBookmarks: [],
        paginatedBookmarks: await Bookmark.query().whereNull('id').paginate(1, limit),
      }
    }

    const baseQuery = Bookmark.query()
      .whereIn('folder_id', allowedFolderIds)
      .preload('user', (q) => q.select('first_name', 'last_name', 'avatar_url'))
      .preload('folder', (q) =>
        q
          .select('name', 'is_system')
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

  async getAllBrowserTypesForUser(userId: string) {
    const allowedFolderIds = await this.folderService.getAccessibleFolderIds(userId)

    if (allowedFolderIds.length === 0) return []

    return Bookmark.query()
      .select('browser')
      .whereIn('folder_id', allowedFolderIds)
      .whereNotNull('browser')
      .distinct('browser')
  }

  async getAllBrowserTypesForFolder(folderId: string) {
    return Bookmark.query()
      .select('browser')
      .where('folder_id', folderId)
      .whereNotNull('browser')
      .distinct('browser')
  }

  // async previewBookmark(url: string) {
  //   const parsedUrl = new URL(url)
  //   const domain = parsedUrl.hostname.replace('www.', '')

  //   let mqlResponse: any

  //   try {
  //     mqlResponse = await mql(url)
  //   } catch (error) {
  //     logger.error({ url, error }, '[BookmarkService] Network or parsing error')

  //     throw new Exception('Failed to connect to the URL preview service.', {
  //       status: 502,
  //       code: 'E_PREVIEW_SERVICE_ERROR',
  //     })
  //   }

  //   const { status, data } = mqlResponse

  //   if (status !== 'success') {
  //     throw new Exception(data?.message || 'Microlink returned an unsuccessful status.', {
  //       status: 400,
  //       code: 'E_METADATA_FETCH_FAILED',
  //     })
  //   }

  //   const openGraphData: UrlData = {
  //     title: data.title,
  //     description: data.description,
  //     coverImageUrl: data.image?.url || undefined,
  //     faviconUrl: data.logo?.url || undefined,
  //     websiteName: data.publisher || undefined,
  //     domain,
  //     url: parsedUrl.href,
  //   }

  //   return openGraphData
  // }
}
