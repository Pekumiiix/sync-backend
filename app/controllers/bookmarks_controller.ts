import Bookmark from '#models/bookmark'
import type { HttpContext } from '@adonisjs/core/http'
import FolderService from '../sevices/folder_service.ts'
import { apiError } from '../utils/response.ts'
import {
  createBookmarkValidator,
  fetchUrlDataValidator,
  updateBookmarkValidator,
} from '#validators/bookmark'
import mql from '@microlink/mql'
import BookmarkTransformer from '#transformers/bookmark_transformer'

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

  /**
   * @store
   * @operationId createBookmark
   * @summary Create a new bookmark
   * @description Saves a manually edited or pre-scraped bookmark to a specified folder. The authenticated user must have 'editor' access level in the parent folder.
   * @requestBody <createBookmarkValidator>
   * @responseBody 201 - { "success": true, "message": "Bookmark created successfully!", "data": { "bookmark": "<BookmarkResponse>" } }
   * @responseBody 403 - <ApiErrorResponse>
   * @responseBody 422 - <ApiValidationError>
   */
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

    const formattedResponse = ctx.serialize(
      { bookmark: BookmarkTransformer.transform(bookmark) },
      'Bookmark created successfully!'
    )

    return response.created(formattedResponse)
  }

  /**
   * @destroy
   * @operationId deleteBookmark
   * @summary Delete a bookmark
   * @description Deletes a bookmark from a folder. The user must have 'editor' access level in the parent folder to perform this action.
   * @responseBody 200 - <ApiSuccessMessage>
   * @responseBody 403 - <ApiErrorResponse>
   * @responseBody 404 - <ApiErrorResponse>
   */
  async destroy(ctx: HttpContext) {
    const { response, auth, params } = ctx

    const user = auth.user!

    const bookmarkId = params.id

    const bookmark = await Bookmark.query().where('id', bookmarkId).firstOrFail()

    const { permission } = await FolderService.getFolderWithPermissions(bookmark.folderId, user)

    if (permission.accessLevel !== 'editor') {
      return response.forbidden(apiError('You do not have permission to delete this bookmark.'))
    }

    await bookmark.delete()

    const formattedResponse = ctx.serialize(null, 'Bookmark deleted successfully!')

    return response.ok(formattedResponse)
  }

  /**
   * @update
   * @operationId updateBookmark
   * @summary Update a bookmark
   * @description Updates the title, description, or tags of an existing bookmark. The authenticated user must have 'editor' access level in the parent folder.
   * @paramPath id - string - Required. The UUID of the bookmark to update.
   * @requestBody <updateBookmarkValidator>
   * @responseBody 200 - { "success": true, "message": "Bookmark updated successfully!", "data": { "bookmark": "<BookmarkResponse>" } }
   * @responseBody 401 - <ApiErrorResponse>
   * @responseBody 403 - <ApiErrorResponse>
   * @responseBody 404 - <ApiErrorResponse>
   * @responseBody 422 - <ApiValidationError>
   */
  async update(ctx: HttpContext) {
    const { response, auth, params, request } = ctx

    const { title, description, tags } = await request.validateUsing(updateBookmarkValidator)

    const user = auth.user!

    const bookmarkId = params.id

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

    const formattedResponse = ctx.serialize(
      { bookmark: BookmarkTransformer.transform(bookmark) },
      'Bookmark updated successfully!'
    )

    return response.ok(formattedResponse)
  }

  /**
   * @pin
   * @operationId pinBookmark
   * @summary Pin a bookmark
   * @description Pins a bookmark so it appears at the top of the folder. The authenticated user must have 'editor' access level in the parent folder.
   * @paramPath id - string - Required. The UUID of the bookmark to pin.
   * @responseBody 200 - { "success": true, "message": "Bookmark pinned successfully!", "data": { "bookmark": "<BookmarkResponse>" } }
   * @responseBody 401 - <ApiErrorResponse>
   * @responseBody 403 - <ApiErrorResponse>
   * @responseBody 404 - <ApiErrorResponse>
   */
  async pin(ctx: HttpContext) {
    const { response, auth, params } = ctx

    const user = auth.user!

    const bookmarkId = params.id

    const bookmark = await Bookmark.query().where('id', bookmarkId).firstOrFail()

    const { permission } = await FolderService.getFolderWithPermissions(bookmark.folderId, user)

    if (permission.accessLevel !== 'editor') {
      return response.forbidden(apiError('You do not have permission to update this bookmark.'))
    }

    bookmark.isPinned = true

    await bookmark.save()

    const formattedResponse = ctx.serialize(
      { bookmark: BookmarkTransformer.transform(bookmark) },
      'Bookmark pinned successfully!'
    )

    return response.ok(formattedResponse)
  }

  /**
   * @unpin
   * @operationId unpinBookmark
   * @summary Unpin a bookmark
   * @description Removes the pinned status from a bookmark. The authenticated user must have 'editor' access level in the parent folder.
   * @paramPath id - string - Required. The UUID of the bookmark to unpin.
   * @responseBody 200 - { "success": true, "message": "Bookmark unpinned successfully!", "data": { "bookmark": "<BookmarkResponse>" } }
   * @responseBody 401 - <ApiErrorResponse>
   * @responseBody 403 - <ApiErrorResponse>
   * @responseBody 404 - <ApiErrorResponse>
   */
  async unpin(ctx: HttpContext) {
    const { response, auth, params } = ctx

    const user = auth.user!

    const bookmarkId = params.id

    const bookmark = await Bookmark.query().where('id', bookmarkId).firstOrFail()

    const { permission } = await FolderService.getFolderWithPermissions(bookmark.folderId, user)

    if (permission.accessLevel !== 'editor') {
      return response.forbidden(apiError('You do not have permission to update this bookmark.'))
    }

    bookmark.isPinned = false

    await bookmark.save()

    const formattedResponse = ctx.serialize(
      { bookmark: BookmarkTransformer.transform(bookmark) },
      'Bookmark unpinned successfully!'
    )

    return response.ok(formattedResponse)
  }
}
