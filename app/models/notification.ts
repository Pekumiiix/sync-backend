import { NotificationSchema } from '#database/schema'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.ts'
import { belongsTo } from '@adonisjs/lucid/orm'

export default class Notification extends NotificationSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
