import { SUPPORTED_BROWSERS } from '#enums/browser'
import vine from '@vinejs/vine'

export const extensionLoginValidator = vine.create({
  email: vine.string().email(),
  password: vine.string(),
  browser: vine.enum(SUPPORTED_BROWSERS),
  deviceName: vine.string().optional(),
  extensionVersion: vine.string(),
})
