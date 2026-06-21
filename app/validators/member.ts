import vine from '@vinejs/vine'

export const updateMemberValidator = vine.create({
  accessLevel: vine.enum(['viewer', 'editor']),
})
