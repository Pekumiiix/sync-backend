import { BaseTransformer } from '@adonisjs/core/transformers'
import type Invitation from '#models/invitation'

export default class InvitationTransformer extends BaseTransformer<Invitation> {
  toObject() {
    const { folderId, ...baseData } = this.pick(this.resource, [
      'id',
      'folderId',
      'token',
      'createdAt',
    ])

    return {
      ...baseData,
      status: this.resource.computedStatus,
      inviter: this.resource.inviter
        ? {
            avatarUrl: this.resource.inviter.avatarUrl,
            firstName: this.resource.inviter.firstName,
            lastName: this.resource.inviter.lastName,
          }
        : null,
      folder: {
        id: folderId,
        name: this.resource.folder.name || null,
        isProtected: this.resource.folder.password !== null,
        recentBookmarksImages: this.resource.folder.recentBookmarksImages || null,
      },
    }
  }
}
