import vine from '@vinejs/vine'
import { SUPPORTED_BROWSERS } from '#enums/browser'
import { Infer } from '@vinejs/vine/types'

export const fetchUrlDataValidator = vine.create({
  url: vine.string().url(),
})

export const createBookmarkValidator = vine.create({
  folderId: vine.string().uuid(),
  title: vine.string().minLength(1).maxLength(255),
  description: vine.string().maxLength(1000).optional(),
  websiteName: vine.string().maxLength(255).optional(),
  url: vine.string().url(),
  domain: vine.string().maxLength(255),
  faviconUrl: vine.string().url().optional(),
  coverImageUrl: vine.string().url().optional(),
  tags: vine.array(vine.string().minLength(1).maxLength(50)).optional(),
  browser: vine.enum([...SUPPORTED_BROWSERS]),
})

export const updateBookmarkValidator = vine.create({
  title: vine.string().minLength(1).maxLength(255).optional(),
  description: vine.string().maxLength(1000).optional(),
  tags: vine.array(vine.string().minLength(1).maxLength(50)).optional(),
})

export const moveBookmarkValidator = vine.create({
  folderId: vine.string().uuid(),
})

export const getBookmarksQueryValidator = vine.create({
  page: vine.number().optional(),
  limit: vine.number().optional(),
  sortByBrowser: vine.enum([...SUPPORTED_BROWSERS]).optional(),
  sortByDate: vine.enum(['oldest', 'newest']).optional(),
  sortByTitle: vine.enum(['asc', 'desc']).optional(),
})

export type GetBookmarksQueryParams = Infer<typeof getBookmarksQueryValidator>
export type CreateBookmarkType = Infer<typeof createBookmarkValidator>
export type UpdateBookmarkType = Infer<typeof updateBookmarkValidator>
