import { events } from '#generated/events'
import User from '#models/user'
import { forgotPasswordValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import crypto from 'node:crypto'

export default class ForgotPasswordsController {
  /**
   * @store
   * @operationId requestPasswordReset
   * @summary Request password reset
   * @description Initiates the password reset process by sending a reset link to the user's email.
   * @requestBody <forgotPasswordValidator>
   * @responseBody 200 - <ApiSuccessMessage>
   * @responseBody 422 - <ApiValidationError>
   */
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

    const formattedResponse = ctx.serialize(
      null,
      'If an account with that email exists, a password reset link has been sent.'
    )

    return response.ok(formattedResponse)
  }
}
