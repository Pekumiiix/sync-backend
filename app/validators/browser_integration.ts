import { SUPPORTED_BROWSERS } from '#enums/browser'
import vine from '@vinejs/vine'
import { type Infer } from '@vinejs/vine/types'

export const storeIntegrationValidor = vine.create({
  browser: vine.enum(SUPPORTED_BROWSERS),
  deviceName: vine.string().minLength(1).maxLength(100).optional(),
  extensionVersion: vine.string().minLength(1).maxLength(50),
})

export type StoreIntegrationValidator = Infer<typeof storeIntegrationValidor>
