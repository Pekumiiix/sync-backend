import { InvitationSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import User from './user.ts'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Folder from './folder.ts'

export default class Invitation extends InvitationSchema {
  @belongsTo(() => User)
  declare inviter: BelongsTo<typeof User>

  @belongsTo(() => Folder)
  declare folder: BelongsTo<typeof Folder>
}
