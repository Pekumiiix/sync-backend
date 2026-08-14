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

export const addPasswordValidator = vine.create({
  password: vine.string().minLength(1).maxLength(255),
})

export const changePasswordValidator = vine.create({
  oldPassword: vine.string().minLength(1).maxLength(255),
  newPassword: vine.string().minLength(1).maxLength(255),
})
