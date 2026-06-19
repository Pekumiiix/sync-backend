import User from '#models/user'
import { verifyEmailValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import { generateVerificationCode } from '../utils/string.ts'
import UserRegistered from '#events/user_registered'
import { apiError } from '../utils/response.ts'

export default class VerifyEmailController {
  /**
   * @store
   * @operationId verifyEmail
   * @summary Verify email
   * @description Verifies the user's email address using a valid verification token.
   * @requestBody <verifyEmailValidator>
   * @responseBody 200 - { "success": true, "message": "Email verified successfully!", }
   * @responseBody 400 - { "success": false, "message": "Verification token has expired. Please request a new one." }
   * @responseBody 422 - { "success": false, "message": "Validation Error", "errors": [{ "message": "The token field must be defined", "rule": "required", "field": "token" }] }
   */
  async store(ctx: HttpContext) {
    const { request, response } = ctx

    const { token } = await request.validateUsing(verifyEmailValidator)

    const user = await User.findByOrFail('emailVerificationToken', token)

    if (
      !user.emailVerificationTokenExpiresAt ||
      user.emailVerificationTokenExpiresAt < DateTime.now()
    ) {
      return response.badRequest(
        apiError('Verification token has expired. Please request a new one.')
      )
    }

    user.isEmailVerified = true
    user.emailVerificationToken = null
    user.emailVerificationTokenExpiresAt = null

    await user.save()

    const formattedData = ctx.serialize(null, 'Email verified successfully!')

    return response.ok(formattedData)
  }

  /**
   * @resend
   * @operationId resendEmailVerification
   * @summary Resend email verification
   * @description Generates a new verification code and resends the email to the authenticated user.
   * @responseBody 200 - { "success": true, "message": "A new verification code has been sent!" }
   * @responseBody 400 - { "success": false, "message": "Your email is already verified." }
   */
  async resend(ctx: HttpContext) {
    const { response, auth } = ctx

    const user = auth.user!

    if (user.isEmailVerified) {
      return response.badRequest(apiError('Your email is already verified.'))
    }

    const verificationCode = generateVerificationCode()

    user.emailVerificationToken = verificationCode
    user.emailVerificationTokenExpiresAt = DateTime.now().plus({ hours: 12 })

    await user.save()

    UserRegistered.dispatch(user, verificationCode)

    const formattedResponse = ctx.serialize(null, 'A new verification code has been sent!')

    return response.ok(formattedResponse)
  }
}
