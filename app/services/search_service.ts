import { inject } from '@adonisjs/core'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import Bookmark from '#models/bookmark'
import { type SearchQueryParams } from '#validators/search'
import { FolderService } from './folder_service.ts'

@inject()
export class SearchService {
  constructor(protected folderService: FolderService) {}

  private _applySearchConstraints(
    builder: ModelQueryBuilderContract<typeof Bookmark>,
    searchTerm: string
  ) {
    builder.where((searchBuilder) => {
      searchBuilder
        .whereILike('title', `%${searchTerm}%`)
        .orWhereILike('url', `%${searchTerm}%`)
        .orWhereRaw('tags::text ILIKE ?', [`%${searchTerm}%`])
    })
  }

  async searchBookmarks(userId: string, data: SearchQueryParams) {
    const { query, page = 1, limit = 10 } = data

    const allowedFolderIds = await this.folderService.getAccessibleFolderIds(userId)

    if (allowedFolderIds.length === 0) {
      const emptyBookmarks = await Bookmark.query().whereNull('id').paginate(page, limit)
      return {
        bookmarks: [],
        meta: {
          currentPage: emptyBookmarks.currentPage,
          totalPages: emptyBookmarks.lastPage,
          totalCount: emptyBookmarks.total,
        },
      }
    }

    const bookmarksQuery = Bookmark.query().whereIn('folder_id', allowedFolderIds)

    this._applySearchConstraints(bookmarksQuery, query)

    const bookmarks = await bookmarksQuery
      .preload('folder', (q) => q.select('name'))
      .preload('user', (q) => q.select('first_name', 'last_name', 'avatar_url'))
      .paginate(page, limit)

    const meta = bookmarks.getMeta()

    return {
      bookmarks: bookmarks.all(),
      meta: {
        currentPage: meta.currentPage,
        totalPages: meta.lastPage,
        totalCount: meta.total,
      },
    }
  }

  async searchBookmarksInFolder(folderId: string, data: SearchQueryParams) {
    const { query, page = 1, limit = 10 } = data

    const bookmarksQuery = Bookmark.query().where('folder_id', folderId)

    this._applySearchConstraints(bookmarksQuery, query)

    const bookmarks = await bookmarksQuery
      .preload('folder', (q) => q.select('name'))
      .preload('user', (q) => q.select('first_name', 'last_name', 'avatar_url'))
      .paginate(page, limit)
    const meta = bookmarks.getMeta()

    return {
      bookmarks: bookmarks.all(),
      meta: {
        currentPage: meta.currentPage,
        totalPages: meta.lastPage,
        totalCount: meta.total,
      },
    }
  }
}
