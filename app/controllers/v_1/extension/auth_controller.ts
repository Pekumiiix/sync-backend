import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { extensionLoginValidator } from '#validators/extension_user'
import { BrowserIntegrationService } from '#services/browser_integration_service'
import { ExtensionSignInResponse } from '#interfaces/extension'

export default class AuthController {
  async store(ctx: HttpContext) {
    const { request, response } = ctx
    const { email, password, browser, deviceName, extensionVersion } =
      await request.validateUsing(extensionLoginValidator)

    const user = await User.verifyCredentials(email, password)

    const tokenName = `Extension: ${browser || 'Unknown'} - ${deviceName || 'Unknown Device'}`

    const token = await User.accessTokens.create(user, ['*'], {
      name: tokenName,
      expiresIn: '1 year',
    })

    await BrowserIntegrationService.upsertIntegration(user, {
      browser,
      deviceName,
      extensionVersion,
    })

    const formattedResponse: ExtensionSignInResponse = ctx.serialize(
      {
        token: token.value!.release(),
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          avatarUrl: user.avatarUrl,
        },
      },
      'Extension login successful!'
    )

    return response.ok(formattedResponse)
  }
}
