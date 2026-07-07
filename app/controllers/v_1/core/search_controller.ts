import { type SearchResponse } from '#interfaces/search'
import { SearchService } from '#services/search_service'
import BookmarkTransformer from '#transformers/bookmark_transformer'
import { searchQueryValidator } from '#validators/search'
import type { HttpContext } from '@adonisjs/core/http'

export default class SearchController {
  async index(ctx: HttpContext) {
    const { response, auth, request } = ctx

    const data = await request.validateUsing(searchQueryValidator, { data: request.qs() })

    const user = auth.user!

    const { bookmarks, meta } = await SearchService.searchBookmarks(user.id, data)

    const formatedResponse: SearchResponse = await ctx.serialize(
      { bookmarks: BookmarkTransformer.transform(bookmarks), meta },
      'Search results retrieved successfully!'
    )

    return response.ok(formatedResponse)
  }

  async folderSearch(ctx: HttpContext) {
    const { response, request, params } = ctx

    const folderId = params.folderId

    const data = await request.validateUsing(searchQueryValidator, { data: request.qs() })

    const { bookmarks, meta } = await SearchService.searchBookmarksInFolder(folderId, data)

    const formatedResponse: SearchResponse = await ctx.serialize(
      { bookmarks: BookmarkTransformer.transform(bookmarks), meta },
      'Search results retrieved successfully!'
    )

    return response.ok(formatedResponse)
  }
}
