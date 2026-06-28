import { MemberSchema } from '#database/schema'
import { afterCreate, afterDelete, belongsTo } from '@adonisjs/lucid/orm'
import User from './user.ts'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Folder from './folder.ts'

export default class Member extends MemberSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Folder)
  declare folder: BelongsTo<typeof Folder>

  @afterCreate()
  static async incrementMemberCount(member: Member) {
    await Folder.query().where('id', member.folderId).increment('member_count', 1)
  }

  @afterDelete()
  static async decrementMemberCount(member: Member) {
    await Folder.query().where('id', member.folderId).decrement('member_count', 1)
  }
}
