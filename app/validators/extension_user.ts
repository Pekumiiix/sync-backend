import { SUPPORTED_BROWSERS } from '#enums/browser'
import vine from '@vinejs/vine'

export const extensionLoginValidator = vine.create({
  email: vine.string().email(),
  password: vine.string(),
  browser: vine.enum(SUPPORTED_BROWSERS),
  extensionVersion: vine.string(),
  osPlatform: vine.string().minLength(1).maxLength(50),
  deviceId: vine.string().minLength(1).maxLength(100),
})
