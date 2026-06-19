import User from '#models/user'
import { resetPasswordValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import { apiError } from '../utils/response.ts'

export default class ResetPasswordsController {
  /**
   * @store
   * @operationId resetPassword
   * @summary Reset password
   * @description Resets the user's password using a valid reset token.
   * @requestBody <resetPasswordValidator>
   * @responseBody 200 - { "success": true, "message": "Password reset successfully!" }
   * @responseBody 422 - { "success": false, "message": "Validation Error", "errors": [{ "message": "The email field must be defined", "rule": "required", "field": "email" }] }
   */
  async store(ctx: HttpContext) {
    const { request, response } = ctx

    const { token, password } = await request.validateUsing(resetPasswordValidator)

    const user = await User.findBy('resetPasswordToken', token)

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

    const formattedResponse = ctx.serialize(null, 'Password reset successfully!')

    return response.ok(formattedResponse)
  }
}
