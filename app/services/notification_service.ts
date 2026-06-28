import User from '#models/user'

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
      user.related('notifications').query().paginate(page, limit),
      user.related('notifications').query().whereNull('read_at').count('* as count'),
    ])

    const meta = notifications.getMeta()

    return {
      notifications,
      unreadCount: unreadCount[0].$extras.count,
      totalCount: meta.total,
      currentPage: meta.currentPage,
      totalPages: meta.lastPage,
    }
  }
}
