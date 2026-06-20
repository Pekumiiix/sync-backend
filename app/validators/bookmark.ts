import vine from '@vinejs/vine'

export const createBookmarkValidator = vine.create({
  url: vine.string().url(),
})
