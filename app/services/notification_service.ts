import User from '#models/user'

export default class NotificationService {
  static async getNotification(notificationId: string, user: User) {
    const notification = await user
      .related('notifications')
      .query()
      .where('id', notificationId)
      .firstOrFail()

    return { notification }
  }

  static async getUserNotifications(user: User, page: number, limit: number) {
    const paginatedNotifications = await user
      .related('notifications')
      .query()
      .orderBy('created_at', 'desc')
      .paginate(page, limit)

    const unreadResult = await user
      .related('notifications')
      .query()
      .whereNull('read_at')
      .count('* as total')

    const unreadCount = Number(unreadResult[0].$extras.total) || 0

    const meta = paginatedNotifications.getMeta()

    return {
      notifications: paginatedNotifications,
      unreadCount,
      totalCount: meta.total,
      currentPage: meta.currentPage,
      totalPages: meta.lastPage,
    }
  }
}
