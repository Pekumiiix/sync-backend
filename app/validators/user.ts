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
})

/**
 * Validator to use when verifying a user's email address
 */
export const verifyEmailValidator = vine.create({
  token: vine.string().fixedLength(6),
})

/**
 * Validator to use when resending a verification email
 */
export const resendVerificationEmailValidator = vine.create({
  email: email(),
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
  token: vine.string().fixedLength(6),
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
})
