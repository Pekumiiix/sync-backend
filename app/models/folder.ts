import { FolderSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import User from './user.ts'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Folder extends FolderSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
