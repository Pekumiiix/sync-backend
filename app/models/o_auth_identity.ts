import { OauthIdentitySchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import User from './user.ts'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class OauthIdentity extends OauthIdentitySchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
