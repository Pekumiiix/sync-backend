import User from '#models/user'
import { BrowserIntegrationService } from '#services/browser_integration_service'
import { inject } from '@adonisjs/core'
import type { AllyUserContract, GoogleToken } from '@adonisjs/ally/types'
import { AccessTokenService } from './access_token_service.ts'

type StatelessToken = { token: string; type: 'bearer' }

@inject()
export class OAuthService {
  constructor(
    protected browserIntegrationService: BrowserIntegrationService,
    protected accessTokenService: AccessTokenService
  ) {}

  async upsertGoogleUser(googleUser: AllyUserContract<StatelessToken | GoogleToken>) {
    if (!googleUser.email) {
      throw new Error('An email address is required to authenticate with Google.')
    }

    const baseAvatarUrl = googleUser.avatarUrl

    const highResAvatarUrl = baseAvatarUrl ? baseAvatarUrl.replace('=s96-c', '=s400-c') : null

    let user = await User.query()
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
          avatarUrl: highResAvatarUrl,
        }
      )
    }

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

  async unlinkOAuthIdentity(user: User, provider: string) {
    const identity = await user
      .related('oauthIdentities')
      .query()
      .where('provider', provider)
      .firstOrFail()

    await identity.delete()
  }
}
