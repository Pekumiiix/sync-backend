import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { OAuthService } from '#services/o_auth_service'
import { extensionOAuthValidator } from '#validators/extension_user'
import { BrowserIntegrationService } from '#services/browser_integration_service'
import { AccessTokenService } from '#services/access_token_service'
import env from '#start/env'

const frontendurl: string = env.get('FRONTEND_URL')

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
      return response
        .redirect()
        .clearQs()
        .withQs({ error: 'access_denied' })
        .toPath(`${frontendurl}/auth/callback`)
    }

    if (google.stateMisMatch() || google.hasError()) {
      return response
        .redirect()
        .clearQs()
        .withQs({ error: 'auth_failed' })
        .toPath(`${frontendurl}/auth/callback`)
    }

    const googleUser = await google.user()

    const user = await this.oAuthService.upsertGoogleUser(googleUser)

    const token = await this.accessTokenService.createAccessTokenForWebDashboard(user)

    const urlToken = token.value!.release()

    return response
      .redirect()
      .clearQs()
      .withQs({ token: urlToken })
      .toPath(`${frontendurl}/auth/callback`)
  }

  async extension(ctx: HttpContext) {
    const { response, request, ally } = ctx

    const data = await request.validateUsing(extensionOAuthValidator)

    try {
      const googleUser = await ally.use('google').userFromToken(data.accessToken)

      const { token } = await this.oAuthService.handleGoogleExtensionLogin(googleUser, data)

      const urlToken = token.value!.release()

      return response
        .redirect()
        .clearQs()
        .withQs({ token: urlToken })
        .toPath(`${frontendurl}/auth/callback`)
    } catch (_) {
      return response
        .redirect()
        .clearQs()
        .withQs({ error: 'auth_failed' })
        .toPath(`${frontendurl}/auth/callback`)
    }
  }
}
