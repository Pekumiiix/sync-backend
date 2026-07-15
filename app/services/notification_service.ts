import { type NotificationType } from '#enums/notification'
import type Member from '#models/member'
import Notification from '#models/notification'
import type User from '#models/user'

export class NotificationService {
  static async getNotification(notificationId: string, user: User) {
    const notification = await user
      .related('notifications')
      .query()
      .where('id', notificationId)
      .firstOrFail()

    return { notification }
  }

  static async getUserNotifications(user: User, page: number, limit: number) {
    const [notifications, unreadCount] = await Promise.all([
      user.related('notifications').query().orderBy('created_at', 'desc').paginate(page, limit),
      user.related('notifications').query().whereNull('read_at').count('* as count'),
    ])

    const meta = notifications.getMeta()

    return {
      notifications,
      unreadCount: Number(unreadCount[0].$extras.count),
      totalCount: meta.total,
      currentPage: meta.currentPage,
      totalPages: meta.lastPage,
    }
  }

  static async notifyMembers(
    members: Member[],
    actor: User,
    targetName: string | null,
    type: NotificationType
  ) {
    if (members.length === 0) return

    const notificationsToInsert = members.map((member) => ({
      userId: member.userId,
      type,
      data: {
        folderId: member.folder.id,
        folderName: member.folder.name,

        actorId: actor.id,
        firstName: actor.firstName,
        lastName: actor.lastName,
        avatar: actor.avatarUrl,

        targetName,
      },
    }))

    await Notification.createMany(notificationsToInsert)
  }
}
