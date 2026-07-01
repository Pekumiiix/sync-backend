import { type AccessLevelType, type RoleType } from '#enums/member'
import { events } from '#generated/events'
import Folder from '#models/folder'
import Member from '#models/member'
import type User from '#models/user'
import { Exception } from '@adonisjs/core/exceptions'
import db from '@adonisjs/lucid/services/db'

export class MemberService {
  static async checkPermissions(userId: string, folderId: string) {
    const folder = await Folder.findOrFail(folderId)

    if (folder.userId === userId) {
      return {
        isMember: true,
        isOwner: true,
        role: 'admin' as RoleType,
        accessLevel: 'editor' as AccessLevelType,
      }
    }

    const membership = await Member.query()
      .where('user_id', userId)
      .where('folder_id', folderId)
      .first()

    if (membership) {
      return {
        isMember: true,
        isOwner: false,
        role: membership.role as RoleType,
        accessLevel: membership.accessLevel as AccessLevelType,
      }
    }

    return {
      isMember: false,
      isOwner: false,
      role: null,
      accessLevel: null,
    }
  }

  static async requireRole(userId: string, folderId: string, allowedRole: RoleType) {
    const permissions = await this.checkPermissions(userId, folderId)

    if (!permissions.isMember || !permissions.role) {
      throw new Exception('You are not a member of this folder.', {
        code: 'E_UNAUTHORIZED_ACCESS',
        status: 403,
      })
    }

    if (permissions.role !== allowedRole) {
      throw new Exception('You do not have the required permissions to perform this action.', {
        code: 'E_INSUFFICIENT_PERMISSIONS',
        status: 403,
      })
    }

    return permissions
  }

  static async requireAccessLevel(
    userId: string,
    folderId: string,
    allowedAccessLevel: AccessLevelType
  ) {
    const permissions = await this.checkPermissions(userId, folderId)

    if (!permissions.isMember || !permissions.accessLevel) {
      throw new Exception('You are not a member of this folder.', {
        code: 'E_UNAUTHORIZED_ACCESS',
        status: 403,
      })
    }

    if (permissions.accessLevel !== allowedAccessLevel) {
      throw new Exception('You do not have the required access level to perform this action.', {
        code: 'E_INSUFFICIENT_PERMISSIONS',
        status: 403,
      })
    }

    return permissions
  }

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
    const member = await db.transaction(async (trx) => {
      const membership = await Member.query({ client: trx })
        .where('user_id', user.id)
        .where('folder_id', folderId)
        .firstOrFail()

      if (membership.role === 'owner') {
        throw new Exception('Folder owners cannot leave their own folder.', { status: 403 })
      }

      membership.useTransaction(trx)

      await membership.delete()

      return membership
    })

    events.MemberLeft.dispatch(folderId, user)

    return member
  }

  static async getMembers(folderId: string, excludeUserId?: string) {
    return await Member.query()
      .where('folder_id', folderId)
      .if(excludeUserId, (query) => {
        query.whereNot('user_id', excludeUserId!)
      })
      .preload('user')
      .preload('folder')
      .orderBy('created_at', 'asc')
  }
}
