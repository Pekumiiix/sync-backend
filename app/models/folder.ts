import { FolderSchema } from '#database/schema'
import { belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import User from './user.ts'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Bookmark from './bookmark.ts'
import Member from './member.ts'

export default class Folder extends FolderSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Bookmark)
  declare bookmarks: HasMany<typeof Bookmark>

  @hasMany(() => Member)
  declare members: HasMany<typeof Member>

  @manyToMany(() => User, {
    pivotTable: 'members',
    // pivotColumns: ['role', 'access_level'],
  })
  declare users: ManyToMany<typeof User>
}
