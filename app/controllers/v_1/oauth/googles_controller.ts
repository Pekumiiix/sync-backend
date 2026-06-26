import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { apiError } from '#utils/response'
import OauthIdentity from '#models/o_auth_identity'
import UserTransformer from '#transformers/user_transformer'
import { AuthDataResponse } from '#interfaces/user'
import { ApiSuccessResponse } from '#interfaces/api'

export default class OauthsController {
  async redirect({ ally }: HttpContext) {
    return ally.use('google').redirect()
  }

  async store(ctx: HttpContext) {
    const { response, ally } = ctx

    const google = ally.use('google')

    if (google.accessDenied()) {
      return response.unauthorized(apiError('Access to Google account was denied'))
    }
    if (google.stateMisMatch() || google.hasError()) {
      return response.badRequest(apiError('Login failed, please try again'))
    }

    const googleUser = await google.user()

    let user = await User.query()
      .whereHas('oauthIdentities', (query) => {
        query.where('provider', 'google').where('providerId', googleUser.id)
      })
      .first()

    if (!user) {
      user = await User.findBy('email', googleUser.email)

      if (!user) {
        user = await User.create({
          email: googleUser.email,
          firstName: googleUser.name.split(' ')[0],
          lastName: googleUser.name.split(' ').slice(1).join(' '),
          isEmailVerified: true,
        })
      }

      await OauthIdentity.create({
        userId: user.id,
        provider: 'google',
        providerId: googleUser.id,
        accessToken: googleUser.token.token,
      })
    }

    const token = await User.accessTokens.create(user)

    const formatedResponse: AuthDataResponse = ctx.serialize(
      {
        user: UserTransformer.transform(user),
        token: token.value!.release(),
      },
      'Logged in successfully'
    )

    return response.ok(formatedResponse)
  }

  async destroy(ctx: HttpContext) {
    const { response, auth } = ctx

    const user = auth.user! as User

    await user.load('oauthIdentities')

    if (!user.password && user.oauthIdentities.length <= 1) {
      return response.badRequest(
        apiError(
          'Cannot disconnect Google account. No other authentication method available. Please set a password before disconnecting.'
        )
      )
    }

    const identity = await OauthIdentity.query()
      .where('userId', user.id)
      .where('provider', 'google')
      .first()

    if (!identity) {
      return response.notFound(apiError('Google account not connected.'))
    }

    await identity.delete()

    const formatedResponse: ApiSuccessResponse = ctx.serialize(
      null,
      'Google account disconnected successfully.'
    )

    return response.ok(formatedResponse)
  }
}
