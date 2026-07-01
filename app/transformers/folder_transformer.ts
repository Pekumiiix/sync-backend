import { BaseTransformer } from '@adonisjs/core/transformers'
import type Folder from '#models/folder'

export default class FolderTransformer extends BaseTransformer<Folder> {
  toObject() {
    const baseData = this.pick(this.resource, [
      'id',
      'name',
      'isSystem',
      'createdAt',
      'updatedAt',
      'bookmarkCount',
      'recentBookmarksImages',
    ])

    return {
      ...baseData,
      isProtected: this.resource.password !== null,
    }
  }
}
