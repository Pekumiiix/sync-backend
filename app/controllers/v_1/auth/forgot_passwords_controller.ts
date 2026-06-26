import { events } from '#generated/events'
import { ApiSuccessResponse } from '#interfaces/api'
import User from '#models/user'
import { forgotPasswordValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import crypto from 'node:crypto'

export default class ForgotPasswordsController {
  async store(ctx: HttpContext) {
    const { request, response } = ctx

    const { email } = await request.validateUsing(forgotPasswordValidator)

    const user = await User.findBy('email', email)

    if (user) {
      const resetToken = crypto.randomUUID()
      const resetTokenExpiresAt = DateTime.now().plus({ hours: 1 })

      user.resetPasswordToken = resetToken
      user.resetPasswordTokenExpiresAt = resetTokenExpiresAt

      await user.save()

      events.PasswordResetRequested.dispatch(user, resetToken)
    }

    const formattedResponse: ApiSuccessResponse = ctx.serialize(
      null,
      'If an account with that email exists, a password reset link has been sent.'
    )

    return response.ok(formattedResponse)
  }
}
