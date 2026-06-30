import User from '#models/user'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'
import { AuthDataResponse } from '#interfaces/user'
import { ApiSuccessResponse } from '#interfaces/api'
import { BookmarkService } from '#services/bookmark_service'

export default class AccessTokensController {
  async store(ctx: HttpContext) {
    const { request, response } = ctx

    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    const browserTypes = await BookmarkService.getAllBrowserTypesForUser(user.id)

    const formatedResponse: AuthDataResponse = ctx.serialize(
      {
        user: UserTransformer.transform(user),
        browserTypes,
        token: token.value!.release(),
      },
      'Successfully signed in'
    )

    return response.created(formatedResponse)
  }

  async destroy(ctx: HttpContext) {
    const { response, auth } = ctx

    const user = auth.getUserOrFail()

    if (user.currentAccessToken) {
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    }

    const formatedResponse: ApiSuccessResponse = ctx.serialize(null, 'Successfully logged out')

    return response.ok(formatedResponse)
  }
}
