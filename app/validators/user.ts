import { SYNC_FREQUENCY } from '#enums/sync_frequency'
import vine from '@vinejs/vine'

/**
 * Shared rules for email and password.
 */
const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(8).maxLength(32)

/**
 * Validator to use when performing self-signup
 */
export const signupValidator = vine.create({
  firstName: vine.string().maxLength(50),
  lastName: vine.string().maxLength(50),
  email: email().unique({ table: 'users', column: 'email' }),
  password: password(),
})

/**
 * Validator to use before validating user credentials
 * during login
 */
export const loginValidator = vine.create({
  email: email(),
  password: vine.string(),
  rememberMe: vine.boolean().optional(),
})

/**
 * Validator to use when verifying a user's email address
 */
export const verifyEmailValidator = vine.create({
  token: vine.string().fixedLength(6),
})

/**
 * Validator to use when requesting a password reset
 */
export const forgotPasswordValidator = vine.create({
  email: email(),
})

/**
 * Validator to use when resetting the password
 */
export const resetPasswordValidator = vine.create({
  token: vine.string().uuid(),
  password: password(),
})

/**
 * Validator to use when updating the user's profile
 */
export const updateProfileValidator = vine.create({
  firstName: vine.string().maxLength(50).optional(),
  lastName: vine.string().maxLength(50).optional(),
  location: vine.string().maxLength(100).optional(),
  avatarUrl: vine.string().url().maxLength(2048).optional(),
  password: password().optional(),
})

/**
 * Validate to update the user's settings
 */
export const updateSettingsValidator = vine.create({
  notifyOnNewMember: vine.boolean().optional(),
  notifyOnNewBookmark: vine.boolean().optional(),
  autoMergeDuplicate: vine.boolean().optional(),
  frequency: vine.enum([...SYNC_FREQUENCY]).optional(),
})
