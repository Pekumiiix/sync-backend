import { BaseTransformer } from '@adonisjs/core/transformers'
import Member from '#models/member'

export default class MemberTransformer extends BaseTransformer<Member> {
  toObject() {
    const baseData = this.pick(this.resource, ['id', 'role', 'accessLevel', 'folderId'])

    return {
      ...baseData,
      user: this.resource.user
        ? {
            firstName: this.resource.user.firstName,
            lastName: this.resource.user.lastName,
            avatarUrl: this.resource.user.avatarUrl,
          }
        : null,
    }
  }
}
