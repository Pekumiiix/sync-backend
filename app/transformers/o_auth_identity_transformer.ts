import { BaseTransformer } from '@adonisjs/core/transformers'
import type OAuthIdentity from '#models/o_auth_identity'

export default class OAuthIdentityTransformer extends BaseTransformer<OAuthIdentity> {
  toObject() {
    return this.pick(this.resource, ['id', 'provider', 'createdAt'])
  }
}
