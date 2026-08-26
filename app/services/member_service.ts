import { inject } from '@adonisjs/core'
import { Exception } from '@adonisjs/core/exceptions'
import db from '@adonisjs/lucid/services/db'
import { type TransactionClientContract } from '@adonisjs/lucid/types/database'

import { type AccessLevelType, type RoleType } from '#enums/member'
import { events } from '#generated/events'
import Folder from '#models/folder'
import Member from '#models/member'
import type User from '#models/user'
import { UserSettingsSchema } from '#interfaces/user'

@inject()
export class MemberService {
  async checkPermissions(userId: string, folderId: string) {
    const [folder, membership] = await Promise.all([
      Folder.query().select('id', 'user_id').where('id', folderId).firstOrFail(),
      Member.query().where('user_id', userId).where('folder_id', folderId).first(),
    ])

    if (folder.userId === userId) {
      return {
        isMember: true,
        isOwner: true,
        role: 'owner' as RoleType,
        accessLevel: 'editor' as AccessLevelType,
      }
    }

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

  async requireRole(userId: string, folderId: string, allowedRole: RoleType) {
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

  async requireAccessLevel(userId: string, folderId: string, allowedAccessLevel: AccessLevelType) {
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

  async requireAccessLevelBulk(
    userId: string,
    folderIds: string[],
    allowedAccessLevel: AccessLevelType
  ) {
    const result = await Member.query()
      .where('user_id', userId)
      .whereIn('folder_id', folderIds)
      .where('access_level', allowedAccessLevel)
      .count('* as total')

    const authorizedCount = Number(result[0].$extras.total)

    if (authorizedCount !== folderIds.length) {
      throw new Exception('You lack sufficient permissions for one or more folders.', {
        status: 403,
      })
    }
  }

  async getFolderPreviews(folderId: string, limit: number) {
    const members = await Member.query()
      .where('folder_id', folderId)
      .preload('user', (q) => q.select('first_name', 'last_name', 'avatar_url'))
      .limit(limit)

    return members.map((member) => ({
      firstName: member.user.firstName,
      lastName: member.user.lastName,
      avatarUrl: member.user.avatarUrl,
    }))
  }

  async destroyMember(folderId: string, memberId: string, initiator: User) {
    return await db.transaction(async (trx) => {
      const member = await Member.query({ client: trx })
        .where('id', memberId)
        .where('folder_id', folderId)
        .preload('user', (q) => q.select('id', 'first_name'))
        .firstOrFail()

      if (member.userId === initiator.id) {
        throw new Exception('Owners cannot remove themselves from their own folder.', {
          status: 403,
        })
      }

      await member.delete()

      events.MemberRemoved.dispatch(initiator, folderId, member.user.firstName)

      return member
    })
  }

  async leaveFolder(folderId: string, user: User) {
    const member = await db.transaction(async (trx) => {
      const membership = await Member.query({ client: trx })
        .where('user_id', user.id)
        .where('folder_id', folderId)
        .firstOrFail()

      if (membership.role === 'owner') {
        throw new Exception('Folder owners cannot leave their own folder.', { status: 403 })
      }

      await membership.delete()

      return membership
    })

    events.MemberLeft.dispatch(folderId, user)

    return member
  }

  async getMembers(folderId: string, excludeUserId?: string) {
    return await Member.query()
      .where('folder_id', folderId)
      .if(excludeUserId, (query) => {
        query.whereNot('user_id', excludeUserId!)
      })
      .preload('user', (q) => q.select('id', 'first_name', 'last_name', 'avatar_url'))
      .preload('folder', (q) => q.select('id', 'name'))
      .orderBy('created_at', 'asc')
  }

  async getNotifiableMembers(
    folderId: string,
    settingsKey: keyof UserSettingsSchema,
    excludeUserId: string
  ) {
    const members = await this.getMembers(folderId, excludeUserId)

    return members.filter((member) => {
      const settingValue = member.user.settings?.[settingsKey]

      return settingValue ?? true
    })
  }

  async checkMembership(folderId: string, userId: string, trx?: TransactionClientContract) {
    const membership = await Member.query({ client: trx })
      .where('folder_id', folderId)
      .where('user_id', userId)
      .first()

    return membership !== null
  }

  async updateMemberAccess(
    folderId: string,
    memberId: string,
    initiator: User,
    accessLevel: AccessLevelType
  ) {
    await this.requireRole(initiator.id, folderId, 'owner')

    const member = await Member.query()
      .where('id', memberId)
      .where('folder_id', folderId)
      .preload('user', (q) => q.select('id', 'first_name', 'last_name', 'avatar_url'))
      .firstOrFail()

    if (member.userId === initiator.id) {
      throw new Exception('You cannot change your own access level.', { status: 403 })
    }

    member.accessLevel = accessLevel

    await member.save()

    return member
  }
}
