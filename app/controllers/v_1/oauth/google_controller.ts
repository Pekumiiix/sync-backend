import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { apiError } from '#utils/response'
import UserTransformer from '#transformers/user_transformer'
import { type AuthDataResponse } from '#interfaces/user'
import { type ApiSuccessResponse } from '#interfaces/api'
import { inject } from '@adonisjs/core'
import { OAuthService } from '#services/o_auth_service'
import db from '@adonisjs/lucid/services/db'
import { extensionOAuthValidator } from '#validators/extension_user'
import { BrowserIntegrationService } from '#services/browser_integration_service'
import { AccessTokenService } from '#services/access_token_service'

@inject()
export default class OauthsController {
  constructor(
    protected oAuthService: OAuthService,
    protected browserIntegrationService: BrowserIntegrationService,
    protected accessTokenService: AccessTokenService
  ) {}

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

    const { user, token } = await db.transaction(async (trx) => {
      const upsertedUser = await this.oAuthService.upsertGoogleUser(googleUser, trx)

      upsertedUser.useTransaction(trx)

      const generatedToken =
        await this.accessTokenService.createAccessTokenForWebDashboard(upsertedUser)

      return { user: upsertedUser, token: generatedToken }
    })

    const formatedResponse: AuthDataResponse = await ctx.serialize(
      {
        user: UserTransformer.transform(user),
        token: token.value!.release(),
      },
      'Logged in successfully'
    )

    return response.ok(formatedResponse)
  }

  async extension(ctx: HttpContext) {
    const { response, request, ally } = ctx

    const data = await request.validateUsing(extensionOAuthValidator)

    try {
      const googleUser = await ally.use('google').userFromToken(data.accessToken)

      const { user, token } = await this.oAuthService.handleGoogleExtensionLogin(googleUser, data)

      const formattedResponse: AuthDataResponse = await ctx.serialize(
        {
          user: UserTransformer.transform(user).useVariant('forExtension'),
          token: token.value!.release(),
        },
        'Logged in successfully'
      )

      return response.ok(formattedResponse)
    } catch (error) {
      return response.unauthorized(apiError('Invalid, expired, or malformed Google token.'))
    }
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

    await this.oAuthService.unlinkGoogleAccount(user)

    const formatedResponse: ApiSuccessResponse = await ctx.serialize(
      null,
      'Google account disconnected successfully.'
    )

    return response.ok(formatedResponse)
  }
}
