import { BaseTransformer } from '@adonisjs/core/transformers'
import Folder from '#models/folder'

export default class FolderTransformer extends BaseTransformer<Folder> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'name',
      'bookmarkCount',
      'recentBookmarksImages',
      'isSystem',
      'createdAt',
      'updatedAt',
    ])
  }
}
