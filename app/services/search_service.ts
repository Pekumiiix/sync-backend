import Bookmark from '#models/bookmark'
import { type SearchQueryParams } from '#validators/search'
import db from '@adonisjs/lucid/services/db'

export class SearchService {
  static async searchBookmarks(userId: string, data: SearchQueryParams) {
    const { query, page = 1, limit = 10 } = data

    const bookmarks = await Bookmark.query()
      .where((searchBuilder) => {
        searchBuilder.whereILike('title', `%${query}%`)
        searchBuilder.orWhereILike('url', `%${query}%`)
        searchBuilder.orWhereRaw(
          `EXISTS (
                SELECT 1 
                FROM jsonb_array_elements_text(tags) AS tag 
                WHERE tag ILIKE ?
              )`,
          [`%${query}%`]
        )
      })
      .where((aclBuilder) => {
        aclBuilder
          .whereIn('folder_id', db.from('members').select('folder_id').where('user_id', userId))
          .orWhereIn('folder_id', db.from('folders').select('id').where('user_id', userId))
      })
      .preload('folder')
      .preload('user')
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

  static async searchBookmarksInFolder(folderId: string, data: SearchQueryParams) {
    const { query, page = 1, limit = 10 } = data

    const bookmarks = await Bookmark.query()
      .where('folder_id', folderId)
      .where((searchBuilder) => {
        searchBuilder.whereILike('title', `%${query}%`)
        searchBuilder.orWhereILike('url', `%${query}%`)
        searchBuilder.orWhereRaw(
          `EXISTS (
                SELECT 1 
                FROM jsonb_array_elements_text(tags) AS tag 
                WHERE tag ILIKE ?
              )`,
          [`%${query}%`]
        )
      })
      .preload('folder')
      .preload('user')
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
