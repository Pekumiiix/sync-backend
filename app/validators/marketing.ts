import vine from '@vinejs/vine'

export const contactValidator = vine.create({
  firstName: vine.string().minLength(1).maxLength(255),
  lastName: vine.string().minLength(1).maxLength(255),
  email: vine.string().email().minLength(1).maxLength(255),
  message: vine.string().minLength(1).maxLength(1000),
  company: vine.string().minLength(1).maxLength(255).optional(),
  country: vine.string().minLength(1).maxLength(255).optional(),
})
