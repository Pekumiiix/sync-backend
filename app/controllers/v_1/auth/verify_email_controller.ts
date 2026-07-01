import User from '#models/user'
import { resendVerificationEmailValidator, verifyEmailValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import { generateVerificationCode } from '#utils/string'
import { apiError } from '#utils/response'
import { events } from '#generated/events'
import { type ApiSuccessResponse } from '#interfaces/api'

export default class VerifyEmailController {
  async store(ctx: HttpContext) {
    const { request, response } = ctx

    const { token } = await request.validateUsing(verifyEmailValidator)

    const user = await User.findByOrFail('email_verification_token', token)

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

    const formattedData: ApiSuccessResponse = await ctx.serialize(
      null,
      'Email verified successfully!'
    )

    return response.ok(formattedData)
  }

  async resend(ctx: HttpContext) {
    const { response, request } = ctx

    const { email } = await request.validateUsing(resendVerificationEmailValidator)

    const user = await User.findByOrFail('email', email)

    if (user.isEmailVerified) {
      return response.badRequest(apiError('Your email is already verified.'))
    }

    const verificationCode = generateVerificationCode()

    user.emailVerificationToken = verificationCode
    user.emailVerificationTokenExpiresAt = DateTime.now().plus({ minutes: 10 })

    await user.save()

    events.UserRegistered.dispatch(user, verificationCode)

    const formattedResponse: ApiSuccessResponse = await ctx.serialize(
      null,
      'A new verification code has been sent!'
    )

    return response.ok(formattedResponse)
  }
}
