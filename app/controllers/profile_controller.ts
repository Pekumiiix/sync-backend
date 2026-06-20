import UserTransformer from '#transformers/user_transformer'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfileController {
  /**
   * @show
   * @operationId showProfile
   * @summary Show user profile
   * @description Retrieves the profile information of the authenticated user.
   * @responseBody 200 - { "success": true, "message": "Profile retrieved successfully", "data": "<UserResponse>" }
   * @responseBody 401 - <ApiErrorResponse>
   * @responseBody 403 - <ApiErrorResponse>
   */
  async show(ctx: HttpContext) {
    const { auth, response } = ctx

    const formattedUser = ctx.serialize(
      UserTransformer.transform(auth.getUserOrFail()),
      'Profile retrieved successfully'
    )

    return response.ok(formattedUser)
  }
}
