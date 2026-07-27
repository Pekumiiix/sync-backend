import { SYNC_FREQUENCY_IN_HOURS_TO_STRING, type SyncFrequency } from '#enums/sync_frequency'
import type { UserSettingsSchema } from '#interfaces/user'
import type User from '#models/user'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class UserTransformer extends BaseTransformer<User> {
  toObject() {
    const baseData = this.pick(this.resource, [
      'id',
      'firstName',
      'lastName',
      'email',
      'createdAt',
      'updatedAt',
      'avatarUrl',
      'location',
      'plan',
      'isEmailVerified',
    ])

    const rawSettings: UserSettingsSchema = this.resource.settings || {}

    const formattedSettings = {
      management: {
        autoMergeDuplicate: rawSettings.autoMergeDuplicate ?? false,
      },
      notification: {
        notifyOnNewMember: rawSettings.notifyOnNewMember ?? true,
        notifyOnNewBookmark: rawSettings.notifyOnNewBookmark ?? true,
      },
      sync: {
        frequency: SYNC_FREQUENCY_IN_HOURS_TO_STRING[
          rawSettings.syncFrequencyInHours
        ] as SyncFrequency,
      },
    }

    return {
      ...baseData,
      settings: formattedSettings,
    }
  }
}
