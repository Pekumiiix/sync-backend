import { ACCESS_LEVELS } from '#enums/member'
import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const storeInvitationValidator = vine.create({
  email: vine.string().email(),
  accessLevel: vine.enum(ACCESS_LEVELS),
  folderId: vine.string().uuid(),
})

export type StoreInvitationValidator = Infer<typeof storeInvitationValidator>
