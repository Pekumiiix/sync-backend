import User from '#models/user'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'
import type { AuthDataResponse } from '#interfaces/user'
import type { ApiSuccessResponse } from '#interfaces/api'
import { inject } from '@adonisjs/core'
import { AccessTokenService } from '#services/access_token_service'

@inject()
export default class AccessTokensController {
  constructor(protected accessTokenService: AccessTokenService) {}

  async store(ctx: HttpContext) {
    const { request, response } = ctx

    const { email, password, rememberMe = false } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)

    const token = await this.accessTokenService.createAccessTokenForWebDashboard(user, rememberMe)

    const formatedResponse: AuthDataResponse = await ctx.serialize(
      {
        user: UserTransformer.transform(user),
        token: token.value!.release(),
      },
      'Successfully signed in'
    )

    return response.created(formatedResponse)
  }

  async destroy(ctx: HttpContext) {
    const { response, auth } = ctx

    const user = auth.user!

    if (user.currentAccessToken) {
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    }

    const formatedResponse: ApiSuccessResponse = await ctx.serialize(
      null,
      'Successfully logged out'
    )

    return response.ok(formatedResponse)
  }
}
