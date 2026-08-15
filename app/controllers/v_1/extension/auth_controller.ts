import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { extensionLoginValidator } from '#validators/extension_user'
import { BrowserIntegrationService } from '#services/browser_integration_service'
import type { ExtensionSignInResponse } from '#interfaces/extension'
import UserTransformer from '#transformers/user_transformer'
import { inject } from '@adonisjs/core'
import { ApiSuccessResponse } from '#interfaces/api'
import db from '@adonisjs/lucid/services/db'
import { AccessTokenService } from '#services/access_token_service'

@inject()
export default class AuthController {
  constructor(
    protected browserIntegrationService: BrowserIntegrationService,
    protected accessTokenService: AccessTokenService
  ) {}

  async store(ctx: HttpContext) {
    const { request, response } = ctx

    const data = await request.validateUsing(extensionLoginValidator)

    const user = await User.verifyCredentials(data.email, data.password)

    const tokenName = `Extension: ${data.browser} - ${data.osPlatform}`

    const token = await db.transaction(async (trx) => {
      user.useTransaction(trx)

      const generatedToken = await this.accessTokenService.createAccessTokenForExtension(
        user,
        tokenName
      )

      await this.browserIntegrationService.upsertIntegration(
        user,
        {
          ...data,
          accessTokenId: generatedToken.identifier as number,
        },
        trx
      )

      return generatedToken
    })

    const formattedResponse: ExtensionSignInResponse = await ctx.serialize(
      {
        token: token.value!.release(),
        user: UserTransformer.transform(user).useVariant('forExtension'),
      },
      'Extension login successful!'
    )

    return response.ok(formattedResponse)
  }

  async destroy(ctx: HttpContext) {
    const { response, auth } = ctx

    const user = auth.user!

    const currentUserToken = user.currentAccessToken!

    await User.accessTokens.delete(user, currentUserToken.identifier)

    const formattedResponse: ApiSuccessResponse = await ctx.serialize(
      null,
      'Extension logout successful!'
    )

    return response.ok(formattedResponse)
  }
}
