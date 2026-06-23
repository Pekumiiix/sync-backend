import { UserSettings } from '#types/user'
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

    const rawSettings: UserSettings = this.resource.settings || {}

    const formattedSettings = {
      management: {
        autoMergeDuplicate: rawSettings.autoMergeDuplicate ?? false,
      },
      notification: {
        notifyOnNewMember: rawSettings.notifyOnNewMember ?? true,
        notifyOnNewBookmark: rawSettings.notifyOnNewBookmark ?? true,
      },
      sync: {
        frequency: rawSettings.frequency?.toString() ?? '3',
      },
    }

    return {
      ...baseData,
      settings: formattedSettings,
    }
  }
}
