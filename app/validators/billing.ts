import vine from '@vinejs/vine'

export const billingValidator = vine.create({
  variantId: vine.string(),
})
