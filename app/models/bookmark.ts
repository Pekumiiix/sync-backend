import { BookmarkSchema } from '#database/schema'
import { afterCreate, afterDelete, belongsTo } from '@adonisjs/lucid/orm'
import User from './user.ts'
import Folder from './folder.ts'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Bookmark extends BookmarkSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Folder)
  declare folder: BelongsTo<typeof Folder>

  @afterCreate()
  static async incrementBookmarkCount(bookmark: Bookmark) {
    await Folder.query().where('id', bookmark.folderId).increment('bookmarkCount', 1)
  }

  @afterDelete()
  static async decrementBookmarkCount(bookmark: Bookmark) {
    await Folder.query().where('id', bookmark.folderId).decrement('bookmarkCount', 1)
  }
}
