import User from '#models/user'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'

export default class AccessTokensController {
  /**
   * @store
   * @operationId signIn
   * @summary Sign in a user
   * @description Authenticates a user and returns an access token.
   * @requestBody <loginValidator>
   * @responseBody 201 - { "success": true, "message": "Successfully signed in", "data": { "user": "<UserResponse>", "token": "string" } }
   * @responseBody 422 - <ApiValidationError>
   */
  async store(ctx: HttpContext) {
    const { request, response } = ctx

    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    const formatedResponse = ctx.serialize(
      {
        user: UserTransformer.transform(user),
        token: token.value!.release(),
      },
      'Successfully signed in'
    )

    return response.created(formatedResponse)
  }

  /**
   * @destroy
   * @operationId signOut
   * @summary Sign out a user
   * @description Invalidates the current access token and signs out the user.
   * @responseBody 200 - <ApiSuccessMessage>
   * @responseBody 401 - <ApiErrorResponse>
   * @responseBody 403 - <ApiErrorResponse>
   */
  async destroy(ctx: HttpContext) {
    const { response, auth } = ctx

    const user = auth.getUserOrFail()

    if (user.currentAccessToken) {
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    }

    const formatedResponse = ctx.serialize(null, 'Successfully logged out')

    response.ok(formatedResponse)
  }
}
