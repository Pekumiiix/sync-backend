import { BookmarkSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import User from './user.ts'
import Folder from './folder.ts'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Bookmark extends BookmarkSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Folder)
  declare folder: BelongsTo<typeof Folder>
}
