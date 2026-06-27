import { events } from '#generated/events'
import Member from '#models/member'
import User from '#models/user'
import { Exception } from '@adonisjs/core/exceptions'
import db from '@adonisjs/lucid/services/db'

export class MemberService {
  static async getFolderPreviews(folderId: string, limit: number) {
    const members = await Member.query().where('folder_id', folderId).preload('user').limit(limit)

    return members.map((member) => ({
      id: member.user.id,
      firstName: member.user.firstName,
      lastName: member.user.lastName,
      avatarUrl: member.user.avatarUrl,
    }))
  }

  static async destroyMember(folderId: string, memberId: string, initiator: User) {
    return await db.transaction(async (trx) => {
      const member = await Member.query({ client: trx })
        .where('id', memberId)
        .where('folder_id', folderId)
        .preload('user')
        .firstOrFail()

      if (member.userId === initiator.id) {
        throw new Exception('Owners cannot remove themselves from their own folder.', {
          status: 403,
        })
      }

      await member.delete()

      events.MemberRemoved.dispatch(folderId, member.user.firstName, initiator)

      return member
    })
  }

  static async leaveFolder(folderId: string, user: User) {
    return await db.transaction(async (trx) => {
      const member = await user
        .related('memberships')
        .query()
        .where('folder_id', folderId)
        .firstOrFail()

      if (member.role === 'owner') {
        throw new Exception('Folder owners cannot leave their own folder.', { status: 403 })
      }

      await member.delete()

      events.MemberLeft.dispatch(folderId, user)

      return member
    })
  }
}
