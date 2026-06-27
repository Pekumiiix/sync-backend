import { SUPPORTED_BROWSERS } from '#enums/browser'
import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

const name = () => vine.string().minLength(2).maxLength(255)

/**
 * Validator to use when creating a new folder
 */
export const createFolderValidator = vine.create({
  name: name(),
})

/**
 * Validator to use when updating an existing folder
 */
export const updateFolderValidator = vine.create({
  name: name(),
})

export const getFolderParamValidator = vine.create({
  page: vine.number().optional(),
  limit: vine.number().optional(),
  sortByBrowser: vine.enum([...SUPPORTED_BROWSERS]).optional(),
  sortByDate: vine.enum(['oldest', 'newest']).optional(),
  sortByTitle: vine.enum(['asc', 'desc']).optional(),
})

export const joinFolderValidator = vine.create({
  password: vine.string().minLength(1).maxLength(255).optional(),
})

export type GetFolderParams = Infer<typeof getFolderParamValidator>
