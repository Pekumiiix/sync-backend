import vine from '@vinejs/vine'

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
  sortByBrowser: vine
    .enum(['chrome', 'firefox', 'edge', 'safari', 'arc', 'brave', 'all'])
    .optional(),
  sortByDate: vine.enum(['oldest', 'newest']).optional(),
  sortByTitle: vine.enum(['asc', 'desc']).optional(),
})
