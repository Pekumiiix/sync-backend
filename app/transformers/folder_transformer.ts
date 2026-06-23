import { BaseTransformer } from '@adonisjs/core/transformers'
import Folder from '#models/folder'

export default class FolderTransformer extends BaseTransformer<Folder> {
  toObject() {
    const baseData = this.pick(this.resource, ['id', 'name', 'isSystem', 'createdAt', 'updatedAt'])

    return {
      ...baseData,
      isProtected: this.resource.password !== null,
    }
  }
}
