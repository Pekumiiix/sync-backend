import { ACCESS_LEVELS } from '#enums/member'
import vine from '@vinejs/vine'
import { type Infer } from '@vinejs/vine/types'

export const storeInvitationValidator = vine.create({
  email: vine.string().email(),
  accessLevel: vine.enum(ACCESS_LEVELS),
  folderId: vine.string().uuid(),
})

export const acceptInvitationValidator = vine.create({
  password: vine.string().minLength(1).maxLength(255).optional(),
})

export type StoreInvitationValidator = Infer<typeof storeInvitationValidator>
