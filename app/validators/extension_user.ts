import { SUPPORTED_BROWSERS } from '#enums/browser'
import vine from '@vinejs/vine'
import { type Infer } from '@vinejs/vine/types'

export const extensionLoginValidator = vine.create({
  email: vine.string().email(),
  password: vine.string(),
  browser: vine.enum(SUPPORTED_BROWSERS),
  extensionVersion: vine.string(),
  osPlatform: vine.string().minLength(1).maxLength(50),
  deviceId: vine.string().minLength(1).maxLength(100),
})

export const extensionOAuthValidator = vine.create({
  accessToken: vine.string().minLength(1).maxLength(500),
  browser: vine.enum(SUPPORTED_BROWSERS),
  extensionVersion: vine.string(),
  osPlatform: vine.string().minLength(1).maxLength(50),
  deviceId: vine.string().minLength(1).maxLength(100),
})

export type ExtensionOAuthData = Infer<typeof extensionOAuthValidator>
