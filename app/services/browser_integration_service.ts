import User from '#models/user'
import { type StoreIntegrationValidator } from '#validators/browser_integration'
import db from '@adonisjs/lucid/services/db'

export class BrowserIntegrationService {
  async upsertIntegration(user: User, data: StoreIntegrationValidator) {
    const existingIntegration = await user
      .related('browserIntegrations')
      .query()
      .where('device_id', data.deviceId)
      .first()

    const oldTokenId = existingIntegration?.accessTokenId

    const integration = await db.transaction(async (trx) => {
      let record = existingIntegration

      if (record) {
        record.useTransaction(trx)

        record.merge({
          browser: data.browser,
          osPlatform: data.osPlatform,
          extensionVersion: data.extensionVersion,
          accessTokenId: data.accessTokenId,
        })

        await record.save()
      } else {
        record = await user.related('browserIntegrations').create(
          {
            deviceId: data.deviceId,
            browser: data.browser,
            osPlatform: data.osPlatform,
            extensionVersion: data.extensionVersion,
            accessTokenId: data.accessTokenId,
          },
          { client: trx }
        )
      }

      return record
    })

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
