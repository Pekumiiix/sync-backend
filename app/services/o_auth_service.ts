import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import { BrowserIntegrationService } from '#services/browser_integration_service'
import { inject } from '@adonisjs/core'
import type { AllyUserContract, GoogleToken } from '@adonisjs/ally/types'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'
import { AccessTokenService } from './access_token_service.ts'
import { ExtensionOAuthData } from '#validators/extension_user'

type StatelessToken = { token: string; type: 'bearer' }

@inject()
export class OAuthService {
  constructor(
    protected browserIntegrationService: BrowserIntegrationService,
    protected accessTokenService: AccessTokenService
  ) {}

  async handleGoogleExtensionLogin(
    googleUser: AllyUserContract<StatelessToken>,
    data: ExtensionOAuthData
  ) {
    return await db.transaction(async (trx) => {
      const user = await this.upsertGoogleUser(googleUser, trx)

      user.useTransaction(trx)

      const tokenName = `Extension: ${data.browser} - ${data.osPlatform}`

      const token = await this.accessTokenService.createAccessTokenForExtension(user, tokenName)

      await this.browserIntegrationService.upsertIntegration(
        user,
        {
          ...data,
          accessTokenId: token.identifier as number,
        },
        trx
      )

      return { user, token }
    })
  }

  async upsertGoogleUser(
    googleUser: AllyUserContract<StatelessToken | GoogleToken>,
    trx: TransactionClientContract
  ) {
    if (!googleUser.email) {
      throw new Error('An email address is required to authenticate with Google.')
    }

    let user = await User.query({ client: trx })
      .whereHas('oauthIdentities', (query) => {
        query.where('provider', 'google').where('providerId', googleUser.id)
      })
      .first()

    if (!user) {
      user = await User.firstOrCreate(
        { email: googleUser.email },
        {
          firstName: googleUser.name?.split(' ')[0] || 'Unknown',
          lastName: googleUser.name?.split(' ').slice(1).join(' ') || '',
          isEmailVerified: googleUser.emailVerificationState === 'verified',
        },
        { client: trx }
      )
    }

    user.useTransaction(trx)

    await user
      .related('oauthIdentities')
      .updateOrCreate(
        { provider: 'google', providerId: googleUser.id },
        { accessToken: googleUser.token.token }
      )

    return user
  }

  async unlinkGoogleAccount(user: User) {
    const identity = await user
      .related('oauthIdentities')
      .query()
      .where('provider', 'google')
      .firstOrFail()

    await identity.delete()
  }
}
