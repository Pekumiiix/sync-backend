import UserTransformer from '#transformers/user_transformer'
import { updateProfileValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfileController {
  /**
   * @show
   * @operationId showProfile
   * @summary Show user profile
   * @description Retrieves the profile information of the authenticated user.
   * @responseBody 200 - { "success": true, "message": "Profile retrieved successfully", "data": { "user": "<UserResponse>" } }
   * @responseBody 401 - <ApiErrorResponse>
   * @responseBody 403 - <ApiErrorResponse>
   */
  async show(ctx: HttpContext) {
    const { auth, response } = ctx

    const formattedUser = ctx.serialize(
      { user: UserTransformer.transform(auth.getUserOrFail()) },
      'Profile retrieved successfully'
    )

    return response.ok(formattedUser)
  }

  /**
   * @update
   * @operationId updateProfile
   * @summary Update user profile
   * @description Updates the authenticated user's profile information. Only the provided fields will be modified.
   * @requestBody <updateProfileValidator>
   * @responseBody 200 - { "success": true, "message": "Profile updated successfully", "data": { "user": "<UserResponse>" } }
   * @responseBody 401 - <ApiErrorResponse>
   * @responseBody 403 - <ApiErrorResponse>
   * @responseBody 422 - <ApiValidationError>
   */
  async update(ctx: HttpContext) {
    const { auth, request, response } = ctx

    const { firstName, lastName, avatarUrl, location } =
      await request.validateUsing(updateProfileValidator)

    const user = auth.user!

    user.merge({
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      avatarUrl: avatarUrl || user.avatarUrl,
      location: location || user.location,
    })

    await user.save()

    const formattedResponse = ctx.serialize(
      { user: UserTransformer.transform(user) },
      'Profile updated successfully'
    )

    response.ok(formattedResponse)
  }
}
