import User from '#models/user'
import { type StoreIntegrationValidator } from '#validators/browser_integration'

export class BrowserIntegrationService {
  static async upsertIntegration(user: User, data: StoreIntegrationValidator) {
    const existingIntegration = await user
      .related('browserIntegrations')
      .query()
      .where('deviceId', data.deviceId)
      .first()

    const oldTokenId = existingIntegration?.accessTokenId

    const integration = await user.related('browserIntegrations').updateOrCreate(
      { deviceId: data.deviceId },
      {
        browser: data.browser,
        osPlatform: data.osPlatform,
        extensionVersion: data.extensionVersion,
        accessTokenId: data.accessTokenId,
      }
    )

    if (oldTokenId && oldTokenId !== data.accessTokenId) {
      await User.accessTokens.delete(user, oldTokenId)
    }

    return integration
  }

  static async deleteIntegration(user: User, integrationId: string) {
    const integration = await user
      .related('browserIntegrations')
      .query()
      .where('id', integrationId)
      .firstOrFail()

    await User.accessTokens.delete(user, integration.accessTokenId)
  }
}
