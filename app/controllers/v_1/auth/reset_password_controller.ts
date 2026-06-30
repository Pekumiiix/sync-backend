import User from '#models/user'
import { resetPasswordValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import { apiError } from '#utils/response'
import { ApiSuccessResponse } from '#interfaces/api'

export default class ResetPasswordsController {
  async store(ctx: HttpContext) {
    const { request, response } = ctx

    const { token, password } = await request.validateUsing(resetPasswordValidator)

    const user = await User.findBy('reset_password_token', token)

    if (!user) {
      return response.badRequest(apiError('Invalid password reset token.'))
    }

    if (!user.resetPasswordTokenExpiresAt || user.resetPasswordTokenExpiresAt < DateTime.now()) {
      return response.badRequest(apiError('Reset token has expired. Please request a new one.'))
    }

    user.password = password
    user.resetPasswordToken = null
    user.resetPasswordTokenExpiresAt = null

    await user.save()

    const formattedResponse: ApiSuccessResponse = ctx.serialize(
      null,
      'Password reset was successful!'
    )

    return response.ok(formattedResponse)
  }
}
