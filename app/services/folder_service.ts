import { inject } from '@adonisjs/core'
import { Exception } from '@adonisjs/core/exceptions'
import { type TransactionClientContract } from '@adonisjs/lucid/types/database'
import { events } from '#generated/events'
import Bookmark from '#models/bookmark'
import Folder from '#models/folder'
import type User from '#models/user'
import { MemberService } from './member_service.ts'
import db from '@adonisjs/lucid/services/db'
import hash from '@adonisjs/core/services/hash'

@inject()
export class FolderService {
  constructor(protected memberService: MemberService) {}

  async createFolder(user: User, name: string) {
    return user.related('ownedFolders').create({
      name,
      isSystem: false,
      bookmarkCount: 0,
      recentBookmarksImages: [],
    })
  }

  async deleteFolder(folderId: string, user: User) {
    const folder = await user.related('ownedFolders').query().where('id', folderId).firstOrFail()

    if (folder.isSystem) {
      throw new Exception('System folders cannot be deleted.', { status: 400 })
    }

    const members = await this.memberService.getMembers(folder.id, user.id)

    await folder.delete()

    events.FolderDeleted.dispatch(folder.name, user, members)
  }

  async updateFolder(folderId: string, user: User, name: string) {
    const { folder, permission } = await this.getFolderWithPermissions(folderId, user)

    if (permission.accessLevel !== 'editor') {
      throw new Exception('You do not have permission to update this folder.', { status: 403 })
    }

    const oldFolderName = folder.name
    folder.name = name

    await folder.save()

    events.FolderUpdated.dispatch(folder.id, oldFolderName, user)

    return folder
  }

  async getFolders(user: User) {
    const [allOwnedFolders, sharedFolders] = await Promise.all([
      user.related('ownedFolders').query().orderBy('created_at', 'asc'),
      user
        .related('sharedFolders')
        .query()
        .whereNot('folders.user_id', user.id)
        .orderBy('created_at', 'asc'),
    ])

    const systemFolders: Folder[] = []
    const ownedFolders: Folder[] = []
    let totalBookmarks = 0

    for (const folder of allOwnedFolders) {
      if (folder.isSystem) {
        systemFolders.push(folder)
      } else {
        ownedFolders.push(folder)
      }
      totalBookmarks += folder.bookmarkCount
    }

    for (const folder of sharedFolders) {
      totalBookmarks += folder.bookmarkCount
    }

    return { systemFolders, ownedFolders, sharedFolders, totalBookmarks }
  }

  async getFolderWithPermissions(folderId: string, user: User) {
    const folder = await Folder.query().where('id', folderId).firstOrFail()

    const { isOwner, isMember, role, accessLevel } = await this.memberService.checkPermissions(
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

    const previewMembers = await this.memberService.getFolderPreviews(folderId, 3)

    return {
      folder,
      permission: { role, accessLevel },
      previewMembers,
    }
  }

  async syncFolderRecentImages(folderId: string, trx?: TransactionClientContract) {
    const query = trx ? Bookmark.query({ client: trx }) : Bookmark.query()
    const folderQuery = trx ? Folder.query({ client: trx }) : Folder.query()

    const recentBookmarks = await query
      .where('folder_id', folderId)
      .whereNotNull('cover_image_url')
      .whereNot('cover_image_url', '')
      .orderBy('created_at', 'desc')
      .limit(3)
      .select('cover_image_url')

    const imageUrls = recentBookmarks.map((b) => b.coverImageUrl)

    await folderQuery
      .where('id', folderId)
      .update({ recent_bookmarks_images: JSON.stringify(imageUrls) })
  }

  async updatePassword(folderId: string, user: User, password: string | null) {
    const folder = await Folder.findOrFail(folderId)

    await this.memberService.requireRole(user.id, folder.id, 'owner')

    if (password === null && folder.password === null) {
      return folder
    }

    folder.password = password

    await folder.save()

    return folder
  }

  async changePassword(folderId: string, user: User, oldPassword: string, newPassword: string) {
    const folder = await Folder.findOrFail(folderId)

    await this.memberService.requireRole(user.id, folder.id, 'owner')

    if (folder.password === null) {
      throw new Exception('Folder does not have a password set.', { status: 400 })
    }

    const isPasswordValid = await hash.verify(folder.password, oldPassword)

    if (!isPasswordValid) {
      throw new Exception('The provided password is incorrect.', { status: 400 })
    }

    folder.password = newPassword
    await folder.save()

    return folder
  }

  async getAccessibleFolderIds(userId: string): Promise<string[]> {
    const [memberFolders, ownedFolders] = await Promise.all([
      db.from('members').select('folder_id').where('user_id', userId),
      db.from('folders').select('id').where('user_id', userId),
    ])

    return [...memberFolders.map((m) => m.folder_id), ...ownedFolders.map((f) => f.id)]
  }
}
