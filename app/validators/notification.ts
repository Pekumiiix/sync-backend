import vine from '@vinejs/vine'

export const notificationQueryParam = vine.create({
  page: vine.number().optional(),
  limit: vine.number().optional(),
})
