import { SUPPORTED_BROWSERS } from '#enums/browser'
import vine from '@vinejs/vine'

export const createBookmarkValidator = vine.create({
  urls: vine.array(vine.string().url()),
  browser: vine.enum([...SUPPORTED_BROWSERS]),
})
