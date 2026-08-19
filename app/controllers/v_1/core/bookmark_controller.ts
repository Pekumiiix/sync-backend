import type { HttpContext } from '@adonisjs/core/http'
import {
  bulkDeleteBookmarkValidator,
  bulkMoveBookmarkValidator,
  bulkUnpinBookmarkValidator,
  createBookmarkValidator,
  fetchUrlDataValidator,
  getBookBrowserTypesValidator,
  getBookmarksQueryValidator,
  moveBookmarkValidator,
  updateBookmarkValidator,
} from '#validators/bookmark'
import BookmarkTransformer from '#transformers/bookmark_transformer'
import {
  type FetchBookmarkPreviewResponse,
  type GetBrowsersResponse,
  type IndexBookmarksResponse,
  type StoreBookmarkResponse,
} from '#interfaces/bookmarks'
import { type ApiSuccessResponse } from '#interfaces/api'
import { BookmarkService } from '#services/bookmark_service'
import { MemberService } from '#services/member_service'
import { inject } from '@adonisjs/core'
import MetadataExtractorService from '#services/metadata_extractor_service'

@inject()
export default class BookmarksController {
  constructor(
    protected bookmarkService: BookmarkService,
    protected memberService: MemberService,
    protected metadataExtractorService: MetadataExtractorService
  ) {}

  async index(ctx: HttpContext) {
    const { response, auth, request } = ctx

    const user = auth.user!

    const query = await request.validateUsing(getBookmarksQueryValidator, { data: request.qs() })

    const { pinnedBookmarks, paginatedBookmarks } = await this.bookmarkService.getAllForUser(
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

  async preview(ctx: HttpContext) {
    const { request, response } = ctx

    const { url } = await request.validateUsing(fetchUrlDataValidator)

    const openGraphData = await this.metadataExtractorService.extract(url)

    const formattedResponse: FetchBookmarkPreviewResponse = await ctx.serialize(
      { ...openGraphData },
      'URL data fetched successfully!'
    )

    return response.ok(formattedResponse)
  }

  async store(ctx: HttpContext) {
    const { request, response, auth } = ctx

    const data = await request.validateUsing(createBookmarkValidator)

    const user = auth.user!

    const bookmark = await this.bookmarkService.createBookmark(user, data)

    const { accessLevel } = await this.memberService.checkPermissions(user.id, bookmark.folderId)

    const formattedResponse: StoreBookmarkResponse = await ctx.serialize(
      { bookmark: BookmarkTransformer.transform(bookmark, accessLevel) },
      'Bookmark created successfully!'
    )

    return response.created(formattedResponse)
  }

  async destroy(ctx: HttpContext) {
    const { response, auth, params } = ctx

    const user = auth.user!

    const bookmarkId = params.bookmarkId

    await this.bookmarkService.deleteBookmark(bookmarkId, user)

    const formattedResponse: ApiSuccessResponse = await ctx.serialize(
      null,
      'Bookmark deleted successfully!'
    )

    return response.ok(formattedResponse)
  }

  async bulkDestroy(ctx: HttpContext) {
    const { response, auth, request } = ctx

    const user = auth.user!

    const { bookmarkIds } = await request.validateUsing(bulkDeleteBookmarkValidator)

    await this.bookmarkService.bulkDeleteBookmarks(bookmarkIds, user)

    const formattedResponse: ApiSuccessResponse = await ctx.serialize(
      null,
      'Bookmarks deleted successfully!'
    )

    return response.ok(formattedResponse)
  }

  async update(ctx: HttpContext) {
    const { response, auth, params, request } = ctx

    const data = await request.validateUsing(updateBookmarkValidator)

    const user = auth.user!

    const bookmarkId = params.bookmarkId

    const bookmark = await this.bookmarkService.updateBookmark(bookmarkId, user, data)

    const { accessLevel } = await this.memberService.checkPermissions(user.id, bookmark.folderId)

    const formattedResponse: StoreBookmarkResponse = await ctx.serialize(
      { bookmark: BookmarkTransformer.transform(bookmark, accessLevel) },
      'Bookmark updated successfully!'
    )

    return response.ok(formattedResponse)
  }

  async pin(ctx: HttpContext) {
    const { response, auth, params } = ctx

    const user = auth.user!

    const bookmarkId = params.bookmarkId

    const bookmark = await this.bookmarkService.setPinStatus(bookmarkId, user, true)

    const { accessLevel } = await this.memberService.checkPermissions(user.id, bookmark.folderId)

    const formattedResponse: StoreBookmarkResponse = await ctx.serialize(
      { bookmark: BookmarkTransformer.transform(bookmark, accessLevel) },
      'Bookmark pinned successfully!'
    )

    return response.ok(formattedResponse)
  }

  async unpin(ctx: HttpContext) {
    const { response, auth, params } = ctx

    const user = auth.user!

    const bookmarkId = params.bookmarkId

    const bookmark = await this.bookmarkService.setPinStatus(bookmarkId, user, false)

    const { accessLevel } = await this.memberService.checkPermissions(user.id, bookmark.folderId)

    const formattedResponse: StoreBookmarkResponse = await ctx.serialize(
      { bookmark: BookmarkTransformer.transform(bookmark, accessLevel) },
      'Bookmark unpinned successfully!'
    )

    return response.ok(formattedResponse)
  }

  async bulkUnpin(ctx: HttpContext) {
    const { response, auth, request } = ctx

    const user = auth.user!

    const { bookmarkIds } = await request.validateUsing(bulkUnpinBookmarkValidator)

    await this.bookmarkService.bulkUnpinBookmarks(bookmarkIds, user)

    const formattedResponse: ApiSuccessResponse = await ctx.serialize(
      null,
      'Bookmarks unpinned successfully!'
    )

    return response.ok(formattedResponse)
  }

  async move(ctx: HttpContext) {
    const { response, auth, params, request } = ctx

    const user = auth.user!

    const bookmarkId = params.bookmarkId

    const { folderId: newFolderId } = await request.validateUsing(moveBookmarkValidator)

    const bookmark = await this.bookmarkService.moveBookmark(bookmarkId, newFolderId, user)

    const { accessLevel } = await this.memberService.checkPermissions(user.id, bookmark.folderId)

    const formattedResponse: StoreBookmarkResponse = await ctx.serialize(
      { bookmark: BookmarkTransformer.transform(bookmark, accessLevel) },
      'Bookmark moved successfully!'
    )

    return response.ok(formattedResponse)
  }

  async bulkMove(ctx: HttpContext) {
    const { response, auth, request } = ctx

    const user = auth.user!

    const { bookmarkIds, folderId: newFolderId } =
      await request.validateUsing(bulkMoveBookmarkValidator)

    await this.bookmarkService.bulkMoveBookmarks(bookmarkIds, newFolderId, user)

    const formattedResponse: ApiSuccessResponse = await ctx.serialize(
      null,
      'Bookmarks moved successfully!'
    )

    return response.ok(formattedResponse)
  }

  async browsers(ctx: HttpContext) {
    const { response, auth, request } = ctx

    const user = auth.user!

    const { folderId } = await request.validateUsing(getBookBrowserTypesValidator)

    const browsers = folderId
      ? await this.bookmarkService.getAllBrowserTypesForFolder(folderId)
      : await this.bookmarkService.getAllBrowserTypesForUser(user.id)

    const formattedResponse: GetBrowsersResponse = await ctx.serialize(
      { browsers },
      'Bookmark browser types retrieved successfully!'
    )

    return response.ok(formattedResponse)
  }
}
