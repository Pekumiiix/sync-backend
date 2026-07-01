import type { HttpContext } from '@adonisjs/core/http'
import {
  createBookmarkValidator,
  fetchUrlDataValidator,
  getBookmarksQueryValidator,
  moveBookmarkValidator,
  updateBookmarkValidator,
} from '#validators/bookmark'
import mql from '@microlink/mql'
import BookmarkTransformer from '#transformers/bookmark_transformer'
import {
  type FetchBookmarkPreviewResponse,
  type GetBrowsersResponse,
  type IndexBookmarksResponse,
  type StoreBookmarkResponse,
} from '#interfaces/bookmarks'
import { type ApiSuccessResponse } from '#interfaces/api'
import { BookmarkService } from '#services/bookmark_service'
import { Exception } from '@adonisjs/core/exceptions'

export default class BookmarksController {
  async index(ctx: HttpContext) {
    const { response, auth, request } = ctx

    const user = auth.user!

    const query = await request.validateUsing(getBookmarksQueryValidator, { data: request.qs() })

    const { pinnedBookmarks, paginatedBookmarks } = await BookmarkService.getAllForUser(
      user.id,
      query
    )

    const meta = paginatedBookmarks.getMeta()

    const formattedResponse: IndexBookmarksResponse = await ctx.serialize(
      {
        bookmarks: BookmarkTransformer.transform(paginatedBookmarks.all()),
        pinnedBookmarks: BookmarkTransformer.transform(pinnedBookmarks),
        meta: {
          currentPage: meta.currentPage,
          totalPages: meta.lastPage,
          totalCount: meta.total,
        },
      },
      'Bookmarks retrieved successfully!'
    )

    return response.ok(formattedResponse)
  }

  async fetch(ctx: HttpContext) {
    const { request, response } = ctx

    const { url } = await request.validateUsing(fetchUrlDataValidator)

    const parsedUrl = new URL(url)

    const domain = parsedUrl.hostname.replace('www.', '')

    let openGraphData = {}

    try {
      const { status, data } = (await mql(url)) as any

      if (status !== 'success') {
        throw new Exception('Failed to fetch URL data from Microlink.', { status: 400 })
      }

      openGraphData = {
        title: data.title,
        description: data.description,
        coverImageUrl: data.image?.url || null,
        faviconUrl: data.logo?.url || null,
        websiteName: data.publisher || null,
        domain,
        url: parsedUrl.href,
      }

      const formattedResponse: FetchBookmarkPreviewResponse = await ctx.serialize(
        { openGraphData },
        'URL data fetched successfully!'
      )

      return response.ok(formattedResponse)
    } catch (error) {
      throw new Exception('Failed to parse the provided URL.', { status: 400 })
    }
  }

  async store(ctx: HttpContext) {
    const { request, response, auth } = ctx

    const data = await request.validateUsing(createBookmarkValidator)

    const user = auth.user!

    const bookmark = await BookmarkService.createBookmark(user, data)

    const formattedResponse: StoreBookmarkResponse = await ctx.serialize(
      { bookmark: BookmarkTransformer.transform(bookmark) },
      'Bookmark created successfully!'
    )

    return response.created(formattedResponse)
  }

  async destroy(ctx: HttpContext) {
    const { response, auth, params } = ctx

    const user = auth.user!

    const bookmarkId = params.bookmarkId

    await BookmarkService.deleteBookmark(bookmarkId, user)

    const formattedResponse: ApiSuccessResponse = await ctx.serialize(
      null,
      'Bookmark deleted successfully!'
    )

    return response.ok(formattedResponse)
  }

  async update(ctx: HttpContext) {
    const { response, auth, params, request } = ctx

    const data = await request.validateUsing(updateBookmarkValidator)

    const user = auth.user!

    const bookmarkId = params.bookmarkId

    const bookmark = await BookmarkService.updateBookmark(bookmarkId, user, data)

    const formattedResponse: StoreBookmarkResponse = await ctx.serialize(
      { bookmark: BookmarkTransformer.transform(bookmark) },
      'Bookmark updated successfully!'
    )

    return response.ok(formattedResponse)
  }

  async pin(ctx: HttpContext) {
    const { response, auth, params } = ctx

    const user = auth.user!

    const bookmarkId = params.bookmarkId

    const bookmark = await BookmarkService.setPinStatus(bookmarkId, user, true)

    const formattedResponse: StoreBookmarkResponse = await ctx.serialize(
      { bookmark: BookmarkTransformer.transform(bookmark) },
      'Bookmark pinned successfully!'
    )

    return response.ok(formattedResponse)
  }

  async unpin(ctx: HttpContext) {
    const { response, auth, params } = ctx

    const user = auth.user!

    const bookmarkId = params.bookmarkId

    const bookmark = await BookmarkService.setPinStatus(bookmarkId, user, false)

    const formattedResponse: StoreBookmarkResponse = await ctx.serialize(
      { bookmark: BookmarkTransformer.transform(bookmark) },
      'Bookmark unpinned successfully!'
    )

    return response.ok(formattedResponse)
  }

  async move(ctx: HttpContext) {
    const { response, auth, params, request } = ctx

    const user = auth.user!

    const bookmarkId = params.bookmarkId

    const { folderId: newFolderId } = await request.validateUsing(moveBookmarkValidator)

    const bookmark = await BookmarkService.moveBookmark(bookmarkId, newFolderId, user)

    const formattedResponse: StoreBookmarkResponse = await ctx.serialize(
      { bookmark: BookmarkTransformer.transform(bookmark) },
      'Bookmark moved successfully!'
    )

    return response.ok(formattedResponse)
  }

  async browsers(ctx: HttpContext) {
    const { response, auth, request } = ctx

    const user = auth.user!

    const folderId = request.input('folderId')

    let browsers = []

    if (!folderId) {
      browsers = await BookmarkService.getAllBrowserTypesForUser(user.id)
    } else {
      browsers = await BookmarkService.getAllBrowserTypesForFolder(folderId)
    }

    const formattedResponse: GetBrowsersResponse = await ctx.serialize(
      { browsers },
      'Bookmark browser types retrieved successfully!'
    )

    return response.ok(formattedResponse)
  }
}
