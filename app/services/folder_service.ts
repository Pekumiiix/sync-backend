import { AccessLevelType, RoleType } from '#enums/member'
import Folder from '#models/folder'
import User from '#models/user'
import { Exception } from '@adonisjs/core/exceptions'

export class FolderService {
  static async getFolders(user: User) {
    const [systemFolders, ownedFolders, sharedFolders] = await Promise.all([
      user.related('ownedFolders').query().where('is_system', true).orderBy('created_at', 'asc'),
      user.related('ownedFolders').query().where('is_system', false).orderBy('created_at', 'asc'),
      user.related('sharedFolders').query().orderBy('created_at', 'asc'),
    ])

    return { systemFolders, ownedFolders, sharedFolders }
  }

  static async getFolderWithPermissions(folderId: string, user: User) {
    const folder = await Folder.query()
      .where('id', folderId)
      .preload('users', (query) => {
        query.select('id', 'first_name', 'last_name', 'avatar_url').limit(3)
      })
      .firstOrFail()

    const membership = await user
      .related('memberships')
      .query()
      .where('folder_id', folder.id)
      .first()

    const isOwner = folder.userId === user.id
    const isMember = !!membership

    if (!isOwner && !isMember) {
      if (folder.password !== null) {
        throw new Exception('Provide a password to access this folder', {
          code: 'E_PASSWORD_REQUIRED',
          status: 401,
        })
      } else {
        throw new Exception('You do not have permission to view this folder', {
          code: 'E_UNAUTHORIZED_ACCESS',
          status: 403,
        })
      }
    }

    let role: RoleType = 'member'
    let accessLevel: AccessLevelType = 'viewer'

    if (isOwner) {
      role = 'owner'
      accessLevel = 'editor'
    } else if (membership) {
      role = membership.role
      accessLevel = membership.accessLevel
    }

    const previewMembers = folder.users
      ? folder.users.map((u) => ({
          id: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          avatarUrl: u.avatarUrl,
        }))
      : []

    return {
      folder,
      permission: { role, accessLevel },
      previewMembers,
    }
  }
}
