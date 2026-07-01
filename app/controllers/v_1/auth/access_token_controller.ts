import User from '#models/user'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'
import type { AuthDataResponse } from '#interfaces/user'
import type { ApiSuccessResponse } from '#interfaces/api'

export default class AccessTokensController {
  async store(ctx: HttpContext) {
    const { request, response } = ctx

    const { email, password, rememberMe = false } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user, ['*'], {
      name: 'Web dashboard session',
      expiresIn: rememberMe ? '7 days' : '1 day',
    })

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

    const user = auth.getUserOrFail()

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
