import UserTransformer from '#transformers/user_transformer'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfileController {
  /**
   * @show
   * @operationId showProfile
   * @summary Show user profile
   * @description Retrieves the profile information of the authenticated user.
   * @responseBody 200 - { "success": true, "message": "Profile retrieved successfully", "data": { "user": { "id": "123e4567-e89b-12d3-a456-426614174000", "firstName": "John", "lastName": "Doe", "email": "john@example.com", "is_email_verified": false, "location": "", "avatar_url": "", "created_at": "2024-01-01T00:00:00.000Z", "updated_at": "2024-01-01T00:00:00.000Z", "plan": "free", "integrations": [] } } }
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
