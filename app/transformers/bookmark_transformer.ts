import { BaseTransformer } from '@adonisjs/core/transformers'
import type Bookmark from '#models/bookmark'

export default class BookmarkTransformer extends BaseTransformer<Bookmark> {
  toObject() {
    const baseData = this.pick(this.resource, [
      'id',
      'folderId',
      'title',
      'description',
      'url',
      'domain',
      'faviconUrl',
      'coverImageUrl',
      'websiteName',
      'tags',
      'isPinned',
      'browser',
      'createdAt',
      'updatedAt',
    ])

    return {
      ...baseData,
      folder: this.resource.folder
        ? { id: this.resource.folder.id, name: this.resource.folder.name }
        : null,
      addedBy: this.resource.user
        ? {
            id: this.resource.user.id,
            avatarUrl: this.resource.user.avatarUrl,
            firstName: this.resource.user.firstName,
            lastName: this.resource.user.lastName,
          }
        : null,
    }
  }
}
