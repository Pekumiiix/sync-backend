import Folder from '#models/folder'
import type User from '#models/user'
import { Exception } from '@adonisjs/core/exceptions'
import { MemberService } from './member_service.ts'
import { events } from '#generated/events'
import Member from '#models/member'
import db from '@adonisjs/lucid/services/db'
import hash from '@adonisjs/core/services/hash'
import Bookmark from '#models/bookmark'
import { type TransactionClientContract } from '@adonisjs/lucid/types/database'

export class FolderService {
  static async createFolder(user: User, name: string) {
    const folder = await user.related('ownedFolders').create({
      name,
      isSystem: false,
      bookmarkCount: 0,
      recentBookmarksImages: [],
    })

    return folder
  }

  static async deleteFolder(folderId: string, user: User) {
    const folder = await user.related('ownedFolders').query().where('id', folderId).first()

    if (!folder) {
      throw new Exception('Folder not found or you do not have permission to delete it.', {
        status: 404,
      })
    }

    if (folder.isSystem) {
      throw new Exception('System folders cannot be deleted.', { status: 400 })
    }

    const members = await MemberService.getMembers(folder.id)

    await folder.delete()

    events.FolderDeleted.dispatch(folder.name, user, members)
  }

  static async updateFolder(folderId: string, user: User, name: string) {
    const { folder, permission } = await this.getFolderWithPermissions(folderId, user)

    const oldFoldwerName = folder.name

    if (permission.accessLevel !== 'editor') {
      throw new Exception('You do not have permission to update this folder.', { status: 403 })
    }

    folder.name = name

    await folder.save()

    events.FolderUpdated.dispatch(folder.id, oldFoldwerName, user)

    return folder
  }

  static async joinFolder(folderId: string, user: User, password?: string) {
    const folder = await Folder.findOrFail(folderId)

    if (folder.userId === user.id) {
      throw new Exception('You are the owner of this folder and already have full access.', {
        status: 400,
      })
    }

    const membership = await user
      .related('memberships')
      .query()
      .where('folder_id', folder.id)
      .first()

    if (membership) {
      throw new Exception('You are already a member of this folder.', { status: 400 })
    }

    if (folder.password !== null) {
      const isPasswordValid = await hash.verify(folder.password, password || '')
      if (!isPasswordValid) {
        throw new Exception('Invalid password provided for this folder.', { status: 401 })
      }
    }

    await db.transaction(async (trx) => {
      await Member.create(
        {
          userId: user.id,
          folderId: folder.id,
          role: 'member',
          accessLevel: 'viewer',
        },
        { client: trx }
      )
    })

    events.MemberJoined.dispatch(folder.id, user)
  }

  static async getFolders(user: User) {
    const [systemFolders, ownedFolders, sharedFolders] = await Promise.all([
      user.related('ownedFolders').query().where('is_system', true).orderBy('created_at', 'asc'),
      user.related('ownedFolders').query().where('is_system', false).orderBy('created_at', 'asc'),
      user.related('sharedFolders').query().orderBy('created_at', 'asc'),
    ])

    return { systemFolders, ownedFolders, sharedFolders }
  }

  static async getFolderWithPermissions(folderId: string, user: User) {
    const folder = await Folder.query().where('id', folderId).firstOrFail()

    const { isOwner, isMember, role, accessLevel } = await MemberService.checkPermissions(
      user.id,
      folder.id
    )

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

    const previewMembers = await MemberService.getFolderPreviews(folderId, 3)

    return {
      folder,
      permission: { role, accessLevel },
      previewMembers,
    }
  }

  static async syncFolderRecentImages(folderId: string, trx?: TransactionClientContract) {
    const query = trx ? Bookmark.query({ client: trx }) : Bookmark.query()

    const recentBookmarks = await query
      .where('folder_id', folderId)
      .whereNotNull('cover_image_url')
      .whereNot('cover_image_url', '')
      .orderBy('created_at', 'desc')
      .limit(3)
      .select('cover_image_url')

    const imageUrls = recentBookmarks.map((b) => b.coverImageUrl)

    const folderQuery = trx ? Folder.query({ client: trx }) : Folder.query()

    await folderQuery
      .where('id', folderId)
      .update({ recent_bookmarks_images: JSON.stringify(imageUrls) })
  }
}
