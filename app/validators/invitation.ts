import { ACCESS_LEVELS } from '#enums/member'
import vine from '@vinejs/vine'

export const storeInvitationValidator = vine.create({
  email: vine.string().email(),
  accessLevel: vine.enum(ACCESS_LEVELS),
  folderId: vine.string().uuid(),
})
