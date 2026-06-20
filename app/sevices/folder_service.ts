import Folder from '#models/folder'
import User from '#models/user'

export default class FolderService {
  static async getFolderWithPermissions(folderId: string, user: User) {
    const folder = await Folder.query()
      .where('id', folderId)
      .where((query) => {
        query.where('userId', user.id).orWhereHas('members', (memberQuery) => {
          memberQuery.where('userId', user.id)
        })
      })
      .preload('users', (query) => {
        query.select('id', 'firstName', 'lastName', 'avatarUrl').limit(3)
      })
      .firstOrFail()

    let role = 'member'
    let accessLevel = 'viewer'

    if (folder.userId === user.id) {
      role = 'admin'
      accessLevel = 'editor'
    } else {
      const membership = await user
        .related('memberships')
        .query()
        .where('folderId', folder.id)
        .first()

      if (membership) {
        role = membership.role
        accessLevel = membership.accessLevel
      }
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
