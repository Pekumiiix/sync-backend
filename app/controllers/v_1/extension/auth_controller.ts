import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { extensionLoginValidator } from '#validators/extension_user'
import { BrowserIntegrationService } from '#services/browser_integration_service'
import type { ExtensionSignInResponse } from '#interfaces/extension'
import UserTransformer from '#transformers/user_transformer'
import { inject } from '@adonisjs/core'
import { ApiSuccessResponse } from '#interfaces/api'

@inject()
export default class AuthController {
  constructor(private browserIntegrationService: BrowserIntegrationService) {}

  async store(ctx: HttpContext) {
    const { request, response } = ctx
    const { email, password, browser, deviceId, osPlatform, extensionVersion } =
      await request.validateUsing(extensionLoginValidator)

    const user = await User.verifyCredentials(email, password)

    const tokenName = `Extension: ${browser} - ${osPlatform}`

    const token = await User.accessTokens.create(user, ['*'], {
      name: tokenName,
      expiresIn: '1 year',
    })

    await this.browserIntegrationService.upsertIntegration(user, {
      browser,
      osPlatform,
      deviceId,
      extensionVersion,
      accessTokenId: token.identifier as number,
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
