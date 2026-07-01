import type User from '#models/user'
import { type StoreIntegrationValidator } from '#validators/browser_integration'

export class BrowserIntegrationService {
  static async upsertIntegration(user: User, data: StoreIntegrationValidator) {
    const integration = await user.related('browserIntegrations').updateOrCreate(
      { browser: data.browser },
      {
        deviceName: data.deviceName,
        extensionVersion: data.extensionVersion,
      }
    )

    return integration
  }

  static async deleteIntegration(user: User, integrationId: string) {
    const integration = await user
      .related('browserIntegrations')
      .query()
      .where('id', integrationId)
      .firstOrFail()

    await integration.delete()
  }
}
