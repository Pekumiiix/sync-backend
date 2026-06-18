import User from '#models/user'
import { verifyEmailValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import { generateVerificationCode } from '../utils/string.ts'
import UserRegistered from '#events/user_registered'
import { apiError } from '../utils/response.ts'

export default class VerifyEmailController {
  async verify(ctx: HttpContext) {
    const { request, response } = ctx

    const { token } = await request.validateUsing(verifyEmailValidator)

    const user = await User.findByOrFail('emailVerificationToken', token)

    if (
      !user.emailVerificationTokenExpiresAt ||
      user.emailVerificationTokenExpiresAt < DateTime.now()
    ) {
      response.badRequest(apiError('Verification token has expired. Please request a new one.'))

      return
    }

    user.isEmailVerified = true
    user.emailVerificationToken = null
    user.emailVerificationTokenExpiresAt = null

    await user.save()

    const formattedData = ctx.serialize(null, 'Email verified successfully!')

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

    await UserRegistered.dispatch(user, verificationCode)

    const formattedResponse = ctx.serialize(null, 'A new verification code has been sent!')

    return response.ok(formattedResponse)
  }
}
