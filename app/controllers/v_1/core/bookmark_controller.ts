import Bookmark from '#models/bookmark'
import type { HttpContext } from '@adonisjs/core/http'
import FolderService from '#services/folder_service'
import { apiError } from '#utils/response'
import {
  createBookmarkValidator,
  fetchUrlDataValidator,
  updateBookmarkValidator,
} from '#validators/bookmark'
import mql from '@microlink/mql'
import BookmarkTransformer from '#transformers/bookmark_transformer'
import { events } from '#generated/events'
import { StoreBookmarkResponse } from '#interfaces/bookmarks'
import { ApiSuccessResponse } from '#interfaces/api'

export default class BookmarksController {
  /**
   * @fetch
   * @operationId fetchUrlData
   * @summary Fetch URL data
   * @description Scrapes OpenGraph data from a provided URL.
   * @requestBody <fetchUrlDataValidator>
   * @responseBody 200 - { "success": true, "message": "URL data fetched successfully!", "data": { "openGraphData": "<UrlData>" } }
   * @responseBody 400 - <ApiErrorResponse>
   * @responseBody 401 - <ApiErrorResponse>
   * @responseBody 403 - <ApiErrorResponse>
   */
  async fetch(ctx: HttpContext) {
    const { request, response } = ctx

    const { url } = await request.validateUsing(fetchUrlDataValidator)

    const parsedUrl = new URL(url)

    const domain = parsedUrl.hostname.replace('www.', '')

    let openGraphData = {}

    try {
      const { status, data } = (await mql(url)) as any

      if (status === 'success') {
        openGraphData = {
          title: data.title,
          description: data.description,
          coverImageUrl: data.image?.url || null,
          faviconUrl: data.logo?.url || null,
          websiteName: data.publisher || null,
          domain,
          url: parsedUrl.href,
        }

        const formattedResponse = ctx.serialize({ openGraphData }, 'URL data fetched successfully!')

        return response.ok(formattedResponse)
      } else {
        return response.badRequest(apiError('Failed to fetch URL data.'))
      }
    } catch (error) {
      return response.badRequest(apiError('Failed to fetch URL data.'))
    }
  }

  async store(ctx: HttpContext) {
    const { request, response, auth } = ctx

    const {
      folderId,
      title,
      description,
      websiteName,
      url,
      domain,
      faviconUrl,
      coverImageUrl,
      tags,
      browser,
    } = await request.validateUsing(createBookmarkValidator)

    const user = auth.user!

    const { permission } = await FolderService.getFolderWithPermissions(folderId, user)

    if (permission.accessLevel !== 'editor') {
      return response.forbidden(
        apiError('You do not have permission to add a bookmark to this folder.')
      )
    }

    const bookmark = await Bookmark.create({
      folderId,
      userId: user.id,
      title,
      description: description || null,
      websiteName: websiteName || null,
      url,
      domain,
      faviconUrl: faviconUrl || null,
      coverImageUrl: coverImageUrl || null,
      tags: tags || [],
      isPinned: false,
      browser,
    })

    events.BookmarkCreated.dispatch(user, folderId)

    const formattedResponse: StoreBookmarkResponse = ctx.serialize(
      { bookmark: BookmarkTransformer.transform(bookmark) },
      'Bookmark created successfully!'
    )

    return response.created(formattedResponse)
  }

  async destroy(ctx: HttpContext) {
    const { response, auth, params } = ctx

    const user = auth.user!

    const bookmarkId = params.bookmarkId

    const bookmark = await Bookmark.query().where('id', bookmarkId).firstOrFail()

    const { permission } = await FolderService.getFolderWithPermissions(bookmark.folderId, user)

    if (permission.accessLevel !== 'editor') {
      return response.forbidden(apiError('You do not have permission to delete this bookmark.'))
    }

    await bookmark.delete()

    const formattedResponse: ApiSuccessResponse = ctx.serialize(
      null,
      'Bookmark deleted successfully!'
    )

    return response.ok(formattedResponse)
  }

  async update(ctx: HttpContext) {
    const { response, auth, params, request } = ctx

    const { title, description, tags } = await request.validateUsing(updateBookmarkValidator)

    const user = auth.user!

    const bookmarkId = params.bookmarkId

    const bookmark = await Bookmark.query().where('id', bookmarkId).firstOrFail()

    const { permission } = await FolderService.getFolderWithPermissions(bookmark.folderId, user)

    if (permission.accessLevel !== 'editor') {
      return response.forbidden(apiError('You do not have permission to update this bookmark.'))
    }

    bookmark.merge({
      title: title || bookmark.title,
      description: description || bookmark.description,
      tags: tags || bookmark.tags,
    })

    await bookmark.save()

    const formattedResponse: StoreBookmarkResponse = ctx.serialize(
      { bookmark: BookmarkTransformer.transform(bookmark) },
      'Bookmark updated successfully!'
    )

    return response.ok(formattedResponse)
  }

  async pin(ctx: HttpContext) {
    const { response, auth, params } = ctx

    const user = auth.user!

    const bookmarkId = params.bookmarkId

    const bookmark = await Bookmark.query().where('id', bookmarkId).firstOrFail()

    const { permission } = await FolderService.getFolderWithPermissions(bookmark.folderId, user)

    if (permission.accessLevel !== 'editor') {
      return response.forbidden(apiError('You do not have permission to update this bookmark.'))
    }

    bookmark.isPinned = true

    await bookmark.save()

    const formattedResponse: StoreBookmarkResponse = ctx.serialize(
      { bookmark: BookmarkTransformer.transform(bookmark) },
      'Bookmark pinned successfully!'
    )

    return response.ok(formattedResponse)
  }

  async unpin(ctx: HttpContext) {
    const { response, auth, params } = ctx

    const user = auth.user!

    const bookmarkId = params.bookmarkId

    const bookmark = await Bookmark.query().where('id', bookmarkId).firstOrFail()

    const { permission } = await FolderService.getFolderWithPermissions(bookmark.folderId, user)

    if (permission.accessLevel !== 'editor') {
      return response.forbidden(apiError('You do not have permission to update this bookmark.'))
    }

    bookmark.isPinned = false

    await bookmark.save()

    const formattedResponse: StoreBookmarkResponse = ctx.serialize(
      { bookmark: BookmarkTransformer.transform(bookmark) },
      'Bookmark unpinned successfully!'
    )

    return response.ok(formattedResponse)
  }
}
