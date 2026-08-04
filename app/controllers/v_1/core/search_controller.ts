import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { Exception } from '@adonisjs/core/exceptions'
import { SearchService } from '#services/search_service'
import { MemberService } from '#services/member_service'
import BookmarkTransformer from '#transformers/bookmark_transformer'
import { searchQueryValidator } from '#validators/search'
import { type SearchResponse } from '#interfaces/search'

@inject()
export default class SearchController {
  constructor(
    protected searchService: SearchService,
    protected memberService: MemberService
  ) {}

  async index(ctx: HttpContext) {
    const { request, response, auth } = ctx
    const user = auth.user!

    const data = await request.validateUsing(searchQueryValidator, { data: request.qs() })

    const { bookmarks, meta } = await this.searchService.searchBookmarks(user.id, data)

    const formattedResponse: SearchResponse = await ctx.serialize(
      { bookmarks: BookmarkTransformer.transform(bookmarks), meta },
      'Search results retrieved successfully!'
    )

    return response.ok(formattedResponse)
  }

  async folderSearch(ctx: HttpContext) {
    const { request, response, params, auth } = ctx

    const user = auth.user!

    const folderId = params.folderId

    const permissions = await this.memberService.checkPermissions(user.id, folderId)

    if (!permissions.isMember) {
      throw new Exception('You do not have permission to search this folder.', { status: 403 })
    }

    const data = await request.validateUsing(searchQueryValidator, { data: request.qs() })

    const { bookmarks, meta } = await this.searchService.searchBookmarksInFolder(folderId, data)

    const formattedResponse: SearchResponse = await ctx.serialize(
      {
        bookmarks: BookmarkTransformer.transform(bookmarks, permissions.accessLevel),
        meta,
      },
      'Search results retrieved successfully!'
    )

    return response.ok(formattedResponse)
  }
}
