import { BaseTransformer } from '@adonisjs/core/transformers'
import type BrowserIntegration from '#models/browser_integration'

export default class BrowserIntegrationTransformer extends BaseTransformer<BrowserIntegration> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'browser',
      'lastSyncedAt',
      'createdAt',
      'extensionVersion',
    ])
  }
}
