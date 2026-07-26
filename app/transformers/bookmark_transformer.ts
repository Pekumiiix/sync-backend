import { BaseTransformer } from '@adonisjs/core/transformers'
import type Bookmark from '#models/bookmark'
import { type AccessLevelType } from '#enums/member'

export default class BookmarkTransformer extends BaseTransformer<Bookmark> {
  constructor(
    resource: Bookmark,
    protected accessLevel?: AccessLevelType | null
  ) {
    super(resource)
  }

  toObject() {
    const { folderId, ...baseData } = this.pick(this.resource, [
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

    const preloadedAccessLevel = this.resource.folder?.members?.[0]?.accessLevel as
      | AccessLevelType
      | undefined

    return {
      ...baseData,
      folder: {
        id: folderId,
        name: this.resource.folder.name ?? null,
      },
      addedBy: this.resource.user
        ? {
            avatarUrl: this.resource.user.avatarUrl,
            firstName: this.resource.user.firstName,
            lastName: this.resource.user.lastName,
          }
        : null,
      canEdit: this.accessLevel === 'editor' || preloadedAccessLevel === 'editor',
    }
  }
}
