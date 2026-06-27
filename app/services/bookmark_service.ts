import Bookmark from '#models/bookmark'
import Folder from '#models/folder'
import BookmarkTransformer from '#transformers/bookmark_transformer'
import { GetBookmarksQueryParams } from '#validators/bookmark'
import type { GetFolderParams } from '#validators/folder'

export class BookmarkService {
  static async pinnedBookmarks(folder: Folder) {
    const pinnedBookmarks = await folder
      .related('bookmarks')
      .query()
      .where('is_pinned', true)
      .preload('user')
      .orderBy('updatedAt', 'desc')

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
