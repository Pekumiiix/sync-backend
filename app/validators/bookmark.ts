import vine from '@vinejs/vine'
import { SUPPORTED_BROWSERS } from '#enums/browser'
import { type Infer } from '@vinejs/vine/types'

const bookmarkIds = () => vine.array(vine.string().uuid())
const folderId = () => vine.string().uuid()

export const fetchUrlDataValidator = vine.create({
  url: vine.string().url(),
})

export const createBookmarkValidator = vine.create({
  folderId: folderId(),
  title: vine.string().minLength(1).maxLength(255),
  description: vine.string().maxLength(1000).nullable().optional(),
  websiteName: vine.string().maxLength(255).nullable().optional(),
  url: vine.string().url(),
  domain: vine.string().maxLength(255),
  faviconUrl: vine.string().url().nullable().optional(),
  coverImageUrl: vine.string().url().nullable().optional(),
  tags: vine.array(vine.string().minLength(1).maxLength(50)).optional(),
  browser: vine.enum([...SUPPORTED_BROWSERS]),
})

export const updateBookmarkValidator = vine.create({
  title: vine.string().minLength(1).maxLength(255).optional(),
  description: vine.string().maxLength(1000).optional(),
  tags: vine.array(vine.string().minLength(1).maxLength(50)).optional(),
})

export const moveBookmarkValidator = vine.create({
  folderId: folderId(),
})

export const bulkMoveBookmarkValidator = vine.create({
  bookmarkIds: bookmarkIds(),
  folderId: folderId(),
})

export const bulkDeleteBookmarkValidator = vine.create({
  bookmarkIds: bookmarkIds(),
})

export const bulkUnpinBookmarkValidator = vine.create({
  bookmarkIds: bookmarkIds(),
})

export const getBookmarksQueryValidator = vine.create({
  page: vine.number().optional(),
  limit: vine.number().optional(),
  sort: vine.enum(['oldest', 'newest', 'title_asc', 'title_desc']).optional(),
  filter: vine.enum([...SUPPORTED_BROWSERS, 'all']).optional(),
})

export const getBookBrowserTypesValidator = vine.create({
  folderId: folderId().optional(),
})

export type GetBookmarksQueryParams = Infer<typeof getBookmarksQueryValidator>
export type CreateBookmarkType = Infer<typeof createBookmarkValidator>
export type UpdateBookmarkType = Infer<typeof updateBookmarkValidator>
