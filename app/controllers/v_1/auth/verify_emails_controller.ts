import User from '#models/user'
import { verifyEmailValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import { generateVerificationCode } from '#utils/string'
import { apiError } from '#utils/response'
import { events } from '#generated/events'

export default class VerifyEmailController {
  /**
   * @store
   * @operationId verifyEmail
   * @summary Verify email
   * @description Verifies the user's email address using a valid verification token.
   * @requestBody <verifyEmailValidator>
   * @responseBody 200 - <ApiSuccessMessage>
   * @responseBody 400 - <ApiErrorResponse>
   * @responseBody 422 - <ApiValidationError>
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
   * @responseBody 200 - <ApiSuccessMessage>
   * @responseBody 400 - <ApiErrorResponse>
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

    events.UserRegistered.dispatch(user, verificationCode)

    const formattedResponse = ctx.serialize(null, 'A new verification code has been sent!')

    return response.ok(formattedResponse)
  }
}
