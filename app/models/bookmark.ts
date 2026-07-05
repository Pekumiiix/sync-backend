import { BookmarkSchema } from '#database/schema'
import { afterCreate, afterDelete, afterUpdate, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.ts'
import Folder from './folder.ts'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { FolderService } from '#services/folder_service'

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

  @afterCreate()
  static async onBookmarkCreated(bookmark: Bookmark) {
    const trx = bookmark.$trx

    await Folder.query().where('id', bookmark.folderId).increment('bookmark_count', 1)
    await FolderService.syncFolderRecentImages(bookmark.folderId, trx)
  }

  @afterDelete()
  static async onBookmarkDeleted(bookmark: Bookmark) {
    const trx = bookmark.$trx

    await Folder.query().where('id', bookmark.folderId).decrement('bookmark_count', 1)
    await FolderService.syncFolderRecentImages(bookmark.folderId, trx)
  }

  @afterUpdate()
  static async onBookmarkUpdated(bookmark: Bookmark) {
    const trx = bookmark.$trx

    await FolderService.syncFolderRecentImages(bookmark.folderId, trx)
  }
}
