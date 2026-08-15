import User from '#models/user'
import { verifyEmailValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import { generateVerificationCode } from '#utils/string'
import { apiError } from '#utils/response'
import { events } from '#generated/events'
import { type ApiSuccessResponse } from '#interfaces/api'
import UserTransformer from '#transformers/user_transformer'
import { type ProfileResponse } from '#interfaces/profile'

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
        apiError('Invalid or expired verification token. Please request a new one.')
      )
    }

    if (user.isEmailVerified) {
      return response.badRequest(apiError('Your email is already verified.'))
    }

    user.isEmailVerified = true
    user.emailVerificationToken = null
    user.emailVerificationTokenExpiresAt = null

    await user.save()

    const formattedData: ProfileResponse = await ctx.serialize(
      { user: UserTransformer.transform(user) },
      'Email verified successfully!'
    )

    return response.ok(formattedData)
  }

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

    const formattedResponse: ApiSuccessResponse = await ctx.serialize(
      null,
      'A new verification mail has been sent!'
    )

    return response.ok(formattedResponse)
  }
}
