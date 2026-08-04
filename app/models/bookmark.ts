import { BookmarkSchema } from '#database/schema'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.ts'
import Folder from './folder.ts'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Bookmark extends BookmarkSchema {
  @column({
    prepare: (value) => JSON.stringify(value),
    consume: (value) => (typeof value === 'string' ? JSON.parse(value) : value),
  })
  declare tags: string[]

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Folder)
  declare folder: BelongsTo<typeof Folder>
}
