import User from '#models/user'
import { type StoreIntegrationValidator } from '#validators/browser_integration'

export class BrowserIntegrationService {
  async upsertIntegration(user: User, data: StoreIntegrationValidator) {
    const existingIntegration = await user
      .related('browserIntegrations')
      .query()
      .where('device_id', data.deviceId)
      .first()

    const oldTokenId = existingIntegration?.accessTokenId

    let integration

    if (existingIntegration) {
      existingIntegration.merge({
        browser: data.browser,
        osPlatform: data.osPlatform,
        extensionVersion: data.extensionVersion,
        accessTokenId: data.accessTokenId,
      })

      await existingIntegration.save()

      integration = existingIntegration
    } else {
      integration = await user.related('browserIntegrations').create({
        deviceId: data.deviceId,
        browser: data.browser,
        osPlatform: data.osPlatform,
        extensionVersion: data.extensionVersion,
        accessTokenId: data.accessTokenId,
      })
    }

    if (oldTokenId && oldTokenId !== data.accessTokenId) {
      await User.accessTokens.delete(user, oldTokenId)
    }

    return integration
  }

  async deleteIntegration(user: User, integrationId: string) {
    const integration = await user
      .related('browserIntegrations')
      .query()
      .where('id', integrationId)
      .firstOrFail()

    await User.accessTokens.delete(user, integration.accessTokenId)
  }
}
