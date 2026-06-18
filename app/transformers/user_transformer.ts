import type User from '#models/user'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class UserTransformer extends BaseTransformer<User> {
  toObject() {
    return this.pick(this.resource, [
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
      'integrations',
    ])
  }
}
